import { Router } from "express";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

export const issuesRouter = Router();

const VALID_STATUSES = new Set(["open", "in_progress", "ready_for_qa", "verified", "closed"]);
const VALID_SEVERITIES = new Set(["critical", "high", "medium", "low", "info"]);
const VALID_ORIGINS = new Set(["issue", "imported_markdown", "feature", "note"]);
const FIELD_MAX = 10000; // max chars for long text fields
const TITLE_MAX = 500;

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
  } catch (e) {
    if (e.code !== "ENOENT") console.error("[QA Center] Error reading issues:", e.message);
    return [];
  }
}

async function writeIssues(cwd, issues) {
  await fs.writeFile(dataFile(cwd), JSON.stringify(issues, null, 2), "utf-8");
}

function validateTextField(value, name, max = FIELD_MAX) {
  if (value !== undefined && (typeof value !== "string" || value.length > max)) {
    return `${name} must be a string under ${max} characters.`;
  }
  return null;
}

// GET /api/qa-items
// Supports optional query filters: ?origin=issue|imported_markdown|feature|note
//                                  ?status=open|in_progress|ready_for_qa|verified|closed
issuesRouter.get("/", async (req, res) => {
  const { origin, status } = req.query;

  if (origin && !VALID_ORIGINS.has(origin)) {
    return res.status(400).json({ error: "Invalid origin filter value." });
  }
  if (status && !VALID_STATUSES.has(status)) {
    return res.status(400).json({ error: "Invalid status filter value." });
  }

  let issues = await readIssues(req.appCwd);

  if (origin) issues = issues.filter((i) => i.origin === origin);
  if (status) issues = issues.filter((i) => i.status === status);

  res.json(issues.sort((a, b) => b.createdAt - a.createdAt));
});

// POST /api/qa-items
issuesRouter.post("/", async (req, res) => {
  const body = req.body;
  if (!body?.title?.trim()) {
    return res.status(400).json({ error: "Title is required." });
  }
  if (body.title.length > TITLE_MAX) {
    return res.status(400).json({ error: `Title must be under ${TITLE_MAX} characters.` });
  }
  if (body.status && !VALID_STATUSES.has(body.status)) {
    return res.status(400).json({ error: "Invalid status value." });
  }
  if (body.severity && !VALID_SEVERITIES.has(body.severity)) {
    return res.status(400).json({ error: "Invalid severity value." });
  }
  if (body.origin && !VALID_ORIGINS.has(body.origin)) {
    return res.status(400).json({ error: "Invalid origin value." });
  }

  for (const field of [
    "description",
    "area",
    "reproSteps",
    "expected",
    "actual",
    "notes",
    "rawContent",
  ]) {
    const err = validateTextField(body[field], field);
    if (err) return res.status(400).json({ error: err });
  }

  const issues = await readIssues(req.appCwd);

  // Enforce unique title within the same origin/category
  const duplicate = issues.find(
    (i) =>
      i.origin === (body.origin ?? "issue") &&
      i.title?.trim().toLowerCase() === body.title.trim().toLowerCase()
  );
  if (duplicate) {
    return res.status(409).json({
      error: `"${body.title.trim()}" already exists in this category. Title must be unique.`,
    });
  }

  const now = Date.now();
  const newIssue = {
    id: `issue-${now}-${randomUUID().slice(0, 8)}`,
    origin: body.origin ?? "issue",
    title: body.title.trim(),
    status: body.status ?? "open",
    createdAt: now,
    updatedAt: now,
    ...(body.description && { description: body.description }),
    ...(body.severity && { severity: body.severity }),
    ...(body.area && { area: body.area }),
    ...(body.reproSteps && { reproSteps: body.reproSteps }),
    ...(body.expected && { expected: body.expected }),
    ...(body.actual && { actual: body.actual }),
    ...(body.notes && { notes: body.notes }),
    ...(body.rawContent && { rawContent: body.rawContent }),
    ...(body.sourceRef && { sourceRef: body.sourceRef }),
    ...(body.sourceFile && { sourceFile: body.sourceFile }),
    ...(body.linkedTest && { linkedTest: body.linkedTest }),
  };

  await writeIssues(req.appCwd, [newIssue, ...issues]);
  res.status(201).json(newIssue);
});

// GET /api/qa-items/:id
issuesRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const issues = await readIssues(req.appCwd);
  const issue = issues.find((i) => i.id === id);
  if (!issue) return res.status(404).json({ error: "Not found." });
  res.json(issue);
});

// PATCH /api/qa-items/:id
issuesRouter.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const issues = await readIssues(req.appCwd);
  const idx = issues.findIndex((i) => i.id === id);
  if (idx === -1) return res.status(404).json({ error: "Not found." });

  if (body.status && !VALID_STATUSES.has(body.status)) {
    return res.status(400).json({ error: "Invalid status value." });
  }
  if (body.severity && !VALID_SEVERITIES.has(body.severity)) {
    return res.status(400).json({ error: "Invalid severity value." });
  }
  if (body.title !== undefined && (!body.title.trim() || body.title.length > TITLE_MAX)) {
    return res.status(400).json({ error: "Invalid title." });
  }

  // Enforce unique title within the same origin/category (excluding the item being edited)
  if (body.title !== undefined) {
    const currentItem = issues[idx];
    const duplicate = issues.find(
      (i) =>
        i.id !== id &&
        i.origin === currentItem.origin &&
        i.title?.trim().toLowerCase() === body.title.trim().toLowerCase()
    );
    if (duplicate) {
      return res.status(409).json({
        error: `"${body.title.trim()}" already exists in this category. Title must be unique.`,
      });
    }
  }

  const ALLOWED = [
    "title",
    "status",
    "description",
    "severity",
    "area",
    "reproSteps",
    "expected",
    "actual",
    "notes",
    "rawContent",
    "sourceRef",
    "sourceFile",
    "linkedTest",
    "automationStatus",
  ];
  const patch = {};
  for (const key of ALLOWED) {
    if (key in body) patch[key] = body[key];
  }

  issues[idx] = { ...issues[idx], ...patch, id, updatedAt: Date.now() };
  await writeIssues(req.appCwd, issues);
  res.json(issues[idx]);
});

// DELETE /api/qa-items/:id
issuesRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const issues = await readIssues(req.appCwd);
  const deletedItem = issues.find((i) => i.id === id);

  if (!deletedItem) {
    return res.status(404).json({ error: "Not found." });
  }

  const filtered = issues.filter((i) => i.id !== id);
  await writeIssues(req.appCwd, filtered);

  res.json({
    success: true,
    message: "Item deleted successfully.",
    deleted: {
      id: deletedItem.id,
      title: deletedItem.title,
      origin: deletedItem.origin,
    },
  });
});
