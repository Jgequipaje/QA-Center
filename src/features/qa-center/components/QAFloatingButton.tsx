import { useEffect, useRef, useState, useCallback } from "react";
import { useTheme, tokens } from "@/lib/theme";
import { useQACenterStore } from "../store/useQACenterStore";
import { useQACenterConfig } from "./QACenterConfigContext";
import NekoButton from "./NekoButton";

const EDGE_MARGIN = 12;
const DRAG_THRESHOLD = 5;
const STORAGE_KEY = "qa-btn-pos";

type Pos = { x: number; y: number };

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function snapToEdge(x: number, y: number, buttonSize: number): Pos {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const snapX = x + buttonSize / 2 < vw / 2 ? EDGE_MARGIN : vw - buttonSize - EDGE_MARGIN;
  const snapY = clamp(y, EDGE_MARGIN, vh - buttonSize - EDGE_MARGIN);
  return { x: snapX, y: snapY };
}

function loadPos(): Pos | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Pos;
    if (typeof parsed.x === "number" && typeof parsed.y === "number") return parsed;
  } catch { /* ignore */ }
  return null;
}

function savePos(pos: Pos) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(pos)); } catch { /* ignore */ }
}

function defaultPos(buttonSize: number): Pos {
  return { x: window.innerWidth - buttonSize - EDGE_MARGIN, y: 48 };
}

function shapeToRadius(shape: string): string {
  if (shape === "rounded") return "12px";
  if (shape === "square") return "4px";
  return "50%"; // "circle" and default
}

export default function QAFloatingButton() {
  const { theme } = useTheme();
  const t = tokens[theme];
  const { isDrawerOpen, openDrawer, closeDrawer, issues, loadIssues } = useQACenterStore();
  const { buttonColor, buttonSize, shape, logo, baseUrl, neko, nekoSpriteUrl } = useQACenterConfig();
  const openCount = issues.filter((i) => i.status === "open" || i.status === "in_progress" || i.status === "ready_for_qa").length;
  const nekoActive = issues.some((i) =>
    (i.origin === "manual" || i.origin === "feature") &&
    (i.status === "open" || i.status === "in_progress" || i.status === "ready_for_qa")
  );

  const [pos, setPos] = useState<Pos | null>(null);
  const dragging = useRef(false);
  const didDrag = useRef(false);
  const pointerId = useRef<number | null>(null);
  const startPtr = useRef<Pos>({ x: 0, y: 0 });
  const startPos = useRef<Pos>({ x: 0, y: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => { setPos(loadPos() ?? defaultPos(buttonSize)); }, [buttonSize]);

  // Load issues on mount so the badge count is correct immediately
  useEffect(() => { loadIssues(baseUrl); }, [baseUrl]);

  useEffect(() => {
    function onResize() {
      setPos((prev) => {
        if (!prev) return prev;
        const snapped = snapToEdge(prev.x, prev.y, buttonSize);
        savePos(snapped);
        return snapped;
      });
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [buttonSize]);

  const onPointerMove = useCallback((e: PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - startPtr.current.x;
    const dy = e.clientY - startPtr.current.y;
    if (!didDrag.current && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
    didDrag.current = true;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    setPos({ x: clamp(startPos.current.x + dx, EDGE_MARGIN, vw - buttonSize - EDGE_MARGIN), y: clamp(startPos.current.y + dy, EDGE_MARGIN, vh - buttonSize - EDGE_MARGIN) });
  }, [buttonSize]);

  const onPointerUp = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    if (pointerId.current !== null) {
      try { btnRef.current?.releasePointerCapture(pointerId.current); } catch { /* already released */ }
      pointerId.current = null;
    }
    setPos((prev) => {
      if (!prev) return prev;
      const snapped = snapToEdge(prev.x, prev.y, buttonSize);
      savePos(snapped);
      return snapped;
    });
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
  }, [onPointerMove, buttonSize]);

  function onPointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    e.preventDefault();
    dragging.current = true;
    didDrag.current = false;
    pointerId.current = e.pointerId;
    startPtr.current = { x: e.clientX, y: e.clientY };
    startPos.current = pos ?? defaultPos(buttonSize);
    btnRef.current?.setPointerCapture(e.pointerId);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  }

  function handleClick() {
    if (didDrag.current) return;
    if (isDrawerOpen) { closeDrawer(); }
    else { openDrawer(); loadIssues(baseUrl); }
  }

  if (!pos) return null;

  const activeBackground = theme === "dark" ? (buttonColor as { dark: string; light: string }).dark : (buttonColor as { dark: string; light: string }).light;

  return (
    <>
      {neko && (
        <NekoButton
          buttonX={pos.x}
          buttonY={pos.y}
          buttonSize={buttonSize}
          hasIssues={nekoActive}
          spriteUrl={nekoSpriteUrl}
        />
      )}
      <button
      ref={btnRef}
      onPointerDown={onPointerDown}
      onClick={handleClick}
      title="QA Center"
      style={{
        position: "fixed", left: pos.x, top: pos.y, zIndex: 998,
        width: buttonSize, height: buttonSize, borderRadius: shapeToRadius(shape),
        background: isDrawerOpen ? t.bgMuted : activeBackground,
        color: isDrawerOpen ? t.textMuted : t.btnActiveTxt,
        border: `1px solid ${t.border}`,
        cursor: dragging.current ? "grabbing" : "grab",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 13, fontWeight: 700,
        boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
        transition: "background 0.15s, box-shadow 0.15s",
        fontFamily: "inherit", userSelect: "none", touchAction: "none",
      }}
    >
      {isDrawerOpen ? "✕" : (
        logo ? (
          <span style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: "100%", height: "100%",
            fontSize: Math.round(buttonSize * 0.65) + "px",
            lineHeight: 1,
          }}>
            {logo}
          </span>
        ) : "QA"
      )}
      {!isDrawerOpen && openCount > 0 && (
        <span style={{ position: "absolute", top: -4, right: -4, background: t.failText, color: "#fff", borderRadius: "50%", width: 16, height: 16, fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${t.bg}`, pointerEvents: "none" }}>
          {openCount > 9 ? "9+" : openCount}
        </span>
      )}
    </button>
    </>
  );
}
