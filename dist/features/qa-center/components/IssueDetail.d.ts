import type { Issue } from "../types";
type Props = {
    issue: Issue;
    onClose: () => void;
};
export default function IssueDetail({ issue, onClose }: Props): import("react/jsx-runtime").JSX.Element;
export {};
