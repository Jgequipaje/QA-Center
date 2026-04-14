import type { IssueStatus } from "../types";

export type ParsedMarkdownIssue = {
  ref: string;
  title: string;
  status: IssueStatus;
  rawContent: string;
  warnings: string[];
};

export type ParseResult = {
  issues: ParsedMarkdownIssue[];
  parseError?: string;
};

const STATUS_MAP: Record<string, IssueStatus> = {
  open: "open",
  "in progress": "in_progress",
  in_progress: "in_progress",
  "ready for qa": "ready_for_qa",
  ready_for_qa: "ready_for_qa",
  verified: "verified",
  closed: "closed",
};

function extractInlineField(lines: string[], fieldName: string): string | undefined {
  const prefix = `${fieldName.toLowerCase()}:`;
  const line = lines.find((l) => l.toLowerCase().trimStart().startsWith(prefix));
  if (!line) return undefined;
  return line.slice(line.toLowerCase().indexOf(prefix) + prefix.length).trim() || undefined;
}

export function parseMarkdownIssues(markdown: string): ParseResult {
  const sections = markdown.split(/^##\s+/m).filter((s) => s.trim());

  if (sections.length === 0) {
    return {
      issues: [],
      parseError:
        "No sections found. Each issue should start with a ## heading (e.g. ## ISSUE-001).",
    };
  }

  const issues: ParsedMarkdownIssue[] = [];

  for (const section of sections) {
    const lines = section.split("\n");
    const ref = lines[0].trim();
    if (!ref) continue;

    const warnings: string[] = [];
    const bodyLines = lines.slice(1);
    const rawContent = bodyLines.join("\n").trim();

    const rawTitle = extractInlineField(bodyLines, "Title");
    const title = rawTitle ?? ref;
    if (!rawTitle) warnings.push("No Title field found — using section heading as title.");

    const rawStatus = extractInlineField(bodyLines, "Status");
    let status: IssueStatus = "open";
    if (rawStatus) {
      const mapped = STATUS_MAP[rawStatus.toLowerCase()];
      if (mapped) {
        status = mapped;
      } else {
        warnings.push(`Unknown status "${rawStatus}" — defaulted to "open".`);
      }
    } else {
      warnings.push('No Status field found — defaulted to "open".');
    }

    issues.push({ ref, title, status, rawContent, warnings });
  }

  if (issues.length === 0) {
    return { issues: [], parseError: "No valid issue sections were found in the file." };
  }

  return { issues };
}
