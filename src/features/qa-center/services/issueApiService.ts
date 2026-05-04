import type { Issue, IssueStatus, AvailableTest } from "../types";

export async function fetchIssues(baseUrl: string): Promise<Issue[]> {
  const res = await fetch(`${baseUrl}/api/qa-items`);
  if (!res.ok) throw new Error("Failed to load issues.");
  return res.json();
}

export async function fetchIssueById(baseUrl: string, id: string): Promise<Issue> {
  const res = await fetch(`${baseUrl}/api/qa-items/${id}`);
  if (!res.ok) throw new Error("Issue not found.");
  return res.json();
}

export async function createIssue(
  baseUrl: string,
  issue: Omit<Issue, "id" | "createdAt" | "updatedAt">
): Promise<Issue> {
  const res = await fetch(`${baseUrl}/api/qa-items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(issue),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? "Failed to create issue.");
  }
  return res.json();
}

export async function patchIssue(
  baseUrl: string,
  id: string,
  patch: Partial<Omit<Issue, "id" | "createdAt">>
): Promise<Issue> {
  const res = await fetch(`${baseUrl}/api/qa-items/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? "Failed to update issue.");
  }
  return res.json();
}

export async function updateIssueStatus(
  baseUrl: string,
  id: string,
  status: IssueStatus
): Promise<Issue> {
  const res = await fetch(`${baseUrl}/api/qa-items/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update issue.");
  return res.json();
}

export async function deleteIssue(baseUrl: string, id: string): Promise<void> {
  const res = await fetch(`${baseUrl}/api/qa-items/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete issue.");
}

export async function fetchAvailableTests(baseUrl: string): Promise<AvailableTest[]> {
  const res = await fetch(`${baseUrl}/api/qa-tests`);
  if (!res.ok) return [];
  return res.json();
}

export async function refreshAvailableTests(baseUrl: string): Promise<AvailableTest[]> {
  const res = await fetch(`${baseUrl}/api/qa-tests`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to refresh tests.");
  const data = await res.json();
  return data.tests;
}

export async function runLinkedTest(baseUrl: string, issueId: string): Promise<Issue> {
  const res = await fetch(`${baseUrl}/api/qa-items/${issueId}/run-test`, { method: "POST" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? "Failed to run test.");
  }
  return res.json();
}
