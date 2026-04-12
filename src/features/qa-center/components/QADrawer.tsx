import { useState, useRef, useEffect } from "react";
import { useTheme, tokens } from "@/lib/theme";
import { useQACenterStore } from "../store/useQACenterStore";
import { useQACenterConfig } from "./QACenterConfigContext";
import IssueCard from "./IssueCard";
import IssueDetail from "./IssueDetail";
import NewIssueForm from "./NewIssueForm";
import EmptyState from "./EmptyState";
import type { IssueOrigin } from "../types";

export default function QADrawer() {
  const { theme } = useTheme();
  const t = tokens[theme];
  const { name } = useQACenterConfig();
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [createType, setCreateType] = useState<IssueOrigin>("manual");
  const addBtnRef = useRef<HTMLDivElement>(null);

  const {
    isDrawerOpen, closeDrawer,
    issues, filters, setFilters, switchTab,
    selectedIssueId, selectIssue,
    isCreating, openCreateForm, closeCreateForm,
    isLoading,
  } = useQACenterStore();

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!showAddMenu) return;
    function handleClick(e: MouseEvent) {
      if (addBtnRef.current && !addBtnRef.current.contains(e.target as Node)) {
        setShowAddMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showAddMenu]);

  function handleAddOption(type: IssueOrigin) {
    setCreateType(type);
    setShowAddMenu(false);
    openCreateForm();
  }

  if (!isDrawerOpen) return null;

  const ACTIVE_STATUSES = new Set(["open", "in_progress", "ready_for_qa"]);
  const PAGE_SIZE = 10;
  const page = filters.page ?? 1;
  const setPage = (p: number) => setFilters({ page: p });

  const currentOrigin = filters.origin ?? "manual";
  const currentStatus = filters.status ?? "open";
  const activeOrigin = filters.search ? "all" : currentOrigin;
  const activeStatus = currentStatus;

  const visible = issues.filter((i) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      return (
        i.title.toLowerCase().includes(q) ||
        (i.area?.toLowerCase().includes(q) ?? false) ||
        (i.description?.toLowerCase().includes(q) ?? false)
      );
    }

    // Strict origin match
    if (currentOrigin === "manual") {
      if (i.origin !== "manual" && i.origin !== "imported_markdown") return false;
    } else if (i.origin !== currentOrigin) {
      return false;
    }

    // Status match
    if (currentStatus !== "all" && i.status !== currentStatus) return false;

    return true;
  });

  const selectedIssue = selectedIssueId ? issues.find((i) => i.id === selectedIssueId) ?? null : null;
  const openCount = issues.filter((i) => ACTIVE_STATUSES.has(i.status)).length;
  const totalPages = Math.ceil(visible.length / PAGE_SIZE);
  const safePage = Math.min(page, Math.max(1, totalPages));
  const paged = visible.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <>
      <div onClick={closeDrawer} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 1002 }} />
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(440px, 100vw)", background: t.bg, borderLeft: `1px solid ${t.border}`, zIndex: 1003, display: "flex", flexDirection: "column", boxShadow: "-4px 0 24px rgba(0,0,0,0.2)" }}>

        {/* Header */}
        <div style={{ padding: "14px 16px", borderBottom: `1px solid ${t.border}`, background: t.bgSubtle, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: t.text }}>{name}</div>
            <div style={{ fontSize: 11, color: t.textFaint, marginTop: 2 }}>
              {isLoading ? "Loading..." : openCount > 0 ? `${openCount} active issue${openCount > 1 ? "s" : ""}` : "No active issues"}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {!isCreating && !selectedIssue && (
              <>
                {/* + Add dropdown */}
                <div ref={addBtnRef} style={{ position: "relative" }}>
                  <button
                    onClick={() => setShowAddMenu((v) => !v)}
                    style={{ padding: "5px 12px", fontSize: 12, fontWeight: 600, background: t.btnActive, color: t.btnActiveTxt, border: "none", borderRadius: 6, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4 }}
                  >
                    + Add <span style={{ fontSize: 10, opacity: 0.8 }}>▾</span>
                  </button>
                  {showAddMenu && (
                    <div style={{ position: "absolute", top: "calc(100% + 4px)", right: 0, background: t.bg, border: `1px solid ${t.border}`, borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.2)", zIndex: 1100, minWidth: 140, overflow: "hidden" }}>
                      {([
                        { type: "manual" as IssueOrigin, label: "🐛 New Issue" },
                        { type: "feature" as IssueOrigin, label: "✨ Feature" },
                        { type: "note" as IssueOrigin, label: "📝 Note" },
                      ]).map(({ type, label }) => (
                        <button
                          key={type}
                          onClick={() => handleAddOption(type)}
                          style={{ display: "block", width: "100%", textAlign: "left", padding: "9px 14px", fontSize: 12, fontWeight: 500, background: "none", border: "none", color: t.text, cursor: "pointer", fontFamily: "inherit" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = t.bgMuted)}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
            <button onClick={closeDrawer} style={{ background: "none", border: "none", cursor: "pointer", color: t.textMuted, fontSize: 18, lineHeight: 1, padding: "4px 6px" }}>✕</button>
          </div>
        </div>

        {/* Filter bar */}
        {!isCreating && !selectedIssue && (
          <div style={{ borderBottom: `1px solid ${t.border}`, background: t.bgSubtle, flexShrink: 0 }}>
            {/* Global search — above tabs */}
            <div style={{ padding: "8px 12px 6px" }}>
              <input
                type="text"
                placeholder="Search issues, features, notes..."
                value={filters.search ?? ""}
                onChange={(e) => { setFilters({ search: e.target.value || undefined, page: 1 }); }}
                style={{ width: "100%", padding: "6px 10px", fontSize: 12, background: t.bg, color: t.text, border: `1px solid ${t.border}`, borderRadius: 6, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
              />
            </div>

            {/* Type tabs */}
            <div style={{ display: "flex", padding: "0 12px", gap: 2 }}>
              {([
                { value: "manual",  label: "🐛 Issues" },
                { value: "feature", label: "✨ Features" },
                { value: "note",    label: "📝 Notes" },
              ] as const).map(({ value, label }) => {
                const active = (filters.origin ?? "manual") === value;
                return (
                  <button
                    key={value}
                    onClick={() => { switchTab(value); }}
                    style={{ padding: "5px 12px", fontSize: 12, fontWeight: active ? 700 : 500, background: active ? t.bg : "transparent", color: active ? t.text : t.textMuted, border: active ? `1px solid ${t.border}` : "1px solid transparent", borderBottom: active ? `1px solid ${t.bg}` : "1px solid transparent", borderRadius: "6px 6px 0 0", cursor: "pointer", fontFamily: "inherit", marginBottom: -1, position: "relative", zIndex: active ? 1 : 0 }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Status pills — hidden when searching */}
            {!filters.search && (
              <div style={{ padding: "8px 12px", display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                {(() => {
                  const origin = filters.origin ?? "manual";
                  const statusOptions =
                    origin === "feature"
                      ? [{ v: "all", l: "All" }, { v: "open", l: "Open" }, { v: "in_progress", l: "In Progress" }, { v: "verified", l: "Done" }, { v: "closed", l: "Closed" }]
                      : origin === "note"
                      ? [{ v: "all", l: "All" }, { v: "open", l: "Open" }, { v: "closed", l: "Archived" }]
                      : [{ v: "all", l: "All" }, { v: "open", l: "Open" }, { v: "in_progress", l: "In Progress" }, { v: "ready_for_qa", l: "Ready for QA" }, { v: "verified", l: "Verified" }, { v: "closed", l: "Closed" }];

                  return statusOptions.map(({ v, l }) => {
                    const active = (filters.status ?? "open") === v;
                    return (
                      <button
                        key={v}
                        onClick={() => { setFilters({ status: v as never, page: 1 }); }}
                        style={{ padding: "3px 10px", fontSize: 11, fontWeight: active ? 700 : 500, borderRadius: 99, border: `1px solid ${active ? t.accent : t.border}`, background: active ? t.accent : "transparent", color: active ? t.accentText : t.textMuted, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}
                      >
                        {l}
                      </button>
                    );
                  });
                })()}
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {isCreating && <NewIssueForm origin={createType} onClose={closeCreateForm} />}
          {!isCreating && selectedIssue && (
            <IssueDetail issue={selectedIssue} onClose={() => selectIssue(null)} />
          )}
          {!isCreating && !selectedIssue && (
            visible.length === 0
              ? <EmptyState
                  message={
                    filters.search ? "No results found" :
                    activeOrigin === "feature" ? "No features found" :
                    activeOrigin === "note" ? "No notes found" :
                    "No issues found"
                  }
                  sub={(() => {
                    if (filters.search) return `No items match "${filters.search}". Try a different search term.`;
                    const hasAny = issues.some((i) =>
                      activeOrigin === "manual" ? (i.origin === "manual" || i.origin === "imported_markdown") : i.origin === activeOrigin
                    );
                    if (!hasAny) {
                      if (activeOrigin === "feature") return "Click '+ Add' → Feature to log your first feature.";
                      if (activeOrigin === "note") return "Click '+ Add' → Note to capture your first note.";
                      return "Click '+ Add' → New Issue to log your first bug.";
                    }
                    const statusLabel =
                      activeStatus === "all" ? "" :
                      activeStatus === "open" ? "open" :
                      activeStatus === "in_progress" ? "in progress" :
                      activeStatus === "ready_for_qa" ? "ready for QA" :
                      activeStatus === "verified" ? (activeOrigin === "feature" ? "done" : "verified") :
                      activeStatus === "closed" ? (activeOrigin === "note" ? "archived" : "closed") :
                      activeStatus;
                    if (activeOrigin === "feature") return `No ${statusLabel ? statusLabel + " " : ""}features. Try a different filter.`;
                    if (activeOrigin === "note") return `No ${statusLabel ? statusLabel + " " : ""}notes. Try a different filter.`;
                    return `No ${statusLabel ? statusLabel + " " : ""}issues. Try a different filter.`;
                  })()}
                />
              : <div style={{ overflowY: "auto", flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ flex: 1 }}>
                    {paged.map((issue, idx) => (
                      <IssueCard key={`${issue.id}-${idx}`} issue={issue} selected={selectedIssueId === issue.id} onClick={() => selectIssue(issue.id)} />
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <div style={{ padding: "10px 14px", borderTop: `1px solid ${t.border}`, background: t.bgSubtle, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                      <button
                        onClick={() => setPage(Math.max(1, safePage - 1))}
                        disabled={safePage === 1}
                        style={{ padding: "4px 12px", fontSize: 12, fontWeight: 600, borderRadius: 6, border: `1px solid ${t.border}`, background: t.btnIdle, color: safePage === 1 ? t.textFaint : t.btnIdleTxt, cursor: safePage === 1 ? "not-allowed" : "pointer", fontFamily: "inherit" }}
                      >
                        ← Prev
                      </button>
                      <span style={{ fontSize: 12, color: t.textMuted }}>
                        {safePage} / {totalPages} <span style={{ color: t.textFaint }}>({visible.length} total)</span>
                      </span>
                      <button
                        onClick={() => setPage(Math.min(totalPages, safePage + 1))}
                        disabled={safePage === totalPages}
                        style={{ padding: "4px 12px", fontSize: 12, fontWeight: 600, borderRadius: 6, border: `1px solid ${t.border}`, background: t.btnIdle, color: safePage === totalPages ? t.textFaint : t.btnIdleTxt, cursor: safePage === totalPages ? "not-allowed" : "pointer", fontFamily: "inherit" }}
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </div>
          )}
        </div>
      </div>

    </>
  );
}
