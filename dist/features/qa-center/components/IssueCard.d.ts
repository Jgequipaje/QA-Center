import type { Issue } from "../types";
type Props = {
  issue: Issue;
  selected: boolean;
  onClick: () => void;
};
export default function IssueCard({
  issue,
  selected,
  onClick,
}: Props): import("react/jsx-runtime").JSX.Element;
export {};
