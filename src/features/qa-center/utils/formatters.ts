import type { IssueStatus } from "../types";

export function formatTimestamp(ts: number): string {
  return new Date(ts).toLocaleString();
}

export function formatStatus(status: IssueStatus): string {
  return status.replace(/_/g, " ");
}
