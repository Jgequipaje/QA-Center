import type { Issue } from "../types";
import type { ParsedMarkdownIssue } from "./markdownIssueParser";
export declare function parsedToIssue(parsed: ParsedMarkdownIssue, sourceFile?: string): Issue;
export declare function importSelectedIssues(
  selected: ParsedMarkdownIssue[],
  sourceFile?: string
): Issue[];
