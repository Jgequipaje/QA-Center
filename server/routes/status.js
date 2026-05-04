import { Router } from "express";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const statusRouter = Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, "../../dist");

function dataFile(cwd) {
  return path.join(cwd, "qa-issues.json");
}

function cacheFile(cwd) {
  return path.join(cwd, "qa-tests-cache.json");
}

// GET /api/status
statusRouter.get("/", async (req, res) => {
  const cwd = req.appCwd;
  const errors = [];

  // --- issues ---
  let issues = [];
  let issuesFile = dataFile(cwd);
  let issuesFileStat = null;
  try {
    const raw = await fs.readFile(issuesFile, "utf-8");
    issues = JSON.parse(raw);
    if (!Array.isArray(issues)) {
      errors.push("qa-issues.json is not a valid array");
      issues = [];
    }
    issuesFileStat = await fs.stat(issuesFile);
  } catch (e) {
    if (e.code !== "ENOENT") errors.push(`Failed to read qa-issues.json: ${e.message}`);
  }

  // --- tests cache ---
  let tests = [];
  let testsFile = cacheFile(cwd);
  let testsFileStat = null;
  try {
    const raw = await fs.readFile(testsFile, "utf-8");
    tests = JSON.parse(raw);
    if (!Array.isArray(tests)) {
      errors.push("qa-tests-cache.json is not a valid array");
      tests = [];
    }
    testsFileStat = await fs.stat(testsFile);
  } catch (e) {
    if (e.code !== "ENOENT") errors.push(`Failed to read qa-tests-cache.json: ${e.message}`);
  }

  // --- dist ---
  let distBuilt = false;
  try {
    await fs.stat(path.join(DIST, "index.html"));
    distBuilt = true;
  } catch {
    /* not built */
  }

  // --- neko sprite ---
  // The gif lives on the Vite dev server (port 5173) or the consumer's app,
  // not on this API server. We check common local origins.
  const nekoStatus = { accessible: false, url: null, checkedUrls: [] };
  const candidateOrigins = [
    "http://localhost:5173",
    "http://localhost:4173",
    "http://localhost:3000",
  ];
  for (const origin of candidateOrigins) {
    const url = `${origin}/oneko.gif`;
    nekoStatus.checkedUrls.push(url);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 1500);
      const r = await fetch(url, { method: "HEAD", signal: controller.signal });
      clearTimeout(timeout);
      if (r.ok) {
        nekoStatus.accessible = true;
        nekoStatus.url = url;
        break;
      }
    } catch {
      /* unreachable or timed out — try next */
    }
  }

  // --- issue summary ---
  const byStatus = {};
  for (const issue of issues) {
    byStatus[issue.status] = (byStatus[issue.status] ?? 0) + 1;
  }

  res.json({
    status: errors.length === 0 ? "ok" : "degraded",
    errors,
    server: {
      uptime: Math.floor(process.uptime()),
      nodeVersion: process.version,
      cwd,
      distBuilt,
    },
    neko: {
      accessible: nekoStatus.accessible,
      url: nekoStatus.url,
      note: nekoStatus.accessible
        ? "oneko.gif is reachable — neko will render correctly."
        : "oneko.gif not found on any known local origin. Make sure your UI dev server is running.",
      checkedUrls: nekoStatus.checkedUrls,
    },
    issues: {
      file: issuesFile,
      lastModified: issuesFileStat?.mtime ?? null,
      total: issues.length,
      byStatus,
      data: issues.sort((a, b) => b.createdAt - a.createdAt),
    },
    tests: {
      file: testsFile,
      lastModified: testsFileStat?.mtime ?? null,
      total: tests.length,
      note: tests.length === 0 ? "No tests cached yet. POST /api/qa-tests to scan." : null,
      data: tests,
    },
  });
});
