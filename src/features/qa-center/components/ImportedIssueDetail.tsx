import { useTheme, tokens } from "@/lib/theme";
import type { Issue, IssueStatus } from "../types";
import { useQACenterStore } from "../store/useQACenterStore";
import { useQACenterConfig } from "./QACenterConfigContext";

type Props = { issue: Issue; onClose: () => void };

const TRANSITIONS: Record<IssueStatus, IssueStatus[]> = {
  open:         ["in_progress", "closed"],
  in_progress:  ["ready_for_qa", "open", "closed"],
  ready_for_qa: ["verified", "in_progress", "closed"],
  verified:     ["closed", "open"],
  closed:       ["open"],
};

const TRANSITION_LABEL: Partial<Record<IssueStatus, string>> = {
  in_progress: "Start Progress", ready_for_qa: "Ready for QA",
  verified: "Mark Verified", closed: "Close", open: "Re-open",
};

function fmtStatus(s: string) { return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()); }
function fmtDate(ts: number) { return new Date(ts).toLocaleString(); }

export default function ImportedIssueDetail({ issue, onClose }: Props) {
  const { theme } = useTheme();
  const t = tokens[theme];
  const { updateIssueStatus, deleteIssue } = useQACenterStore();
  const { baseUrl } = useQACenterConfig();
  const available = TRANSITIONS[issue.status] ?? [];

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      <div style={{ padding: "14px 16px", overflowY: "auto", flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: t.text, flex: 1, marginRight: 8 }}>{issue.title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: t.textMuted, fontSize: 16, padding: 0 }}>✕</button>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
          <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: t.infoBg, color: t.infoText, fontWeight: 600 }}>Imported from Markdown</span>
          <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: t.bgMuted, color: t.textMuted, fontWeight: 600 }}>{fmtStatus(issue.status)}</span>
          {issue.sourceRef && <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: t.bgMuted, color: t.textFaint }}>{issue.sourceRef}</span>}
          {issue.sourceFile && <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: t.bgMuted, color: t.textFaint }}>{issue.sourceFile}</span>}
        </div>
        {issue.rawContent ? (
          <div style={{ marginTop: 4 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: t.textMuted, textTransform: "uppercase", marginBottom: 6 }}>Content</div>
            <pre style={{ margin: 0, fontSize: 12, color: t.text, background: t.bgSubtle, padding: "12px 14px", borderRadius: 6, border: `1px solid ${t.border}`, whiteSpace: "pre-wrap", wordBreak: "break-word", lineHeight: 1.7, fontFamily: "inherit" }}>
              {issue.rawContent}
            </pre>
          </div>
        ) : (
          <div style={{ fontSize: 12, color: t.textFaint, fontStyle: "italic" }}>No content available.</div>
        )}
        <div style={{ fontSize: 11, color: t.textFaint, marginTop: 14 }}>Imported {fmtDate(issue.createdAt)}</div>
      </div>
      <div style={{ padding: "10px 14px", borderTop: `1px solid ${t.border}`, background: t.bgSubtle, display: "flex", flexWrap: "wrap", gap: 6, flexShrink: 0 }}>
        {available.map((to) => (
          <button key={to} onClick={() => updateIssueStatus(baseUrl, issue.id, to)} style={{ padding: "5px 12px", fontSize: 12, fontWeight: 600, borderRadius: 6, fontFamily: "inherit", cursor: "pointer", background: to === "verified" ? t.btnActive : t.btnIdle, color: to === "verified" ? t.btnActiveTxt : t.btnIdleTxt, border: to === "closed" ? `1px solid ${t.failText}` : `1px solid ${t.border}` }}>
            {TRANSITION_LABEL[to] ?? fmtStatus(to)}
          </button>
        ))}
        <button onClick={() => { deleteIssue(baseUrl, issue.id); onClose(); }} style={{ marginLeft: "auto", padding: "5px 12px", fontSize: 12, fontWeight: 600, borderRadius: 6, fontFamily: "inherit", cursor: "pointer", background: "transparent", color: t.failText, border: `1px solid ${t.failText}` }}>
          Delete
        </button>
      </div>
    </div>
  );
}
