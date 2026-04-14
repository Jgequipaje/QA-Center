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
export declare function parseMarkdownIssues(markdown: string): ParseResult;
