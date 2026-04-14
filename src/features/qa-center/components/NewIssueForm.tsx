import { useState, useEffect } from "react";
import { useTheme, tokens } from "@/lib/theme";
import type { IssueSeverity, IssueOrigin, AvailableTest } from "../types";
import { useQACenterStore } from "../store/useQACenterStore";
import { fetchAvailableTests, refreshAvailableTests } from "../services/issueApiService";
import { useQACenterConfig } from "./QACenterConfigContext";

type Props = { onClose: () => void; origin?: IssueOrigin };

export default function NewIssueForm({ onClose, origin = "manual" }: Props) {
  const { theme } = useTheme();
  const t = tokens[theme];
  const { addIssue } = useQACenterStore();
  const { baseUrl } = useQACenterConfig();

  // Shared
  const [title, setTitle] = useState("");
  const [area, setArea] = useState("");
  const [error, setError] = useState("");

  // Bug/Issue specific
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<IssueSeverity>("medium");
  const [reproSteps, setReproSteps] = useState("");
  const [expected, setExpected] = useState("");
  const [actual, setActual] = useState("");
  const [availableTests, setAvailableTests] = useState<AvailableTest[]>([]);
  const [selectedTestId, setSelectedTestId] = useState<string>("");
  const [testSearch, setTestSearch] = useState("");
  const [loadingTests, setLoadingTests] = useState(false);

  // Feature specific
  const [featureDescription, setFeatureDescription] = useState("");
  const [priority, setPriority] = useState<IssueSeverity>("medium");
  const [acceptanceCriteria, setAcceptanceCriteria] = useState("");

  // Note specific
  const [noteContent, setNoteContent] = useState("");

  useEffect(() => {
    if (origin === "manual") {
      setLoadingTests(true);
      fetchAvailableTests(baseUrl)
        .then(setAvailableTests)
        .finally(() => setLoadingTests(false));
    }
  }, [origin, baseUrl]);

  async function handleRefreshTests() {
    setLoadingTests(true);
    try {
      const tests = await refreshAvailableTests(baseUrl);
      setAvailableTests(tests);
    } finally {
      setLoadingTests(false);
    }
  }

  const filteredTests = testSearch
    ? availableTests.filter((t) => t.fullTitle.toLowerCase().includes(testSearch.toLowerCase()))
    : availableTests;

  const grouped = filteredTests.reduce<Record<string, AvailableTest[]>>((acc, t) => {
    const key = t.describe ?? t.file;
    if (!acc[key]) acc[key] = [];
    acc[key].push(t);
    return acc;
  }, {});

  const selectedTest = availableTests.find((t) => t.id === selectedTestId);

  function handleSubmit() {
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (origin === "manual" && !description.trim()) {
      setError("Description is required.");
      return;
    }
    if (origin === "feature" && !featureDescription.trim()) {
      setError("Description is required.");
      return;
    }
    if (origin === "note" && !noteContent.trim()) {
      setError("Content is required.");
      return;
    }

    const now = Date.now();

    if (origin === "manual") {
      addIssue(baseUrl, {
        id: `issue-${now}-${Math.random().toString(36).slice(2, 6)}`,
        origin: "manual",
        title: title.trim(),
        description: description.trim(),
        status: "open",
        severity,
        area: area.trim() || undefined,
        reproSteps: reproSteps.trim() || undefined,
        expected: expected.trim() || undefined,
        actual: actual.trim() || undefined,
        linkedTest: selectedTest ? { ...selectedTest, tag: `@issue-${now}` } : undefined,
        automationStatus: selectedTest
          ? { result: "not_run", lastRun: null, message: "" }
          : undefined,
        createdAt: now,
        updatedAt: now,
      });
    } else if (origin === "feature") {
      addIssue(baseUrl, {
        id: `issue-${now}-${Math.random().toString(36).slice(2, 6)}`,
        origin: "feature",
        title: title.trim(),
        description: featureDescription.trim(),
        status: "open",
        severity: priority,
        area: area.trim() || undefined,
        notes: acceptanceCriteria.trim() || undefined,
        createdAt: now,
        updatedAt: now,
      });
    } else if (origin === "note") {
      addIssue(baseUrl, {
        id: `issue-${now}-${Math.random().toString(36).slice(2, 6)}`,
        origin: "note",
        title: title.trim(),
        description: noteContent.trim(),
        status: "open",
        area: area.trim() || undefined,
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "6px 8px",
    fontSize: 13,
    background: t.bg,
    color: t.text,
    border: `1px solid ${t.border}`,
    borderRadius: 6,
    fontFamily: "inherit",
    boxSizing: "border-box" as const,
    outline: "none",
  };
  const labelStyle = {
    fontSize: 11,
    fontWeight: 600 as const,
    color: t.textMuted,
    textTransform: "uppercase" as const,
    marginBottom: 4,
    display: "block",
  };

  const HEADER =
    origin === "feature" ? "✨ New Feature" : origin === "note" ? "📝 New Note" : "🐛 New Issue";
  const SUBMIT =
    origin === "feature" ? "Add Feature" : origin === "note" ? "Add Note" : "Create Issue";

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      <div style={{ padding: "14px 16px", overflowY: "auto", flex: 1 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <span style={{ fontWeight: 700, fontSize: 14, color: t.text }}>{HEADER}</span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: t.textMuted,
              fontSize: 16,
              padding: 0,
            }}
          >
            ✕
          </button>
        </div>

        {error && (
          <div
            style={{
              fontSize: 12,
              color: t.failText,
              background: t.failBg,
              padding: "8px 12px",
              borderRadius: 6,
              marginBottom: 10,
            }}
          >
            {error}
          </div>
        )}

        {/* ── BUG / ISSUE FORM ── */}
        {origin === "manual" && (
          <>
            <div
              style={{
                marginBottom: 14,
                padding: "10px 12px",
                background: t.bgSubtle,
                borderRadius: 8,
                border: `1px solid ${t.border}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <label style={labelStyle}>Link Playwright Test (optional)</label>
                <button
                  type="button"
                  onClick={handleRefreshTests}
                  disabled={loadingTests}
                  style={{
                    fontSize: 11,
                    color: t.link,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    padding: 0,
                  }}
                >
                  {loadingTests ? "Scanning..." : "↻ Refresh"}
                </button>
              </div>
              <input
                type="text"
                placeholder="Search tests..."
                value={testSearch}
                onChange={(e) => setTestSearch(e.target.value)}
                data-testid="test-search"
                style={{ ...inputStyle, marginBottom: 6 }}
              />
              <select
                value={selectedTestId}
                onChange={(e) => setSelectedTestId(e.target.value)}
                data-testid="test-select"
                style={{ ...inputStyle, height: 80 }}
                size={4}
              >
                <option value="">— No linked test —</option>
                {Object.entries(grouped).map(([group, tests]) => (
                  <optgroup key={group} label={group}>
                    {tests.map((test) => (
                      <option key={test.id} value={test.id}>
                        {test.testTitle}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              {selectedTest && (
                <div style={{ fontSize: 11, color: t.infoText, marginTop: 6 }}>
                  ✓ {selectedTest.fullTitle}
                </div>
              )}
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={labelStyle}>Title *</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Short bug title"
                data-testid="issue-title"
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={labelStyle}>Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="What is the bug?"
                data-testid="issue-description"
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Severity</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as IssueSeverity)}
                  data-testid="issue-severity"
                  style={inputStyle}
                >
                  {(["critical", "high", "medium", "low", "info"] as IssueSeverity[]).map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Area / Module</label>
                <input
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. auth, checkout"
                  style={inputStyle}
                />
              </div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={labelStyle}>Repro Steps</label>
              <textarea
                value={reproSteps}
                onChange={(e) => setReproSteps(e.target.value)}
                rows={3}
                placeholder="1. Go to..."
                data-testid="issue-repro-steps"
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Expected</label>
                <input
                  value={expected}
                  onChange={(e) => setExpected(e.target.value)}
                  placeholder="What should happen"
                  style={inputStyle}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Actual</label>
                <input
                  value={actual}
                  onChange={(e) => setActual(e.target.value)}
                  placeholder="What actually happens"
                  style={inputStyle}
                />
              </div>
            </div>
          </>
        )}

        {/* ── FEATURE FORM ── */}
        {origin === "feature" && (
          <>
            <div style={{ marginBottom: 10 }}>
              <label style={labelStyle}>Feature Name *</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Dark mode toggle"
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={labelStyle}>Description *</label>
              <textarea
                value={featureDescription}
                onChange={(e) => setFeatureDescription(e.target.value)}
                rows={4}
                placeholder="What should this feature do? Who is it for?"
                data-testid="feature-description"
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as IssueSeverity)}
                  data-testid="feature-priority"
                  style={inputStyle}
                >
                  <option value="critical">🔴 Critical</option>
                  <option value="high">🟠 High</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="low">🟢 Low</option>
                  <option value="info">⚪ Nice to have</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Area / Module</label>
                <input
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. settings, dashboard"
                  style={inputStyle}
                />
              </div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={labelStyle}>Acceptance Criteria</label>
              <textarea
                value={acceptanceCriteria}
                onChange={(e) => setAcceptanceCriteria(e.target.value)}
                rows={4}
                placeholder={"- Given... When... Then...\n- User can...\n- System should..."}
                data-testid="feature-acceptance-criteria"
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>
          </>
        )}

        {/* ── NOTE FORM ── */}
        {origin === "note" && (
          <>
            <div style={{ marginBottom: 10 }}>
              <label style={labelStyle}>Title *</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Design feedback, Meeting notes"
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={labelStyle}>Content *</label>
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                rows={8}
                placeholder="Write your note here..."
                data-testid="note-content"
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={labelStyle}>Tag / Area</label>
              <input
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. design, backend, meeting"
                style={inputStyle}
              />
            </div>
          </>
        )}
      </div>

      <div
        style={{
          padding: "10px 14px",
          borderTop: `1px solid ${t.border}`,
          background: t.bgSubtle,
          display: "flex",
          gap: 8,
          justifyContent: "flex-end",
          flexShrink: 0,
        }}
      >
        <button
          onClick={onClose}
          data-testid="form-cancel"
          style={{
            padding: "6px 14px",
            fontSize: 13,
            fontWeight: 600,
            background: t.btnIdle,
            color: t.btnIdleTxt,
            border: `1px solid ${t.border}`,
            borderRadius: 6,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          data-testid="form-submit"
          style={{
            padding: "6px 14px",
            fontSize: 13,
            fontWeight: 600,
            background: t.btnActive,
            color: t.btnActiveTxt,
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          {SUBMIT}
        </button>
      </div>
    </div>
  );
}
