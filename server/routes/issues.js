import { Router } from "express";
import { promises as fs } from "fs";
import path from "path";

export const issuesRouter = Router();

function dataFile(cwd) {
  return path.join(cwd, "qa-issues.json");
}

async function readIssues(cwd) {
  try {
    const raw = await fs.readFile(dataFile(cwd), "utf-8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Deduplicate by id — keep first occurrence
    const seen = new Set();
    return parsed.filter((i) => {
      if (seen.has(i.id)) return false;
      seen.add(i.id);
      return true;
    });
  } catch {
    return [];
  }
}

async function writeIssues(cwd, issues) {
  await fs.writeFile(dataFile(cwd), JSON.stringify(issues, null, 2), "utf-8");
}

// GET /api/qa-issues
issuesRouter.get("/", async (req, res) => {
  const issues = await readIssues(req.appCwd);
  res.json(issues.sort((a, b) => b.createdAt - a.createdAt));
});

// POST /api/qa-issues
issuesRouter.post("/", async (req, res) => {
  const body = req.body;
  if (!body?.title?.trim()) {
    return res.status(400).json({ error: "Title is required." });
  }
  if (typeof body.title === "string" && body.title.length > 500) {
    return res.status(400).json({ error: "Title too long." });
  }

  const issues = await readIssues(req.appCwd);
  const now = Date.now();
  const newIssue = {
    ...body,
    id: `issue-${now}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: now,
    updatedAt: now,
  };

  if (issues.some((i) => i.id === newIssue.id)) {
    newIssue.id = `issue-${now}-${Math.random().toString(36).slice(2, 8)}`;
  }

  await writeIssues(req.appCwd, [newIssue, ...issues]);
  res.status(201).json(newIssue);
});

// PATCH /api/qa-issues/:id
issuesRouter.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const issues = await readIssues(req.appCwd);
  const idx = issues.findIndex((i) => i.id === id);
  if (idx === -1) return res.status(404).json({ error: "Not found." });

  const ALLOWED = [
    "title", "status", "description", "severity", "area",
    "reproSteps", "expected", "actual", "notes",
    "rawContent", "sourceRef", "sourceFile",
    "linkedTest", "automationStatus",
  ];
  const patch = {};
  for (const key of ALLOWED) {
    if (key in body) patch[key] = body[key];
  }

  issues[idx] = { ...issues[idx], ...patch, id, updatedAt: Date.now() };
  await writeIssues(req.appCwd, issues);
  res.json(issues[idx]);
});

// DELETE /api/qa-issues/:id
issuesRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const issues = await readIssues(req.appCwd);
  const filtered = issues.filter((i) => i.id !== id);
  if (filtered.length === issues.length) {
    return res.status(404).json({ error: "Not found." });
  }
  await writeIssues(req.appCwd, filtered);
  res.json({ ok: true });
});
