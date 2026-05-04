export interface QAIssue {
  id?: string;
  origin: "issue";
  title?: string;
  status: "open" | "in_progress" | "ready_for_qa" | "verified" | "closed";
  createdAt?: number;
  updatedAt?: number;
  description: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  area: string;
  reproSteps: string;
  expected: string;
  actual: string;
  linkedTest?: {
    file: string;
    describe: string;
    testTitle: string;
    fullTitle: string;
    id: string;
    tag: string;
  };
}

export interface QAFeature {
  id?: string;
  origin: "feature";
  title: string;
  status: "open" | "in_progress" | "ready_for_qa" | "verified" | "closed";
  createdAt?: number;
  updatedAt?: number;
  description: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  area: string;
  notes: string;
}

export interface QANote {
  id?: string;
  origin: "note";
  title: string;
  status: "open" | "in_progress" | "ready_for_qa" | "verified" | "closed";
  createdAt?: number;
  updatedAt?: number;
  description: string;
  area: string;
}

export interface QAIssueEdit {
  title?: string;
  status?: "open" | "in_progress" | "ready_for_qa" | "verified" | "closed";
  description?: string;
  severity?: "critical" | "high" | "medium" | "low" | "info";
  area?: string;
  reproSteps?: string;
  expected?: string;
  actual?: string;
  linkedTest?: {
    file: string;
    describe: string;
    testTitle: string;
    fullTitle: string;
    id: string;
    tag: string;
  };
}

export interface QAFeatureEdit {
  title?: string;
  status?: "open" | "in_progress" | "ready_for_qa" | "verified" | "closed";
  description?: string;
  severity?: "critical" | "high" | "medium" | "low" | "info";
  area?: string;
  notes?: string;
}

export interface QANoteEdit {
  title?: string;
  status?: "open" | "in_progress" | "ready_for_qa" | "verified" | "closed";
  description?: string;
  area?: string;
}

export type QAItem = QAIssue | QAFeature | QANote;
export type QAItemEdit = QAIssueEdit | QAFeatureEdit | QANoteEdit;
