import { useTheme, tokens } from "@/lib/theme";
import type { Issue } from "../types";

type Props = { issue: Issue; selected: boolean; onClick: () => void };

const SEVERITY_COLOR: Record<string, string> = {
  critical: "#f87171", high: "#fb923c", medium: "#fbbf24", low: "#60a5fa", info: "#9ca3af",
};

const ORIGIN_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  manual:            { label: "🐛 Issue",     bg: "#450a0a",  color: "#f87171" },
  feature:           { label: "✨ Feature", bg: "#1e1030",  color: "#a78bfa" },
  note:              { label: "📝 Note",    bg: "#1c1400",  color: "#fbbf24" },
  imported_markdown: { label: "Imported",   bg: "#1e2a3a",  color: "#93c5fd" },
};

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  open:         { bg: "#450a0a", color: "#f87171" },
  in_progress:  { bg: "#292218", color: "#fbbf24" },
  ready_for_qa: { bg: "#1e2a3a", color: "#93c5fd" },
  verified:     { bg: "#0f2318", color: "#4ade80" },
  closed:       { bg: "#242424", color: "#9ca3af" },
};

function fmtStatus(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function IssueCard({ issue, selected, onClick }: Props) {
  const { theme } = useTheme();
  const t = tokens[theme];
  const isImported = issue.origin === "imported_markdown";
  const originBadge = ORIGIN_BADGE[issue.origin] ?? ORIGIN_BADGE.manual;
  const barColor = issue.origin === "feature" ? "#a78bfa" : issue.origin === "note" ? "#fbbf24" : isImported ? t.infoText : SEVERITY_COLOR[issue.severity ?? "info"] ?? t.textFaint;
  const statusStyle = STATUS_STYLE[issue.status] ?? { bg: t.bgMuted, color: t.textMuted };

  return (
    <button
      onClick={onClick}
      data-testid={`issue-card-${issue.id}`}
      style={{
        width: "100%", textAlign: "left", padding: "10px 14px",
        background: selected ? t.infoBg : "transparent",
        border: "none", borderBottom: `1px solid ${t.border}`,
        cursor: "pointer", fontFamily: "inherit", transition: "background 0.12s",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
        <span style={{ width: 3, minHeight: 40, borderRadius: 2, background: barColor, flexShrink: 0, marginTop: 2 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {issue.title}
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, padding: "1px 7px", borderRadius: 4, background: originBadge.bg, color: originBadge.color, fontWeight: 600 }}>
              {originBadge.label}
            </span>
            <span style={{ fontSize: 10, padding: "1px 7px", borderRadius: 4, background: statusStyle.bg, color: statusStyle.color, fontWeight: 600 }}>
              {fmtStatus(issue.status)}
            </span>
            {!isImported && issue.origin === "manual" && issue.severity && (
              <span style={{ fontSize: 10, padding: "1px 7px", borderRadius: 4, background: t.bgMuted, color: barColor, fontWeight: 600 }}>
                {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}
              </span>
            )}
            {issue.origin === "feature" && issue.severity && (
              <span style={{ fontSize: 10, padding: "1px 7px", borderRadius: 4, background: t.bgMuted, color: "#a78bfa", fontWeight: 600 }}>
                P: {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}
              </span>
            )}
            {issue.area && (
              <span style={{ fontSize: 10, padding: "1px 7px", borderRadius: 4, background: t.bgMuted, color: t.textMuted }}>{issue.area}</span>
            )}
            {isImported && issue.sourceRef && (
              <span style={{ fontSize: 10, color: t.textFaint }}>{issue.sourceRef}</span>
            )}
            {issue.automationStatus && issue.origin === "manual" && (
              <span style={{
                fontSize: 10, padding: "1px 7px", borderRadius: 4, background: t.bgMuted,
                color: issue.automationStatus.result === "passed" ? "#4ade80" : issue.automationStatus.result === "failed" ? "#f87171" : t.textFaint,
                fontWeight: 600,
              }}>
                {issue.automationStatus.result === "passed" ? "✓ Test passed" : issue.automationStatus.result === "failed" ? "✕ Test failed" : "Test not run"}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
