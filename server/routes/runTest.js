import { Router } from "express";
import { promises as fs } from "fs";
import path from "path";
import { spawn } from "child_process";

export const runTestRouter = Router();

function dataFile(cwd) { return path.join(cwd, "qa-issues.json"); }

async function readIssues(cwd) {
  try { return JSON.parse(await fs.readFile(dataFile(cwd), "utf-8")); }
  catch { return []; }
}

async function writeIssues(cwd, issues) {
  await fs.writeFile(dataFile(cwd), JSON.stringify(issues, null, 2));
}

function isSafeTestFile(filePath, cwd) {
  if (typeof filePath !== "string" || path.isAbsolute(filePath)) return false;
  if (!path.resolve(cwd, filePath).startsWith(cwd)) return false;
  return /\.(spec|test)\.(ts|js)$/.test(filePath);
}

/**
 * Run: npx playwright test <file> -g "<partial title>" --reporter=json
 * Simple, no config generation, no tags required.
 */
function runPlaywright(testFile, grepTitle, cwd) {
  return new Promise((resolve) => {
    const words = grepTitle.trim().split(/\s+/);
    const keyword = words.slice(1, 4).join(" ") || words[0];

    // Use --reporter=line (stdout only, no file I/O) and add a hard timeout
    const args = ["playwright", "test", testFile, "-g", keyword, "--reporter=line", "--workers=1", "--timeout=15000"];

    const proc = spawn("npx", args, {
      cwd,
      shell: true,
      env: { ...process.env, PLAYWRIGHT_HTML_OPEN: "never" },
    });

    let output = "";
    proc.stdout?.on("data", (d) => { output += d.toString(); });
    proc.stderr?.on("data", (d) => { output += d.toString(); });

    // Hard kill after 30s to prevent hanging requests
    const killer = setTimeout(() => {
      proc.kill("SIGKILL");
      resolve({ exitCode: 1, output: output + "\n[Timeout: test exceeded 30s]" });
    }, 30000);

    proc.on("close", (code) => {
      clearTimeout(killer);
      resolve({ exitCode: code ?? 1, output });
    });
    proc.on("error", (err) => {
      clearTimeout(killer);
      resolve({ exitCode: 1, output: err.message });
    });
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
  if (!isSafeTestFile(issue.linkedTest.file, cwd)) {
    return res.status(400).json({ error: "Invalid or unsafe test file path." });
  }

  const { file, testTitle } = issue.linkedTest;
  const now = new Date().toISOString();

  console.log(`\n[QA Center] Running: ${file} -g "${testTitle}"\n`);
  const { exitCode, output } = await runPlaywright(file, testTitle, cwd);

  const stripAnsi = (s) => s.replace(/\x1B\[[0-9;]*m/g, "");
  const cleanOutput = stripAnsi(output);
  const lines = cleanOutput.split("\n").map((l) => l.trim()).filter(Boolean);

  let result;
  let message;

  if (exitCode === 0) {
    result = "passed";
    message = "Test passed successfully.";
  } else {
    result = "failed";
    const errorIdx = lines.findIndex((l) =>
      l.includes("Error:") || l.includes("TimeoutError") || l.includes("expect(") || l.includes("Timeout:")
    );
    if (errorIdx !== -1) {
      message = lines.slice(errorIdx, errorIdx + 6).join("\n");
    } else {
      message = lines.slice(-8).join("\n") || "Test failed.";
    }
  }

  issues[idx] = { ...issue, updatedAt: Date.now(), automationStatus: { result, lastRun: now, message } };
  await writeIssues(cwd, issues);
  res.json(issues[idx]);
});
