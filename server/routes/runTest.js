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

function runCommand(command, cwd) {
  return new Promise((resolve) => {
    const proc = spawn(command, {
      cwd,
      shell: true,
      env: { ...process.env, PLAYWRIGHT_HTML_OPEN: "never" },
    });

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

  // Use just the testTitle for grep — avoids shell issues with ">" in fullTitle on Windows
  const safeTitle = issue.linkedTest.testTitle.replace(/["`$\\]/g, "").slice(0, 200);
  const now = new Date().toISOString();

  const testFile = issue.linkedTest.file;
  const command = `npx playwright test "${testFile}" --grep "${safeTitle}" --reporter=line --timeout=30000`;

  console.log(`\n[QA Center] Running test:\n  ${command}\n`);
  const { exitCode, output } = await runCommand(command, cwd);

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
