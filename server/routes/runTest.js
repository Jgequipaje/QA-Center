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
    const reportFile = path.join(cwd, ".qa-report.json");

    // Use a short keyword from the title to avoid shell quoting issues
    // e.g. "should open drawer when button is clicked" -> "open drawer"
    const words = grepTitle.trim().split(/\s+/);
    const keyword = words.slice(1, 4).join(" ") || words[0]; // skip "should", take next 3 words

    const args = ["playwright", "test", testFile, "-g", keyword, "--reporter=json", "--workers=1"];

    const proc = spawn("npx", args, {
      cwd,
      shell: true,
      env: { ...process.env, PLAYWRIGHT_HTML_OPEN: "never", PLAYWRIGHT_JSON_OUTPUT_NAME: reportFile },
    });

    let output = "";
    proc.stdout?.on("data", (d) => { output += d.toString(); });
    proc.stderr?.on("data", (d) => { output += d.toString(); });
    proc.on("close", (code) => resolve({ exitCode: code ?? 1, output, reportFile }));
    proc.on("error", (err) => resolve({ exitCode: 1, output: err.message, reportFile }));
  });
}

/**
 * Parse Playwright JSON report.
 * Returns map of testTitle -> { passed, message }
 */
async function parseReport(reportFile) {
  const results = new Map();
  try {
    const raw = await fs.readFile(reportFile, "utf-8");
    const report = JSON.parse(raw);

    function walk(suites) {
      for (const suite of suites ?? []) {
        for (const spec of suite.specs ?? []) {
          const passed = spec.tests?.every((t) =>
            t.results?.every((r) => r.status === "passed")
          ) ?? false;

          let message = passed ? "Test passed successfully." : "";
          if (!passed) {
            for (const test of spec.tests ?? []) {
              for (const result of test.results ?? []) {
                if (result.error?.message) {
                  message = result.error.message.slice(0, 500);
                  break;
                }
              }
              if (message) break;
            }
            if (!message) message = "Test failed.";
          }
          results.set(spec.title, { passed, message });
        }
        walk(suite.suites);
      }
    }
    walk(report.suites);
  } catch { /* report missing or malformed */ }
  return results;
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
  const { exitCode, output, reportFile } = await runPlaywright(file, testTitle, cwd);

  const results = await parseReport(reportFile);
  try { await fs.unlink(reportFile); } catch { /* ignore */ }

  // Match by partial title (case-insensitive)
  const titleLower = testTitle.toLowerCase();
  let match = results.get(testTitle); // exact first
  if (!match) {
    for (const [key, val] of results) {
      if (key.toLowerCase().includes(titleLower) || titleLower.includes(key.toLowerCase())) {
        match = val;
        break;
      }
    }
  }

  let result;
  let message;

  if (match) {
    result = match.passed ? "passed" : "failed";
    message = match.message;
  } else {
    const stripAnsi = (s) => s.replace(/\x1B\[[0-9;]*m/g, "");
    const lines = stripAnsi(output).split("\n").map((l) => l.trim()).filter(Boolean);
    result = exitCode === 0 ? "passed" : "failed";
    message = lines.slice(-10).join("\n") || "Test not found in report.";
  }

  // Debug
  await fs.writeFile(
    path.join(cwd, "playwright-debug.txt"),
    `Title: ${testTitle}\nFile: ${file}\nExit: ${exitCode}\nResult: ${result}\n\n${message}\n\nRaw:\n${output}`,
    "utf-8"
  ).catch(() => {});

  issues[idx] = { ...issue, updatedAt: Date.now(), automationStatus: { result, lastRun: now, message } };
  await writeIssues(cwd, issues);
  res.json(issues[idx]);
});
