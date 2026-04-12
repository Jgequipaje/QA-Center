import type { ParsedMarkdownIssue } from "../services/markdownIssueParser";
type Props = {
    issues: ParsedMarkdownIssue[];
    selected: Set<string>;
    onToggle: (ref: string) => void;
    onToggleAll: (all: boolean) => void;
};
export default function ImportedIssuePreviewList({ issues, selected, onToggle, onToggleAll }: Props): import("react/jsx-runtime").JSX.Element;
export {};
