import { useTheme, tokens } from "@/lib/theme";

export default function App() {
  const { theme, toggle } = useTheme();
  const t = tokens[theme];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: t.bg,
        color: t.text,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "inherit",
        gap: 12,
      }}
    >
      <div style={{ fontSize: 32 }}>🐾</div>
      <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: t.text }}>QA Center</h1>
      <p style={{ margin: 0, fontSize: 13, color: t.textMuted }}>
        Click the <strong>QA</strong> button in the corner to open your issue tracker.
      </p>
      <button
        onClick={toggle}
        style={{
          marginTop: 8,
          padding: "6px 16px",
          fontSize: 12,
          fontWeight: 600,
          background: t.btnIdle,
          color: t.btnIdleTxt,
          border: `1px solid ${t.border}`,
          borderRadius: 6,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        {theme === "dark" ? "☀ Light mode" : "🌙 Dark mode"}
      </button>
    </div>
  );
}
