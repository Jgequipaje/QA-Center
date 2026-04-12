import { Router } from "express";
import { promises as fs } from "fs";
import path from "path";

export const testsRouter = Router();

const TEST_FILE_PATTERN = /\.(spec|test)\.(ts|js)$/;

function cacheFile(cwd) {
  return path.join(cwd, "qa-tests-cache.json");
}

function stableId(file, fullTitle) {
  const raw = `${file}::${fullTitle}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) - hash) + raw.charCodeAt(i);
    hash |= 0;
  }
  return `test-${Math.abs(hash).toString(36)}`;
}

function extractTests(source, filePath) {
  const results = [];
  const lines = source.split("\n");
  let currentDescribe;

  for (const line of lines) {
    const describeMatch = line.match(/(?:test\.describe|describe)\s*\(\s*["'`](.+?)["'`]/);
    if (describeMatch) { currentDescribe = describeMatch[1]; continue; }

    const testMatch = line.match(/^\s*(?:test|it)\s*(?:\.only|\.skip)?\s*\(\s*["'`](.+?)["'`]/);
    if (testMatch) {
      const testTitle = testMatch[1];
      const fullTitle = currentDescribe ? `${currentDescribe} > ${testTitle}` : testTitle;
      results.push({ file: filePath, describe: currentDescribe, testTitle, fullTitle });
    }
  }
  return results;
}

async function scanDir(dir, depth = 0) {
  if (depth > 5) return []; // prevent runaway recursion
  const files = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isSymbolicLink()) continue; // skip symlinks to avoid traversal
      const full = path.join(dir, entry.name);
      if (entry.isDirectory() && entry.name !== "node_modules" && !entry.name.startsWith(".")) {
        files.push(...await scanDir(full, depth + 1));
      } else if (entry.isFile() && TEST_FILE_PATTERN.test(entry.name)) {
        files.push(full);
      }
    }
  } catch { /* dir doesn't exist — skip */ }
  return files;
}

async function discoverTests(cwd) {
  const SCAN_DIRS = ["tests", "playwright-automation", "e2e"];
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

// GET /api/qa-tests — return cached tests
testsRouter.get("/", async (req, res) => {
  try {
    const raw = await fs.readFile(cacheFile(req.appCwd), "utf-8");
    return res.json(JSON.parse(raw));
  } catch {
    const tests = await discoverTests(req.appCwd);
    await fs.writeFile(cacheFile(req.appCwd), JSON.stringify(tests, null, 2));
    return res.json(tests);
  }
});

// POST /api/qa-tests — force rescan
testsRouter.post("/", async (req, res) => {
  const tests = await discoverTests(req.appCwd);
  await fs.writeFile(cacheFile(req.appCwd), JSON.stringify(tests, null, 2));
  res.json({ count: tests.length, tests });
});
