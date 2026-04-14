import { useState, useRef } from "react";
import { useTheme, tokens } from "@/lib/theme";
import { parseMarkdownIssues } from "../services/markdownIssueParser";
import { importSelectedIssues } from "../services/issueImportService";
import { useQACenterStore } from "../store/useQACenterStore";
import ImportedIssuePreviewList from "./ImportedIssuePreviewList";
import { useQACenterConfig } from "./QACenterConfigContext";
import type { ParsedMarkdownIssue } from "../services/markdownIssueParser";

type Props = { onClose: () => void };
type Step = "upload" | "preview";

export default function ImportIssuesModal({ onClose }: Props) {
  const { theme } = useTheme();
  const t = tokens[theme];
  const fileRef = useRef<HTMLInputElement>(null);
  const { addIssue, selectIssue } = useQACenterStore();
  const { baseUrl } = useQACenterConfig();

  const [step, setStep] = useState<Step>("upload");
  const [parsed, setParsed] = useState<ParsedMarkdownIssue[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [fileName, setFileName] = useState<string>("");

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".md")) {
      setParseError("Please upload a Markdown (.md) file.");
      return;
    }
    setFileName(file.name);
    setParseError(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const result = parseMarkdownIssues(text);
      if (result.parseError) {
        setParseError(result.parseError);
        setParsed([]);
      } else {
        setParsed(result.issues);
        setSelected(new Set(result.issues.map((i) => i.ref)));
        setStep("preview");
      }
    };
    reader.onerror = () => setParseError("Failed to read file.");
    reader.readAsText(file);
  }

  function handleToggle(ref: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(ref)) {
        next.delete(ref);
      } else {
        next.add(ref);
      }
      return next;
    });
  }

  function handleImport() {
    const toImport = parsed.filter((p) => selected.has(p.ref));
    if (toImport.length === 0) return;
    const issues = importSelectedIssues(toImport, fileName);
    issues.forEach((issue) => addIssue(baseUrl, issue));
    if (issues[0]) selectIssue(issues[0].id);
    onClose();
  }

  const inputStyle = {
    padding: "6px 8px",
    fontSize: 13,
    background: t.bg,
    color: t.text,
    border: `1px solid ${t.border}`,
    borderRadius: 6,
    fontFamily: "inherit",
    outline: "none",
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1100 }}
      />
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(520px, 95vw)",
          maxHeight: "80vh",
          background: t.bg,
          border: `1px solid ${t.border}`,
          borderRadius: 10,
          zIndex: 1101,
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "14px 16px",
            borderBottom: `1px solid ${t.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: t.text }}>
              Import Issues from Markdown
            </div>
            <div style={{ fontSize: 11, color: t.textFaint, marginTop: 2 }}>
              {step === "upload"
                ? "Upload an ISSUES.md file to get started."
                : `${parsed.length} issue${parsed.length !== 1 ? "s" : ""} found in ${fileName}`}
            </div>
          </div>
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

        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {step === "upload" && (
            <div
              style={{
                padding: "24px 16px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                alignItems: "center",
              }}
            >
              <div
                style={{ fontSize: 13, color: t.textMuted, textAlign: "center", lineHeight: 1.6 }}
              >
                Upload a{" "}
                <code style={{ background: t.bgMuted, padding: "1px 5px", borderRadius: 4 }}>
                  .md
                </code>{" "}
                file with issues formatted as{" "}
                <code style={{ background: t.bgMuted, padding: "1px 5px", borderRadius: 4 }}>
                  ## ISSUE-001
                </code>{" "}
                sections.
              </div>
              {parseError && (
                <div
                  style={{
                    fontSize: 12,
                    color: t.failText,
                    background: t.failBg,
                    padding: "8px 12px",
                    borderRadius: 6,
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  {parseError}
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept=".md"
                onChange={handleFile}
                style={{ display: "none" }}
              />
              <button
                onClick={() => fileRef.current?.click()}
                style={{
                  ...inputStyle,
                  padding: "8px 20px",
                  fontWeight: 600,
                  background: t.btnActive,
                  color: t.btnActiveTxt,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Choose .md File
              </button>
            </div>
          )}
          {step === "preview" &&
            (parsed.length === 0 ? (
              <div
                style={{ padding: "2rem", textAlign: "center", color: t.textFaint, fontSize: 13 }}
              >
                No valid issues were found in the file.
              </div>
            ) : (
              <ImportedIssuePreviewList
                issues={parsed}
                selected={selected}
                onToggle={handleToggle}
                onToggleAll={(all) =>
                  setSelected(all ? new Set(parsed.map((i) => i.ref)) : new Set())
                }
              />
            ))}
        </div>

        <div
          style={{
            padding: "12px 16px",
            borderTop: `1px solid ${t.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
            gap: 8,
          }}
        >
          {step === "preview" && (
            <button
              onClick={() => {
                setStep("upload");
                setParsed([]);
                setSelected(new Set());
                setParseError(null);
                if (fileRef.current) fileRef.current.value = "";
              }}
              style={{
                fontSize: 12,
                color: t.link,
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                padding: 0,
              }}
            >
              ← Upload different file
            </button>
          )}
          <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
            <button
              onClick={onClose}
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
            {step === "preview" && (
              <button
                onClick={handleImport}
                disabled={selected.size === 0}
                style={{
                  padding: "6px 14px",
                  fontSize: 13,
                  fontWeight: 600,
                  background: selected.size > 0 ? t.btnActive : t.textFaint,
                  color: t.btnActiveTxt,
                  border: "none",
                  borderRadius: 6,
                  cursor: selected.size > 0 ? "pointer" : "not-allowed",
                  fontFamily: "inherit",
                  opacity: selected.size > 0 ? 1 : 0.6,
                }}
              >
                Import{" "}
                {selected.size > 0 ? `${selected.size} Issue${selected.size > 1 ? "s" : ""}` : ""}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
