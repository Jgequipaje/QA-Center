import type { IssueOrigin } from "../types";
type Props = {
  onClose: () => void;
  origin?: IssueOrigin;
};
export default function NewIssueForm({
  onClose,
  origin,
}: Props): import("react/jsx-runtime").JSX.Element;
export {};
