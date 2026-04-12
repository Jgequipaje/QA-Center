import { Router } from "express";
import { promises as fs } from "fs";
import path from "path";
import { spawn } from "child_process";

export const runTestRouter = Router();

function dataFile(cwd) {
  return path.join(cwd, "qa-issues.json");
}

async function readIssues(cwd) {
  try { return JSON.parse(await fs.readFile(dataFile(cwd), "utf-8")); }
  catch { return []; }
}

async function writeIssues(cwd, issues) {
  await fs.writeFile(dataFile(cwd), JSON.stringify(issues, null, 2));
}

/**
 * Validate that a test file path is safe:
 * - Must be a relative path (no absolute paths)
 * - Must not contain path traversal sequences
 * - Must match test file pattern
 */
function isSafeTestFile(filePath, cwd) {
  if (typeof filePath !== "string") return false;
  if (path.isAbsolute(filePath)) return false;
  const resolved = path.resolve(cwd, filePath);
  if (!resolved.startsWith(cwd)) return false;
  if (!/\.(spec|test)\.(ts|js)$/.test(filePath)) return false;
  return true;
}

function runPlaywright(testFile, grepTitle, cwd) {
  return new Promise((resolve) => {
    // Use spawn with array args — no shell interpolation, no injection risk
    const proc = spawn(
      "npx",
      ["playwright", "test", testFile, "--grep", grepTitle, "--reporter=line", "--timeout=30000"],
      {
        cwd,
        shell: false, // explicitly no shell
        env: { ...process.env, PLAYWRIGHT_HTML_OPEN: "never" },
      }
    );

    let output = "";
    proc.stdout?.on("data", (d) => { output += d.toString(); });
    proc.stderr?.on("data", (d) => { output += d.toString(); });
    proc.on("close", (code) => resolve({ exitCode: code ?? 1, output }));
    proc.on("error", (err) => resolve({ exitCode: 1, output: err.message }));
  });
}

// POST /api/qa-issues/:id/run-test
runTestRouter.post("/:id/run-test", async (req, res) => {
  const { id } = req.params;
  const cwd = req.appCwd;
  const issues = await readIssues(cwd);
  const idx = issues.findIndex((i) => i.id === id);

  if (idx === -1) return res.status(404).json({ error: "Issue not found." });
  const issue = issues[idx];
  if (!issue.linkedTest) return res.status(400).json({ error: "No linked test." });

  const testFile = issue.linkedTest.file;

  // Validate file path before executing anything
  if (!isSafeTestFile(testFile, cwd)) {
    return res.status(400).json({ error: "Invalid or unsafe test file path." });
  }

  const grepTitle = String(issue.linkedTest.testTitle ?? "").slice(0, 200);
  const now = new Date().toISOString();

  console.log(`\n[QA Center] Running test: ${testFile} — "${grepTitle}"\n`);
  const { exitCode, output } = await runPlaywright(testFile, grepTitle, cwd);

  let result;
  let message;

  if (exitCode === 0) {
    result = "passed";
    message = "Test passed successfully.";
  } else {
    result = "failed";
    const stripAnsi = (s) => s.replace(/\x1B\[[0-9;]*m/g, "");
    const lines = stripAnsi(output).split("\n");
    const errorIdx = lines.findIndex((l) =>
      l.includes("Error:") || l.includes("TimeoutError") || l.includes("expect(")
    );
    if (errorIdx !== -1) {
      message = lines.slice(errorIdx, errorIdx + 5).map((l) => l.trim()).filter(Boolean).join("\n");
    } else {
      message = lines.find((l) => l.includes("FAILED"))?.trim() ?? "Test failed.";
    }
  }

  issues[idx] = { ...issue, updatedAt: Date.now(), automationStatus: { result, lastRun: now, message } };
  await writeIssues(cwd, issues);
  res.json(issues[idx]);
});
