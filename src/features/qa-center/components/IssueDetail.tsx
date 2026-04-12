import { useState, useRef, useEffect } from "react";
import { useTheme, tokens } from "@/lib/theme";
import type { Issue, IssueStatus, IssueSeverity } from "../types";
import { useQACenterStore } from "../store/useQACenterStore";
import { runLinkedTest } from "../services/issueApiService";
import { useQACenterConfig } from "./QACenterConfigContext";

type Props = { issue: Issue; onClose: () => void };

const BUG_TRANSITIONS: Record<IssueStatus, IssueStatus[]> = {
  open:         ["in_progress", "closed"],
  in_progress:  ["ready_for_qa", "open", "closed"],
  ready_for_qa: ["verified", "in_progress", "closed"],
  verified:     ["closed", "open"],
  closed:       ["open"],
};

const FEATURE_TRANSITIONS: Record<IssueStatus, IssueStatus[]> = {
  open:         ["in_progress", "closed"],
  in_progress:  ["verified", "open", "closed"],
  ready_for_qa: ["verified", "in_progress", "closed"],
  verified:     ["closed", "open"],
  closed:       ["open"],
};

const NOTE_TRANSITIONS: Record<IssueStatus, IssueStatus[]> = {
  open:         ["closed"],
  in_progress:  ["closed"],
  ready_for_qa: ["closed"],
  verified:     ["closed"],
  closed:       ["open"],
};

const BUG_LABELS: Partial<Record<IssueStatus, string>> = {
  in_progress: "Start Progress", ready_for_qa: "Ready for QA",
  verified: "Mark Verified", closed: "Close", open: "Re-open",
};

const FEATURE_LABELS: Partial<Record<IssueStatus, string>> = {
  in_progress: "Start Work", verified: "Mark Done",
  closed: "Close", open: "Re-open",
};

const NOTE_LABELS: Partial<Record<IssueStatus, string>> = {
  closed: "Archive", open: "Unarchive",
};

const RESULT_COLOR: Record<string, string> = { passed: "#4ade80", failed: "#f87171", not_run: "#9ca3af" };

function fmtStatus(s: string) { return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()); }
function fmtDate(ts: number | string) { return new Date(ts).toLocaleString(); }

function Badge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: bg, color, fontWeight: 600 }}>{label}</span>;
}

export default function IssueDetail({ issue, onClose }: Props) {
  const { theme } = useTheme();
  const t = tokens[theme];
  const { updateIssueStatus, updateIssue, saveIssue, deleteIssue, loadIssues } = useQACenterStore();
  const { baseUrl } = useQACenterConfig();
  const [running, setRunning] = useState(false);
  const [runError, setRunError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const mountedRef = useRef(true);

  // Edit form state
  const [title, setTitle] = useState(issue.title);
  const [description, setDescription] = useState(issue.description ?? "");
  const [severity, setSeverity] = useState<IssueSeverity>(issue.severity ?? "medium");
  const [area, setArea] = useState(issue.area ?? "");
  const [reproSteps, setReproSteps] = useState(issue.reproSteps ?? "");
  const [expected, setExpected] = useState(issue.expected ?? "");
  const [actual, setActual] = useState(issue.actual ?? "");
  const [notes, setNotes] = useState(issue.notes ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // Sync form when issue prop changes (e.g. after save)
  useEffect(() => {
    if (!editing) {
      setTitle(issue.title);
      setDescription(issue.description ?? "");
      setSeverity(issue.severity ?? "medium");
      setArea(issue.area ?? "");
      setReproSteps(issue.reproSteps ?? "");
      setExpected(issue.expected ?? "");
      setActual(issue.actual ?? "");
      setNotes(issue.notes ?? "");
    }
  }, [issue, editing]);

  const origin = issue.origin;
  const transitionMap = origin === "note" ? NOTE_TRANSITIONS : origin === "feature" ? FEATURE_TRANSITIONS : BUG_TRANSITIONS;
  const labelMap = origin === "note" ? NOTE_LABELS : origin === "feature" ? FEATURE_LABELS : BUG_LABELS;
  const available = transitionMap[issue.status] ?? [];
  const autoResult = issue.automationStatus?.result ?? "not_run";
  const hasLinkedTest = !!issue.linkedTest && origin === "manual";

  function canTransitionTo(to: IssueStatus) {
    if (to !== "verified") return true;
    if (origin !== "manual") return true; // features/notes don't need a linked test
    if (!hasLinkedTest) return true; // no linked test = no gating
    return autoResult === "passed"; // has a linked test — it must have passed
  }

  function blockReason(to: IssueStatus): string | null {
    if (to !== "verified" || origin !== "manual") return null;
    if (!hasLinkedTest) return null;
    if (autoResult !== "passed") return "The linked test must pass before this issue can be marked verified.";
    return null;
  }

  async function handleRunTest() {
    setRunning(true); setRunError(null);
    try {
      const updated = await runLinkedTest(baseUrl, issue.id);
      if (!mountedRef.current) return;
      updateIssue(issue.id, { automationStatus: updated.automationStatus, updatedAt: updated.updatedAt });
      await loadIssues(baseUrl);
    } catch (e) {
      if (!mountedRef.current) return;
      setRunError(e instanceof Error ? e.message : "Failed to run test.");
    } finally {
      if (mountedRef.current) setRunning(false);
    }
  }

  async function handleSave() {
    if (!title.trim()) return;
    setSaving(true);
    await saveIssue(baseUrl, issue.id, {
      title: title.trim(),
      description: description.trim() || undefined,
      severity,
      area: area.trim() || undefined,
      reproSteps: reproSteps.trim() || undefined,
      expected: expected.trim() || undefined,
      actual: actual.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    if (mountedRef.current) { setSaving(false); setEditing(false); }
  }

  function handleCancelEdit() {
    setTitle(issue.title);
    setDescription(issue.description ?? "");
    setSeverity(issue.severity ?? "medium");
    setArea(issue.area ?? "");
    setReproSteps(issue.reproSteps ?? "");
    setExpected(issue.expected ?? "");
    setActual(issue.actual ?? "");
    setNotes(issue.notes ?? "");
    setEditing(false);
  }

  const inputStyle: React.CSSProperties = { width: "100%", padding: "5px 8px", fontSize: 12, background: t.bg, color: t.text, border: `1px solid ${t.border}`, borderRadius: 6, fontFamily: "inherit", boxSizing: "border-box", outline: "none" };
  const labelStyle: React.CSSProperties = { fontSize: 10, fontWeight: 600, color: t.textMuted, textTransform: "uppercase", marginBottom: 3, display: "block" };

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      <div style={{ padding: "14px 16px", overflowY: "auto", flex: 1 }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
          {editing ? (
            <input value={title} onChange={(e) => setTitle(e.target.value)} style={{ ...inputStyle, fontSize: 13, fontWeight: 700, flex: 1, marginRight: 8 }} placeholder="Issue title" />
          ) : (
            <span style={{ fontSize: 13, fontWeight: 700, color: t.text, flex: 1, marginRight: 8 }}>{issue.title}</span>
          )}
          <button onClick={onClose} disabled={running || saving} style={{ background: "none", border: "none", cursor: (running || saving) ? "not-allowed" : "pointer", color: (running || saving) ? t.textFaint : t.textMuted, fontSize: 16, padding: 0 }} title={(running || saving) ? "Operation in progress..." : undefined}>✕</button>
        </div>

        {!editing && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
            {origin === "feature" && <Badge label="✨ Feature" color={t.infoText} bg={t.infoBg} />}
            {origin === "note" && <Badge label="📝 Note" color={t.textMuted} bg={t.bgMuted} />}
            <Badge label={fmtStatus(issue.status)} color={t.infoText} bg={t.infoBg} />
            {issue.severity && origin !== "note" && <Badge label={origin === "feature" ? `Priority: ${issue.severity}` : issue.severity} color={t.warnText} bg={t.warnBg} />}
            {issue.area && <Badge label={issue.area} color={t.textMuted} bg={t.bgMuted} />}
          </div>
        )}

        {/* Edit form */}
        {editing && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {origin !== "note" && (
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>{origin === "feature" ? "Priority" : "Severity"}</label>
                  <select value={severity} onChange={(e) => setSeverity(e.target.value as IssueSeverity)} style={inputStyle}>
                    {(["critical", "high", "medium", "low", "info"] as IssueSeverity[]).map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Area / Module</label>
                  <input value={area} onChange={(e) => setArea(e.target.value)} placeholder="e.g. auth, dashboard" style={inputStyle} />
                </div>
              </div>
            )}
            {origin === "note" && (
              <div>
                <label style={labelStyle}>Tag / Area</label>
                <input value={area} onChange={(e) => setArea(e.target.value)} placeholder="e.g. design, meeting" style={inputStyle} />
              </div>
            )}
            <div>
              <label style={labelStyle}>{origin === "note" ? "Content" : "Description"}</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={origin === "note" ? 8 : 3} style={{ ...inputStyle, resize: "vertical" }} placeholder={origin === "note" ? "Write your note..." : "What is the issue?"} />
            </div>
            {origin === "manual" && (
              <>
                <div>
                  <label style={labelStyle}>Repro Steps</label>
                  <textarea value={reproSteps} onChange={(e) => setReproSteps(e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" }} placeholder="1. Go to..." />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Expected</label>
                    <input value={expected} onChange={(e) => setExpected(e.target.value)} placeholder="What should happen" style={inputStyle} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Actual</label>
                    <input value={actual} onChange={(e) => setActual(e.target.value)} placeholder="What actually happens" style={inputStyle} />
                  </div>
                </div>
              </>
            )}
            {origin === "feature" && (
              <div>
                <label style={labelStyle}>Acceptance Criteria</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} style={{ ...inputStyle, resize: "vertical" }} placeholder={"- Given... When... Then...\n- User can..."} />
              </div>
            )}
          </div>
        )}

        {/* Read-only view */}
        {!editing && (
          <>
            {hasLinkedTest && (
              <div style={{ marginBottom: 12, padding: "10px 12px", background: t.bgSubtle, borderRadius: 8, border: `1px solid ${t.border}` }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: t.textMuted, textTransform: "uppercase", marginBottom: 6 }}>Linked Test</div>
                <div style={{ fontSize: 12, color: t.text, marginBottom: 6 }}>{issue.linkedTest!.fullTitle}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: RESULT_COLOR[autoResult] ?? t.textFaint }}>
                    {autoResult === "not_run" ? "Not run yet" : autoResult === "passed" ? "✓ Passed" : "✕ Failed"}
                  </span>
                  {issue.automationStatus?.lastRun && <span style={{ fontSize: 11, color: t.textFaint }}>· {fmtDate(issue.automationStatus.lastRun)}</span>}
                </div>
                {issue.automationStatus?.message && autoResult === "failed" && (
                  <pre style={{ fontSize: 11, color: t.failText, marginTop: 6, background: t.failBg, padding: "8px 10px", borderRadius: 6, whiteSpace: "pre-wrap", wordBreak: "break-word", margin: "6px 0 0", fontFamily: "inherit", lineHeight: 1.5 }}>
                    {issue.automationStatus.message}
                  </pre>
                )}
                {runError && <div style={{ fontSize: 11, color: t.failText, marginTop: 4 }}>{runError}</div>}
                {running && <div style={{ fontSize: 11, color: t.infoText, marginTop: 4 }}>⏳ Test running — keep this panel open...</div>}
              </div>
            )}
            {issue.description && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: t.textMuted, textTransform: "uppercase", marginBottom: 4 }}>Description</div>
                <div style={{ fontSize: 12, color: t.text, lineHeight: 1.6 }}>{issue.description}</div>
              </div>
            )}
            {issue.reproSteps && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: t.textMuted, textTransform: "uppercase", marginBottom: 4 }}>Repro Steps</div>
                <pre style={{ margin: 0, whiteSpace: "pre-wrap", fontSize: 11, color: t.text, lineHeight: 1.6 }}>{issue.reproSteps}</pre>
              </div>
            )}
            {(issue.expected || issue.actual) && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: t.textMuted, textTransform: "uppercase", marginBottom: 4 }}>Expected vs Actual</div>
                {issue.expected && <div style={{ color: t.passText, fontSize: 12, marginBottom: 4 }}>Expected: {issue.expected}</div>}
                {issue.actual && <div style={{ color: t.failText, fontSize: 12 }}>Actual: {issue.actual}</div>}
              </div>
            )}
            {issue.notes && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: t.textMuted, textTransform: "uppercase", marginBottom: 4 }}>
                  {origin === "feature" ? "Acceptance Criteria" : "Notes"}
                </div>
                <pre style={{ margin: 0, whiteSpace: "pre-wrap", fontSize: 12, color: t.text, lineHeight: 1.6, fontFamily: "inherit" }}>{issue.notes}</pre>
              </div>
            )}
            <div style={{ fontSize: 11, color: t.textFaint, marginTop: 12 }}>
              Created {fmtDate(issue.createdAt)} · Updated {fmtDate(issue.updatedAt)}
            </div>
          </>
        )}
      </div>

      {/* Footer actions */}
      <div style={{ padding: "10px 14px", borderTop: `1px solid ${t.border}`, background: t.bgSubtle, display: "flex", flexWrap: "wrap", gap: 6, flexShrink: 0 }}>
        {editing ? (
          <>
            <button onClick={handleSave} disabled={saving || !title.trim()} style={{ padding: "5px 14px", fontSize: 12, fontWeight: 600, borderRadius: 6, fontFamily: "inherit", cursor: saving ? "not-allowed" : "pointer", background: t.btnActive, color: t.btnActiveTxt, border: "none", opacity: saving ? 0.6 : 1 }}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button onClick={handleCancelEdit} disabled={saving} style={{ padding: "5px 12px", fontSize: 12, fontWeight: 600, borderRadius: 6, fontFamily: "inherit", cursor: "pointer", background: t.btnIdle, color: t.btnIdleTxt, border: `1px solid ${t.border}` }}>
              Cancel
            </button>
          </>
        ) : (
          <>
            {hasLinkedTest && (
              <button onClick={handleRunTest} disabled={running} style={{ padding: "5px 12px", fontSize: 12, fontWeight: 600, borderRadius: 6, fontFamily: "inherit", cursor: running ? "not-allowed" : "pointer", background: t.infoBg, color: t.infoText, border: `1px solid ${t.infoBorder}`, opacity: running ? 0.6 : 1 }}>
                {running ? "Running..." : "▶ Run Test"}
              </button>
            )}
            <button onClick={() => setEditing(true)} style={{ padding: "5px 12px", fontSize: 12, fontWeight: 600, borderRadius: 6, fontFamily: "inherit", cursor: "pointer", background: t.btnIdle, color: t.btnIdleTxt, border: `1px solid ${t.border}` }}>
              ✎ Edit
            </button>
            {available.map((to) => {
              const blocked = !canTransitionTo(to);
              return (
                <button key={to} onClick={() => !blocked && updateIssueStatus(baseUrl, issue.id, to)} disabled={blocked} title={blockReason(to) ?? undefined} style={{ padding: "5px 12px", fontSize: 12, fontWeight: 600, borderRadius: 6, fontFamily: "inherit", cursor: blocked ? "not-allowed" : "pointer", background: to === "verified" && !blocked ? t.btnActive : t.btnIdle, color: to === "verified" && !blocked ? t.btnActiveTxt : t.btnIdleTxt, border: to === "closed" ? `1px solid ${t.failText}` : `1px solid ${t.border}`, opacity: blocked ? 0.45 : 1 }}>
                  {labelMap[to] ?? fmtStatus(to)}
                </button>
              );
            })}
            {available.includes("verified") && !canTransitionTo("verified") && (
              <div style={{ width: "100%", fontSize: 11, color: t.warnText, marginTop: 2 }}>{blockReason("verified")}</div>
            )}
            <button onClick={() => { deleteIssue(baseUrl, issue.id); onClose(); }} style={{ marginLeft: "auto", padding: "5px 12px", fontSize: 12, fontWeight: 600, borderRadius: 6, fontFamily: "inherit", cursor: "pointer", background: "transparent", color: t.failText, border: `1px solid ${t.failText}` }}>
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
