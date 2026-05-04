export type IssueStatus = "open" | "in_progress" | "ready_for_qa" | "verified" | "closed";
export type IssueSeverity = "critical" | "high" | "medium" | "low" | "info";
export type IssueOrigin = "issue" | "imported_markdown" | "feature" | "note";
export type AutomationResult = "not_run" | "passed" | "failed";

export type LinkedTest = {
  id: string;
  file: string;
  describe?: string;
  testTitle: string;
  fullTitle: string;
  tag?: string; // legacy: "@issue-abc123" grep tag
  testId?: string; // stable DDT id extracted from [id:xxx] in title
};

export type AutomationStatus = {
  result: AutomationResult;
  lastRun: string | null;
  message: string;
};

export type Issue = {
  id: string;
  origin: IssueOrigin;
  title: string;
  status: IssueStatus;
  createdAt: number;
  updatedAt: number;
  description?: string;
  severity?: IssueSeverity;
  area?: string;
  reproSteps?: string;
  expected?: string;
  actual?: string;
  notes?: string;
  rawContent?: string;
  sourceRef?: string;
  sourceFile?: string;
  linkedTest?: LinkedTest;
  automationStatus?: AutomationStatus;
};

export type AvailableTest = {
  id: string;
  file: string;
  describe?: string;
  testTitle: string;
  fullTitle: string;
  testId?: string; // stable [id:xxx] extracted from title, if present
};

export type IssueFilters = {
  status?: IssueStatus | "all";
  severity?: IssueSeverity;
  origin?: IssueOrigin | "all";
  search?: string;
  page?: number;
};

export type QACenterButtonColor = string | { dark: string; light: string };
export type QACenterShape = "circle" | "rounded" | "square";

export type VerificationResult = "passed" | "failed" | "skipped" | "pending";

export type VerificationEvent = {
  id: string;
  issueId: string;
  issueTitle: string;
  result: VerificationResult;
  runAt: number;
  durationMs?: number;
  message?: string;
  testFile?: string;
};
