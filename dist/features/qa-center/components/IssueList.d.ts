import type { Issue } from "../types";
type Props = {
  issues: Issue[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};
export default function IssueList({
  issues,
  selectedId,
  onSelect,
}: Props): import("react/jsx-runtime").JSX.Element;
export {};
