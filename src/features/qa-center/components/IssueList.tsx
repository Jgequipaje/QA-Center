import type { Issue } from "../types";
import IssueCard from "./IssueCard";
import EmptyState from "./EmptyState";

type Props = { issues: Issue[]; selectedId: string | null; onSelect: (id: string) => void };

export default function IssueList({ issues, selectedId, onSelect }: Props) {
  if (issues.length === 0) {
    return <EmptyState message="No issues found" sub="Issues will appear here." />;
  }
  return (
    <div style={{ overflowY: "auto", flex: 1 }}>
      {issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} selected={selectedId === issue.id} onClick={() => onSelect(issue.id)} />
      ))}
    </div>
  );
}
