import { useTheme, tokens } from "@/lib/theme";
import type { ParsedMarkdownIssue } from "../services/markdownIssueParser";

type Props = {
  issues: ParsedMarkdownIssue[];
  selected: Set<string>;
  onToggle: (ref: string) => void;
  onToggleAll: (all: boolean) => void;
};

export default function ImportedIssuePreviewList({
  issues,
  selected,
  onToggle,
  onToggleAll,
}: Props) {
  const { theme } = useTheme();
  const t = tokens[theme];
  const allSelected = issues.length > 0 && selected.size === issues.length;

  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      <div
        style={{
          padding: "8px 16px",
          borderBottom: `1px solid ${t.border}`,
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: t.bgSubtle,
        }}
      >
        <input
          type="checkbox"
          checked={allSelected}
          onChange={(e) => onToggleAll(e.target.checked)}
          style={{ cursor: "pointer", accentColor: t.btnActive }}
        />
        <span style={{ fontSize: 12, color: t.textMuted }}>
          {selected.size} of {issues.length} selected
        </span>
      </div>
      {issues.map((issue) => {
        const isSelected = selected.has(issue.ref);
        return (
          <div
            key={issue.ref}
            onClick={() => onToggle(issue.ref)}
            style={{
              padding: "10px 16px",
              borderBottom: `1px solid ${t.border}`,
              background: isSelected ? t.infoBg : "transparent",
              cursor: "pointer",
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
            }}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggle(issue.ref)}
              onClick={(e) => e.stopPropagation()}
              style={{ marginTop: 2, cursor: "pointer", accentColor: t.btnActive, flexShrink: 0 }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <span style={{ fontSize: 10, color: t.textFaint, fontWeight: 600 }}>
                  {issue.ref}
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{issue.title}</span>
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
                <span
                  style={{
                    fontSize: 10,
                    padding: "1px 7px",
                    borderRadius: 4,
                    background: t.bgMuted,
                    color: t.textMuted,
                  }}
                >
                  {issue.status.replace(/_/g, " ")}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    padding: "1px 7px",
                    borderRadius: 4,
                    background: t.infoBg,
                    color: t.infoText,
                    fontWeight: 600,
                  }}
                >
                  Markdown
                </span>
              </div>
              {issue.rawContent && (
                <div
                  style={{
                    fontSize: 11,
                    color: t.textFaint,
                    marginTop: 4,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {issue.rawContent.split("\n")[0]}
                </div>
              )}
              {issue.warnings.length > 0 &&
                issue.warnings.map((w, i) => (
                  <div
                    key={i}
                    style={{
                      fontSize: 11,
                      color: t.warnText,
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 4,
                      marginTop: 3,
                    }}
                  >
                    <span>⚠</span>
                    <span>{w}</span>
                  </div>
                ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
