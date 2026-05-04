import { Router } from "express";
import { promises as fs } from "fs";
import fsSync from "fs";
import path from "path";

export const testsRouter = Router();

const TEST_FILE_PATTERN = /\.(spec|test)\.(ts|js)$/;
const SCAN_DIRS = ["tests", "playwright-automation", "e2e"];

// In-memory cache — invalidated when files change
let cachedTests = null;
let watchersStarted = false;

function cacheFile(cwd) {
  return path.join(cwd, "qa-tests-cache.json");
}

function stableId(file, fullTitle) {
  const raw = `${file}::${fullTitle}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = (hash << 5) - hash + raw.charCodeAt(i);
    hash |= 0;
  }
  return `test-${Math.abs(hash).toString(36)}`;
}

/**
 * Extract a stable [id:xxx] tag from a test title if present.
 * e.g. "[id:feat-001] Can Add Feature — Dark mode" → "feat-001"
 */
function extractTestId(title) {
  const match = title.match(/\[id:([^\]]+)\]/);
  return match ? match[1] : undefined;
}

/**
 * Normalise a raw title string extracted from source:
 * - Static strings  → returned as-is
 * - Template literals with expressions → replace ${...} with a "*" wildcard
 *   so DDT tests like `Can Add Feature — ${feature.name}` become
 *   "Can Add Feature — *" and are still discoverable / linkable.
 */
function normaliseTitle(raw) {
  // If the title contains a template expression, replace each ${...} with *
  if (raw.includes("${")) {
    return raw.replace(/\$\{[^}]*\}/g, "*").trim();
  }
  return raw.trim();
}

function extractTests(source, filePath) {
  const results = [];
  const lines = source.split("\n");
  const describeStack = []; // support nested describes

  for (const line of lines) {
    // Detect describe open — push onto stack
    // Matches: test.describe("title", or describe("title",
    const describeMatch = line.match(
      /(?:test\.describe(?:\.only|\.skip)?|describe(?:\.only|\.skip)?)\s*\(\s*["'`](.+?)["'`]/
    );
    if (describeMatch) {
      describeStack.push(normaliseTitle(describeMatch[1]));
      continue;
    }

    // Detect describe close (rough heuristic — closing brace at low indent)
    // This keeps nested describes working without a full AST parser
    if (/^\s*\}\s*\)\s*;?\s*$/.test(line) && describeStack.length > 0) {
      describeStack.pop();
      continue;
    }

    // Detect test / it — static strings AND template literals
    // Matches: test("title",  test(`title`,  test.only("title",  it("title",
    const testMatch = line.match(/^\s*(?:test|it)\s*(?:\.only|\.skip)?\s*\(\s*(["'`])([\s\S]+?)\1/);
    if (testMatch) {
      const rawTitle = testMatch[2];
      const testTitle = normaliseTitle(rawTitle);
      const currentDescribe =
        describeStack.length > 0 ? describeStack[describeStack.length - 1] : undefined;
      const fullTitle = currentDescribe ? `${currentDescribe} > ${testTitle}` : testTitle;
      results.push({
        file: filePath,
        describe: currentDescribe,
        testTitle,
        fullTitle,
        testId: extractTestId(testTitle),
      });
    }
  }
  return results;
}

async function scanDir(dir, depth = 0) {
  if (depth > 5) return [];
  const files = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isSymbolicLink()) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory() && entry.name !== "node_modules" && !entry.name.startsWith(".")) {
        files.push(...(await scanDir(full, depth + 1)));
      } else if (entry.isFile() && TEST_FILE_PATTERN.test(entry.name)) {
        files.push(full);
      }
    }
  } catch {
    /* dir doesn't exist — skip */
  }
  return files;
}

async function discoverTests(cwd) {
  const allTests = [];
  for (const dir of SCAN_DIRS) {
    const files = await scanDir(path.join(cwd, dir));
    for (const file of files) {
      const relPath = path.relative(cwd, file).replace(/\\/g, "/");
      const source = await fs.readFile(file, "utf-8");
      const extracted = extractTests(source, relPath);
      for (const t of extracted) {
        allTests.push({ ...t, id: stableId(t.file, t.fullTitle) });
      }
    }
  }
  return allTests;
}

// Debounce helper — avoids multiple rapid rescans on save
function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

// Watch test directories and invalidate cache on any change
function startWatchers(cwd) {
  if (watchersStarted) return;
  watchersStarted = true;

  const invalidate = debounce(async () => {
    console.log("[QA Center] Test files changed — rescanning...");
    cachedTests = null;
    try {
      const tests = await discoverTests(cwd);
      cachedTests = tests;
      await fs.writeFile(cacheFile(cwd), JSON.stringify(tests, null, 2));
      console.log(`[QA Center] Found ${tests.length} test(s).`);
    } catch (e) {
      console.error("[QA Center] Rescan error:", e.message);
    }
  }, 500);

  for (const dir of SCAN_DIRS) {
    const fullDir = path.join(cwd, dir);
    try {
      fsSync.watch(fullDir, { recursive: true }, (event, filename) => {
        if (filename && TEST_FILE_PATTERN.test(filename)) {
          invalidate();
        }
      });
    } catch {
      /* dir doesn't exist yet — skip */
    }
  }
}

// GET /api/qa-tests — return cached tests, rescan if stale
testsRouter.get("/", async (req, res) => {
  const cwd = req.appCwd;
  startWatchers(cwd);

  if (cachedTests) {
    return res.json(cachedTests);
  }

  try {
    const raw = await fs.readFile(cacheFile(cwd), "utf-8");
    cachedTests = JSON.parse(raw);
    return res.json(cachedTests);
  } catch {
    const tests = await discoverTests(cwd);
    cachedTests = tests;
    await fs.writeFile(cacheFile(cwd), JSON.stringify(tests, null, 2));
    return res.json(tests);
  }
});

// POST /api/qa-tests — force rescan
testsRouter.post("/", async (req, res) => {
  const cwd = req.appCwd;
  startWatchers(cwd);
  cachedTests = null;
  const tests = await discoverTests(cwd);
  cachedTests = tests;
  await fs.writeFile(cacheFile(cwd), JSON.stringify(tests, null, 2));
  res.json({ count: tests.length, tests });
});
