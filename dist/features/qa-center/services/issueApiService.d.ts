import type { Issue, IssueStatus, AvailableTest } from "../types";
export declare function fetchIssues(baseUrl: string): Promise<Issue[]>;
export declare function createIssue(
  baseUrl: string,
  issue: Omit<Issue, "id" | "createdAt" | "updatedAt">
): Promise<Issue>;
export declare function patchIssue(
  baseUrl: string,
  id: string,
  patch: Partial<Omit<Issue, "id" | "createdAt">>
): Promise<Issue>;
export declare function updateIssueStatus(
  baseUrl: string,
  id: string,
  status: IssueStatus
): Promise<Issue>;
export declare function deleteIssue(baseUrl: string, id: string): Promise<void>;
export declare function fetchAvailableTests(baseUrl: string): Promise<AvailableTest[]>;
export declare function refreshAvailableTests(baseUrl: string): Promise<AvailableTest[]>;
export declare function runLinkedTest(baseUrl: string, issueId: string): Promise<Issue>;
