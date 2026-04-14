import type { Issue } from "../types";
type Props = {
  issue: Issue;
  onClose: () => void;
};
export default function ImportedIssueDetail({
  issue,
  onClose,
}: Props): import("react/jsx-runtime").JSX.Element;
export {};
