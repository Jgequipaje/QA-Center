import { jsx as r, jsxs as o, Fragment as J } from "react/jsx-runtime";
import ae, { createContext as Ae, useContext as ke, useState as h, useEffect as H, useRef as U, useCallback as be } from "react";
const fe = Ae({
  theme: "dark",
  toggle: () => {
  }
});
function ze({ children: e }) {
  const [n, i] = h("dark"), [t, s] = h(!1);
  return H(() => {
    const d = localStorage.getItem("theme"), u = d === "light" || d === "dark" ? d : "dark";
    i(u), document.documentElement.setAttribute("data-theme", u), s(!0), document.body.classList.add("theme-ready");
  }, []), H(() => {
    t && (localStorage.setItem("theme", n), document.documentElement.setAttribute("data-theme", n));
  }, [n, t]), t ? /* @__PURE__ */ r(fe.Provider, { value: { theme: n, toggle: () => i((d) => d === "light" ? "dark" : "light") }, children: e }) : /* @__PURE__ */ r(fe.Provider, { value: { theme: n, toggle: () => {
  } }, children: /* @__PURE__ */ r("div", { style: { visibility: "hidden" }, children: e }) });
}
function oe() {
  return ke(fe);
}
const ie = {
  light: {
    bg: "#ffffff",
    bgSubtle: "#fafafa",
    bgMuted: "#f4f4f5",
    border: "#e4e4e7",
    text: "#09090b",
    textMuted: "#71717a",
    textFaint: "#a1a1aa",
    link: "#7c3aed",
    passText: "#16a34a",
    passBg: "#dcfce7",
    failText: "#dc2626",
    failBg: "#fee2e2",
    warnBg: "#fffbeb",
    warnText: "#92400e",
    warnBorder: "#fcd34d",
    successBg: "#f0fdf4",
    successText: "#16a34a",
    rowFail: "#fffbeb",
    rowFailBorder: "#f59e0b",
    rowOk: "#ffffff",
    headerBg: "#fafafa",
    toolbarPassBg: "#f0fdf4",
    toolbarFailBg: "#fffbeb",
    btnActive: "#7c3aed",
    btnActiveTxt: "#ffffff",
    btnIdle: "#f4f4f5",
    btnIdleTxt: "#3f3f46",
    infoBg: "#ede9fe",
    infoBorder: "#c4b5fd",
    infoText: "#6d28d9",
    accent: "#7c3aed",
    accentText: "#ffffff"
  },
  dark: {
    bg: "#09090b",
    bgSubtle: "#111113",
    bgMuted: "#18181b",
    border: "#27272a",
    text: "#fafafa",
    textMuted: "#a1a1aa",
    textFaint: "#52525b",
    link: "#a78bfa",
    passText: "#4ade80",
    passBg: "#052e16",
    failText: "#f87171",
    failBg: "#450a0a",
    warnBg: "#1c1400",
    warnText: "#fbbf24",
    warnBorder: "#92400e",
    successBg: "#052e16",
    successText: "#4ade80",
    rowFail: "#1c1400",
    rowFailBorder: "#d97706",
    rowOk: "#09090b",
    headerBg: "#111113",
    toolbarPassBg: "#052e16",
    toolbarFailBg: "#1c1400",
    btnActive: "#7c3aed",
    btnActiveTxt: "#ffffff",
    btnIdle: "#18181b",
    btnIdleTxt: "#d4d4d8",
    infoBg: "#1e1030",
    infoBorder: "#4c1d95",
    infoText: "#a78bfa",
    accent: "#7c3aed",
    accentText: "#ffffff"
  }
}, Ce = ae.createContext({
  baseUrl: "http://localhost:3333",
  buttonColor: { dark: "#7c3aed", light: "#7c3aed" },
  buttonSize: 52,
  shape: "circle",
  logo: void 0,
  name: "QA Center",
  neko: !1,
  nekoSpriteUrl: void 0
});
function de() {
  return ke(Ce);
}
const xe = (e) => {
  let n;
  const i = /* @__PURE__ */ new Set(), t = (x, b) => {
    const p = typeof x == "function" ? x(n) : x;
    if (!Object.is(p, n)) {
      const C = n;
      n = b ?? (typeof p != "object" || p === null) ? p : Object.assign({}, n, p), i.forEach((D) => D(n, C));
    }
  }, s = () => n, m = { setState: t, getState: s, getInitialState: () => g, subscribe: (x) => (i.add(x), () => i.delete(x)) }, g = n = e(t, s, m);
  return m;
}, Re = ((e) => e ? xe(e) : xe), Be = (e) => e;
function Ee(e, n = Be) {
  const i = ae.useSyncExternalStore(
    e.subscribe,
    ae.useCallback(() => n(e.getState()), [e, n]),
    ae.useCallback(() => n(e.getInitialState()), [e, n])
  );
  return ae.useDebugValue(i), i;
}
const ye = (e) => {
  const n = Re(e), i = (t) => Ee(n, t);
  return Object.assign(i, n), i;
}, Fe = ((e) => e ? ye(e) : ye);
async function _e(e) {
  const n = await fetch(`${e}/api/qa-issues`);
  if (!n.ok) throw new Error("Failed to load issues.");
  return n.json();
}
async function Me(e, n) {
  const i = await fetch(`${e}/api/qa-issues`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(n)
  });
  if (!i.ok) {
    const t = await i.json().catch(() => ({}));
    throw new Error(t.error ?? "Failed to create issue.");
  }
  return i.json();
}
async function $e(e, n, i) {
  const t = await fetch(`${e}/api/qa-issues/${n}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(i)
  });
  if (!t.ok) throw new Error("Failed to update issue.");
  return t.json();
}
async function We(e, n, i) {
  const t = await fetch(`${e}/api/qa-issues/${n}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: i })
  });
  if (!t.ok) throw new Error("Failed to update issue.");
  return t.json();
}
async function De(e, n) {
  if (!(await fetch(`${e}/api/qa-issues/${n}`, { method: "DELETE" })).ok) throw new Error("Failed to delete issue.");
}
async function Ne(e) {
  const n = await fetch(`${e}/api/qa-tests`);
  return n.ok ? n.json() : [];
}
async function Le(e) {
  const n = await fetch(`${e}/api/qa-tests`, { method: "POST" });
  if (!n.ok) throw new Error("Failed to refresh tests.");
  return (await n.json()).tests;
}
async function Oe(e, n) {
  const i = await fetch(`${e}/api/qa-issues/${n}/run-test`, { method: "POST" });
  if (!i.ok) {
    const t = await i.json().catch(() => ({}));
    throw new Error(t.error ?? "Failed to run test.");
  }
  return i.json();
}
const ce = Fe((e, n) => ({
  isDrawerOpen: !1,
  selectedIssueId: null,
  isCreating: !1,
  isLoading: !1,
  loadError: null,
  issues: [],
  filters: { origin: "manual", status: "open" },
  openDrawer: () => e({ isDrawerOpen: !0 }),
  closeDrawer: () => e({ isDrawerOpen: !1, selectedIssueId: null, isCreating: !1 }),
  selectIssue: (i) => e({ selectedIssueId: i, isCreating: !1 }),
  openCreateForm: () => e({ isCreating: !0, selectedIssueId: null }),
  closeCreateForm: () => e({ isCreating: !1 }),
  setFilters: (i) => e((t) => ({ filters: { ...t.filters, ...i } })),
  switchTab: (i) => e({ filters: { origin: i, status: "open", page: 1 } }),
  clearFilters: () => e({ filters: { origin: "manual", status: "open", page: 1 } }),
  loadIssues: async (i) => {
    e({ isLoading: !0, loadError: null });
    try {
      const t = await _e(i);
      e({ issues: t, isLoading: !1 });
    } catch (t) {
      e({ isLoading: !1, loadError: t instanceof Error ? t.message : "Failed to load issues." });
    }
  },
  addIssue: (i, t) => {
    e((s) => ({ issues: [t, ...s.issues], isCreating: !1, selectedIssueId: t.id })), Me(i, t).then((s) => {
      e((d) => ({
        issues: d.issues.map((u) => u.id === t.id ? s : u),
        selectedIssueId: d.selectedIssueId === t.id ? s.id : d.selectedIssueId
      }));
    }).catch(() => {
      e((s) => ({ issues: s.issues.filter((d) => d.id !== t.id) }));
    });
  },
  updateIssueStatus: (i, t, s) => {
    e((d) => ({
      issues: d.issues.map((u) => u.id === t ? { ...u, status: s, updatedAt: Date.now() } : u)
    })), We(i, t, s).catch(() => {
      n().loadIssues(i);
    });
  },
  updateIssue: (i, t) => {
    e((s) => ({
      issues: s.issues.map((d) => d.id === i ? { ...d, ...t, updatedAt: Date.now() } : d)
    }));
  },
  saveIssue: async (i, t, s) => {
    const d = n().issues;
    e((u) => ({
      issues: u.issues.map((m) => m.id === t ? { ...m, ...s, updatedAt: Date.now() } : m)
    }));
    try {
      const u = await $e(i, t, s);
      e((m) => ({ issues: m.issues.map((g) => g.id === t ? u : g) }));
    } catch {
      e({ issues: d });
    }
  },
  deleteIssue: (i, t) => {
    const s = n().issues;
    e((d) => ({
      issues: d.issues.filter((u) => u.id !== t),
      selectedIssueId: d.selectedIssueId === t ? null : d.selectedIssueId
    })), De(i, t).catch(() => {
      e({ issues: s });
    });
  }
})), Pe = {
  idle: [[-3, -3]],
  tired: [[-3, -2]],
  sleeping: [[-2, 0], [-2, -1]],
  scratchSelf: [[-5, 0], [-6, 0], [-7, 0]],
  alert: [[-7, -3]]
}, ee = 32, qe = ["idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "tired", "tired", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "sleeping"], je = ["idle", "idle", "idle", "idle", "alert", "alert", "scratchSelf", "scratchSelf", "scratchSelf", "scratchSelf", "scratchSelf", "scratchSelf", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "scratchSelf", "scratchSelf", "scratchSelf", "scratchSelf", "idle", "idle", "idle", "idle", "idle", "idle"];
function Ue({ buttonX: e, buttonY: n, buttonSize: i, hasIssues: t, spriteUrl: s, baseUrl: d }) {
  const u = s ?? `${d}/oneko.gif`, [m, g] = h(`${-3 * ee}px ${-3 * ee}px`), x = U(0), b = U(0), p = U(0), C = U(0), D = e + i / 2 - ee / 2, k = Math.max(0, n - ee + 6);
  return H(() => {
    x.current = 0, b.current = 0;
  }, [t]), H(() => {
    function L(v) {
      if (C.current || (C.current = v), v - C.current > 150) {
        C.current = v;
        const z = t ? je : qe, E = z[x.current % z.length], M = Pe[E], [$, P] = M[b.current % M.length];
        g(`${$ * ee}px ${P * ee}px`), b.current += 1, b.current >= M.length && (b.current = 0, x.current += 1, x.current >= z.length && (x.current = 0));
      }
      p.current = requestAnimationFrame(L);
    }
    return p.current = requestAnimationFrame(L), () => cancelAnimationFrame(p.current);
  }, [t]), /* @__PURE__ */ r(
    "div",
    {
      "aria-hidden": !0,
      style: {
        position: "fixed",
        left: D,
        top: k,
        width: ee,
        height: ee,
        backgroundImage: `url(${u})`,
        backgroundPosition: m,
        backgroundRepeat: "no-repeat",
        backgroundSize: "auto",
        imageRendering: "pixelated",
        pointerEvents: "none",
        zIndex: 1001
      }
    }
  );
}
const X = 12, He = 5, Ie = "qa-btn-pos";
function ge(e, n, i) {
  return Math.max(n, Math.min(i, e));
}
function me(e, n, i) {
  const t = window.innerWidth, s = window.innerHeight, d = e + i / 2 < t / 2 ? X : t - i - X, u = ge(n, X, s - i - X);
  return { x: d, y: u };
}
function Qe() {
  try {
    const e = localStorage.getItem(Ie);
    if (!e) return null;
    const n = JSON.parse(e);
    if (typeof n.x == "number" && typeof n.y == "number") return n;
  } catch {
  }
  return null;
}
function ve(e) {
  try {
    localStorage.setItem(Ie, JSON.stringify(e));
  } catch {
  }
}
function Se(e) {
  return { x: window.innerWidth - e - X, y: 48 };
}
function Ge(e) {
  return e === "rounded" ? "12px" : e === "square" ? "4px" : "50%";
}
function Ye() {
  const { theme: e } = oe(), n = ie[e], { isDrawerOpen: i, openDrawer: t, closeDrawer: s, issues: d, loadIssues: u } = ce(), { buttonColor: m, buttonSize: g, shape: x, logo: b, baseUrl: p, neko: C, nekoSpriteUrl: D } = de(), k = d.filter((f) => f.status === "open" || f.status === "in_progress" || f.status === "ready_for_qa").length, L = d.some(
    (f) => (f.origin === "manual" || f.origin === "feature") && (f.status === "open" || f.status === "in_progress" || f.status === "ready_for_qa")
  ), [v, z] = h(null), E = U(!1), M = U(!1), $ = U(null), P = U({ x: 0, y: 0 }), W = U({ x: 0, y: 0 }), q = U(null);
  H(() => {
    z(Qe() ?? Se(g));
  }, [g]), H(() => {
    u(p);
  }, [p]), H(() => {
    function f() {
      z((y) => {
        if (!y) return y;
        const B = me(y.x, y.y, g);
        return ve(B), B;
      });
    }
    return window.addEventListener("resize", f), () => window.removeEventListener("resize", f);
  }, [g]);
  const N = be((f) => {
    if (!E.current) return;
    const y = f.clientX - P.current.x, B = f.clientY - P.current.y;
    if (!M.current && Math.hypot(y, B) < He) return;
    M.current = !0;
    const _ = window.innerWidth, S = window.innerHeight;
    z({ x: ge(W.current.x + y, X, _ - g - X), y: ge(W.current.y + B, X, S - g - X) });
  }, [g]), Q = be(() => {
    var f;
    if (E.current) {
      if (E.current = !1, $.current !== null) {
        try {
          (f = q.current) == null || f.releasePointerCapture($.current);
        } catch {
        }
        $.current = null;
      }
      z((y) => {
        if (!y) return y;
        const B = me(y.x, y.y, g);
        return ve(B), B;
      }), window.removeEventListener("pointermove", N), window.removeEventListener("pointerup", Q);
    }
  }, [N, g]);
  function O(f) {
    var y;
    f.button !== 0 && f.pointerType === "mouse" || (f.preventDefault(), E.current = !0, M.current = !1, $.current = f.pointerId, P.current = { x: f.clientX, y: f.clientY }, W.current = v ?? Se(g), (y = q.current) == null || y.setPointerCapture(f.pointerId), window.addEventListener("pointermove", N), window.addEventListener("pointerup", Q));
  }
  function R() {
    M.current || (i ? s() : (t(), u(p)));
  }
  if (!v) return null;
  const F = e === "dark" ? m.dark : m.light;
  return /* @__PURE__ */ o(J, { children: [
    C && v && /* @__PURE__ */ r(
      Ue,
      {
        buttonX: v.x,
        buttonY: v.y,
        buttonSize: g,
        hasIssues: L,
        spriteUrl: D,
        baseUrl: p
      }
    ),
    /* @__PURE__ */ o(
      "button",
      {
        ref: q,
        onPointerDown: O,
        onClick: R,
        title: "QA Center",
        style: {
          position: "fixed",
          left: v.x,
          top: v.y,
          zIndex: 998,
          width: g,
          height: g,
          borderRadius: Ge(x),
          background: i ? n.bgMuted : F,
          color: i ? n.textMuted : n.btnActiveTxt,
          border: `1px solid ${n.border}`,
          cursor: E.current ? "grabbing" : "grab",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          fontWeight: 700,
          boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
          transition: "background 0.15s, box-shadow 0.15s",
          fontFamily: "inherit",
          userSelect: "none",
          touchAction: "none"
        },
        children: [
          i ? "✕" : b ? /* @__PURE__ */ r("span", { style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            fontSize: Math.round(g * 0.65) + "px",
            lineHeight: 1
          }, children: b }) : "QA",
          !i && k > 0 && /* @__PURE__ */ r("span", { style: { position: "absolute", top: -4, right: -4, background: n.failText, color: "#fff", borderRadius: "50%", width: 16, height: 16, fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${n.bg}`, pointerEvents: "none" }, children: k > 9 ? "9+" : k })
        ]
      }
    )
  ] });
}
const Ve = {
  critical: "#f87171",
  high: "#fb923c",
  medium: "#fbbf24",
  low: "#60a5fa",
  info: "#9ca3af"
}, we = {
  manual: { label: "🐛 Issue", bg: "#450a0a", color: "#f87171" },
  feature: { label: "✨ Feature", bg: "#1e1030", color: "#a78bfa" },
  note: { label: "📝 Note", bg: "#1c1400", color: "#fbbf24" },
  imported_markdown: { label: "Imported", bg: "#1e2a3a", color: "#93c5fd" }
}, Je = {
  open: { bg: "#450a0a", color: "#f87171" },
  in_progress: { bg: "#292218", color: "#fbbf24" },
  ready_for_qa: { bg: "#1e2a3a", color: "#93c5fd" },
  verified: { bg: "#0f2318", color: "#4ade80" },
  closed: { bg: "#242424", color: "#9ca3af" }
};
function Xe(e) {
  return e.replace(/_/g, " ").replace(/\b\w/g, (n) => n.toUpperCase());
}
function Ke({ issue: e, selected: n, onClick: i }) {
  const { theme: t } = oe(), s = ie[t], d = e.origin === "imported_markdown", u = we[e.origin] ?? we.manual, m = e.origin === "feature" ? "#a78bfa" : e.origin === "note" ? "#fbbf24" : d ? s.infoText : Ve[e.severity ?? "info"] ?? s.textFaint, g = Je[e.status] ?? { bg: s.bgMuted, color: s.textMuted };
  return /* @__PURE__ */ r(
    "button",
    {
      onClick: i,
      style: {
        width: "100%",
        textAlign: "left",
        padding: "10px 14px",
        background: n ? s.infoBg : "transparent",
        border: "none",
        borderBottom: `1px solid ${s.border}`,
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "background 0.12s"
      },
      children: /* @__PURE__ */ o("div", { style: { display: "flex", alignItems: "flex-start", gap: 8 }, children: [
        /* @__PURE__ */ r("span", { style: { width: 3, minHeight: 40, borderRadius: 2, background: m, flexShrink: 0, marginTop: 2 } }),
        /* @__PURE__ */ o("div", { style: { flex: 1, minWidth: 0 }, children: [
          /* @__PURE__ */ r("div", { style: { fontSize: 13, fontWeight: 600, color: s.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: e.title }),
          /* @__PURE__ */ o("div", { style: { display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }, children: [
            /* @__PURE__ */ r("span", { style: { fontSize: 10, padding: "1px 7px", borderRadius: 4, background: u.bg, color: u.color, fontWeight: 600 }, children: u.label }),
            /* @__PURE__ */ r("span", { style: { fontSize: 10, padding: "1px 7px", borderRadius: 4, background: g.bg, color: g.color, fontWeight: 600 }, children: Xe(e.status) }),
            !d && e.origin === "manual" && e.severity && /* @__PURE__ */ r("span", { style: { fontSize: 10, padding: "1px 7px", borderRadius: 4, background: s.bgMuted, color: m, fontWeight: 600 }, children: e.severity.charAt(0).toUpperCase() + e.severity.slice(1) }),
            e.origin === "feature" && e.severity && /* @__PURE__ */ o("span", { style: { fontSize: 10, padding: "1px 7px", borderRadius: 4, background: s.bgMuted, color: "#a78bfa", fontWeight: 600 }, children: [
              "P: ",
              e.severity.charAt(0).toUpperCase() + e.severity.slice(1)
            ] }),
            e.area && /* @__PURE__ */ r("span", { style: { fontSize: 10, padding: "1px 7px", borderRadius: 4, background: s.bgMuted, color: s.textMuted }, children: e.area }),
            d && e.sourceRef && /* @__PURE__ */ r("span", { style: { fontSize: 10, color: s.textFaint }, children: e.sourceRef }),
            e.automationStatus && e.origin === "manual" && /* @__PURE__ */ r("span", { style: {
              fontSize: 10,
              padding: "1px 7px",
              borderRadius: 4,
              background: s.bgMuted,
              color: e.automationStatus.result === "passed" ? "#4ade80" : e.automationStatus.result === "failed" ? "#f87171" : s.textFaint,
              fontWeight: 600
            }, children: e.automationStatus.result === "passed" ? "✓ Test passed" : e.automationStatus.result === "failed" ? "✕ Test failed" : "Test not run" })
          ] })
        ] })
      ] })
    }
  );
}
const Ze = {
  open: ["in_progress", "closed"],
  in_progress: ["ready_for_qa", "open", "closed"],
  ready_for_qa: ["verified", "in_progress", "closed"],
  verified: ["closed", "open"],
  closed: ["open"]
}, et = {
  open: ["in_progress", "closed"],
  in_progress: ["verified", "open", "closed"],
  ready_for_qa: ["verified", "in_progress", "closed"],
  verified: ["closed", "open"],
  closed: ["open"]
}, tt = {
  open: ["closed"],
  in_progress: ["closed"],
  ready_for_qa: ["closed"],
  verified: ["closed"],
  closed: ["open"]
}, nt = {
  in_progress: "Start Progress",
  ready_for_qa: "Ready for QA",
  verified: "Mark Verified",
  closed: "Close",
  open: "Re-open"
}, rt = {
  in_progress: "Start Work",
  verified: "Mark Done",
  closed: "Close",
  open: "Re-open"
}, ot = {
  closed: "Archive",
  open: "Unarchive"
}, it = { passed: "#4ade80", failed: "#f87171", not_run: "#9ca3af" };
function Te(e) {
  return e.replace(/_/g, " ").replace(/\b\w/g, (n) => n.toUpperCase());
}
function pe(e) {
  return new Date(e).toLocaleString();
}
function le({ label: e, color: n, bg: i }) {
  return /* @__PURE__ */ r("span", { style: { fontSize: 10, padding: "2px 8px", borderRadius: 4, background: i, color: n, fontWeight: 600 }, children: e });
}
function lt({ issue: e, onClose: n }) {
  var Z, V, he;
  const { theme: i } = oe(), t = ie[i], { updateIssueStatus: s, updateIssue: d, saveIssue: u, deleteIssue: m, loadIssues: g } = ce(), { baseUrl: x } = de(), [b, p] = h(!1), [C, D] = h(null), [k, L] = h(!1), v = U(!0), [z, E] = h(e.title), [M, $] = h(e.description ?? ""), [P, W] = h(e.severity ?? "medium"), [q, N] = h(e.area ?? ""), [Q, O] = h(e.reproSteps ?? ""), [R, F] = h(e.expected ?? ""), [f, y] = h(e.actual ?? ""), [B, _] = h(e.notes ?? ""), [S, te] = h(!1);
  H(() => (v.current = !0, () => {
    v.current = !1;
  }), []), H(() => {
    k || (E(e.title), $(e.description ?? ""), W(e.severity ?? "medium"), N(e.area ?? ""), O(e.reproSteps ?? ""), F(e.expected ?? ""), y(e.actual ?? ""), _(e.notes ?? ""));
  }, [e, k]);
  const a = e.origin, T = a === "note" ? tt : a === "feature" ? et : Ze, w = a === "note" ? ot : a === "feature" ? rt : nt, Y = T[e.status] ?? [], j = ((Z = e.automationStatus) == null ? void 0 : Z.result) ?? "not_run", ne = !!e.linkedTest && a === "manual";
  function K(c) {
    return c !== "verified" || a !== "manual" || !ne ? !0 : j === "passed";
  }
  function se(c) {
    return c !== "verified" || a !== "manual" || !ne ? null : j !== "passed" ? "The linked test must pass before this issue can be marked verified." : null;
  }
  async function I() {
    p(!0), D(null);
    try {
      const c = await Oe(x, e.id);
      if (!v.current) return;
      d(e.id, { automationStatus: c.automationStatus, updatedAt: c.updatedAt }), await g(x);
    } catch (c) {
      if (!v.current) return;
      D(c instanceof Error ? c.message : "Failed to run test.");
    } finally {
      v.current && p(!1);
    }
  }
  async function A() {
    z.trim() && (te(!0), await u(x, e.id, {
      title: z.trim(),
      description: M.trim() || void 0,
      severity: P,
      area: q.trim() || void 0,
      reproSteps: Q.trim() || void 0,
      expected: R.trim() || void 0,
      actual: f.trim() || void 0,
      notes: B.trim() || void 0
    }), v.current && (te(!1), L(!1)));
  }
  function ue() {
    E(e.title), $(e.description ?? ""), W(e.severity ?? "medium"), N(e.area ?? ""), O(e.reproSteps ?? ""), F(e.expected ?? ""), y(e.actual ?? ""), _(e.notes ?? ""), L(!1);
  }
  const G = { width: "100%", padding: "5px 8px", fontSize: 12, background: t.bg, color: t.text, border: `1px solid ${t.border}`, borderRadius: 6, fontFamily: "inherit", boxSizing: "border-box", outline: "none" }, l = { fontSize: 10, fontWeight: 600, color: t.textMuted, textTransform: "uppercase", marginBottom: 3, display: "block" };
  return /* @__PURE__ */ o("div", { style: { display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }, children: [
    /* @__PURE__ */ o("div", { style: { padding: "14px 16px", overflowY: "auto", flex: 1 }, children: [
      /* @__PURE__ */ o("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }, children: [
        k ? /* @__PURE__ */ r("input", { value: z, onChange: (c) => E(c.target.value), style: { ...G, fontSize: 13, fontWeight: 700, flex: 1, marginRight: 8 }, placeholder: "Issue title" }) : /* @__PURE__ */ r("span", { style: { fontSize: 13, fontWeight: 700, color: t.text, flex: 1, marginRight: 8 }, children: e.title }),
        /* @__PURE__ */ r("button", { onClick: n, disabled: b || S, "data-testid": "detail-close", style: { background: "none", border: "none", cursor: b || S ? "not-allowed" : "pointer", color: b || S ? t.textFaint : t.textMuted, fontSize: 16, padding: 0 }, title: b || S ? "Operation in progress..." : void 0, children: "✕" })
      ] }),
      !k && /* @__PURE__ */ o("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }, children: [
        a === "feature" && /* @__PURE__ */ r(le, { label: "✨ Feature", color: t.infoText, bg: t.infoBg }),
        a === "note" && /* @__PURE__ */ r(le, { label: "📝 Note", color: t.textMuted, bg: t.bgMuted }),
        /* @__PURE__ */ r(le, { label: Te(e.status), color: t.infoText, bg: t.infoBg }),
        e.severity && a !== "note" && /* @__PURE__ */ r(le, { label: a === "feature" ? `Priority: ${e.severity}` : e.severity, color: t.warnText, bg: t.warnBg }),
        e.area && /* @__PURE__ */ r(le, { label: e.area, color: t.textMuted, bg: t.bgMuted })
      ] }),
      k && /* @__PURE__ */ o("div", { style: { display: "flex", flexDirection: "column", gap: 10 }, children: [
        a !== "note" && /* @__PURE__ */ o("div", { style: { display: "flex", gap: 8 }, children: [
          /* @__PURE__ */ o("div", { style: { flex: 1 }, children: [
            /* @__PURE__ */ r("label", { style: l, children: a === "feature" ? "Priority" : "Severity" }),
            /* @__PURE__ */ r("select", { value: P, onChange: (c) => W(c.target.value), style: G, children: ["critical", "high", "medium", "low", "info"].map((c) => /* @__PURE__ */ r("option", { value: c, children: c.charAt(0).toUpperCase() + c.slice(1) }, c)) })
          ] }),
          /* @__PURE__ */ o("div", { style: { flex: 1 }, children: [
            /* @__PURE__ */ r("label", { style: l, children: "Area / Module" }),
            /* @__PURE__ */ r("input", { value: q, onChange: (c) => N(c.target.value), placeholder: "e.g. auth, dashboard", style: G })
          ] })
        ] }),
        a === "note" && /* @__PURE__ */ o("div", { children: [
          /* @__PURE__ */ r("label", { style: l, children: "Tag / Area" }),
          /* @__PURE__ */ r("input", { value: q, onChange: (c) => N(c.target.value), placeholder: "e.g. design, meeting", style: G })
        ] }),
        /* @__PURE__ */ o("div", { children: [
          /* @__PURE__ */ r("label", { style: l, children: a === "note" ? "Content" : "Description" }),
          /* @__PURE__ */ r("textarea", { value: M, onChange: (c) => $(c.target.value), rows: a === "note" ? 8 : 3, style: { ...G, resize: "vertical" }, placeholder: a === "note" ? "Write your note..." : "What is the issue?" })
        ] }),
        a === "manual" && /* @__PURE__ */ o(J, { children: [
          /* @__PURE__ */ o("div", { children: [
            /* @__PURE__ */ r("label", { style: l, children: "Repro Steps" }),
            /* @__PURE__ */ r("textarea", { value: Q, onChange: (c) => O(c.target.value), rows: 3, style: { ...G, resize: "vertical" }, placeholder: "1. Go to..." })
          ] }),
          /* @__PURE__ */ o("div", { style: { display: "flex", gap: 8 }, children: [
            /* @__PURE__ */ o("div", { style: { flex: 1 }, children: [
              /* @__PURE__ */ r("label", { style: l, children: "Expected" }),
              /* @__PURE__ */ r("input", { value: R, onChange: (c) => F(c.target.value), placeholder: "What should happen", style: G })
            ] }),
            /* @__PURE__ */ o("div", { style: { flex: 1 }, children: [
              /* @__PURE__ */ r("label", { style: l, children: "Actual" }),
              /* @__PURE__ */ r("input", { value: f, onChange: (c) => y(c.target.value), placeholder: "What actually happens", style: G })
            ] })
          ] })
        ] }),
        a === "feature" && /* @__PURE__ */ o("div", { children: [
          /* @__PURE__ */ r("label", { style: l, children: "Acceptance Criteria" }),
          /* @__PURE__ */ r("textarea", { value: B, onChange: (c) => _(c.target.value), rows: 4, style: { ...G, resize: "vertical" }, placeholder: `- Given... When... Then...
- User can...` })
        ] })
      ] }),
      !k && /* @__PURE__ */ o(J, { children: [
        ne && /* @__PURE__ */ o("div", { style: { marginBottom: 12, padding: "10px 12px", background: t.bgSubtle, borderRadius: 8, border: `1px solid ${t.border}` }, children: [
          /* @__PURE__ */ r("div", { style: { fontSize: 11, fontWeight: 600, color: t.textMuted, textTransform: "uppercase", marginBottom: 6 }, children: "Linked Test" }),
          /* @__PURE__ */ r("div", { style: { fontSize: 12, color: t.text, marginBottom: 6 }, children: e.linkedTest.fullTitle }),
          /* @__PURE__ */ o("div", { style: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }, children: [
            /* @__PURE__ */ r("span", { style: { fontSize: 11, fontWeight: 700, color: it[j] ?? t.textFaint }, children: j === "not_run" ? "Not run yet" : j === "passed" ? "✓ Passed" : "✕ Failed" }),
            ((V = e.automationStatus) == null ? void 0 : V.lastRun) && /* @__PURE__ */ o("span", { style: { fontSize: 11, color: t.textFaint }, children: [
              "· ",
              pe(e.automationStatus.lastRun)
            ] })
          ] }),
          ((he = e.automationStatus) == null ? void 0 : he.message) && j === "failed" && /* @__PURE__ */ r("pre", { style: { fontSize: 11, color: t.failText, marginTop: 6, background: t.failBg, padding: "8px 10px", borderRadius: 6, whiteSpace: "pre-wrap", wordBreak: "break-word", margin: "6px 0 0", fontFamily: "inherit", lineHeight: 1.5 }, children: e.automationStatus.message }),
          C && /* @__PURE__ */ r("div", { style: { fontSize: 11, color: t.failText, marginTop: 4 }, children: C }),
          b && /* @__PURE__ */ r("div", { style: { fontSize: 11, color: t.infoText, marginTop: 4 }, children: "⏳ Test running — keep this panel open..." })
        ] }),
        e.description && /* @__PURE__ */ o("div", { style: { marginTop: 12 }, children: [
          /* @__PURE__ */ r("div", { style: { fontSize: 11, fontWeight: 600, color: t.textMuted, textTransform: "uppercase", marginBottom: 4 }, children: "Description" }),
          /* @__PURE__ */ r("div", { style: { fontSize: 12, color: t.text, lineHeight: 1.6 }, children: e.description })
        ] }),
        e.reproSteps && /* @__PURE__ */ o("div", { style: { marginTop: 12 }, children: [
          /* @__PURE__ */ r("div", { style: { fontSize: 11, fontWeight: 600, color: t.textMuted, textTransform: "uppercase", marginBottom: 4 }, children: "Repro Steps" }),
          /* @__PURE__ */ r("pre", { style: { margin: 0, whiteSpace: "pre-wrap", fontSize: 11, color: t.text, lineHeight: 1.6 }, children: e.reproSteps })
        ] }),
        (e.expected || e.actual) && /* @__PURE__ */ o("div", { style: { marginTop: 12 }, children: [
          /* @__PURE__ */ r("div", { style: { fontSize: 11, fontWeight: 600, color: t.textMuted, textTransform: "uppercase", marginBottom: 4 }, children: "Expected vs Actual" }),
          e.expected && /* @__PURE__ */ o("div", { style: { color: t.passText, fontSize: 12, marginBottom: 4 }, children: [
            "Expected: ",
            e.expected
          ] }),
          e.actual && /* @__PURE__ */ o("div", { style: { color: t.failText, fontSize: 12 }, children: [
            "Actual: ",
            e.actual
          ] })
        ] }),
        e.notes && /* @__PURE__ */ o("div", { style: { marginTop: 12 }, children: [
          /* @__PURE__ */ r("div", { style: { fontSize: 11, fontWeight: 600, color: t.textMuted, textTransform: "uppercase", marginBottom: 4 }, children: a === "feature" ? "Acceptance Criteria" : "Notes" }),
          /* @__PURE__ */ r("pre", { style: { margin: 0, whiteSpace: "pre-wrap", fontSize: 12, color: t.text, lineHeight: 1.6, fontFamily: "inherit" }, children: e.notes })
        ] }),
        /* @__PURE__ */ o("div", { style: { fontSize: 11, color: t.textFaint, marginTop: 12 }, children: [
          "Created ",
          pe(e.createdAt),
          " · Updated ",
          pe(e.updatedAt)
        ] })
      ] })
    ] }),
    /* @__PURE__ */ r("div", { style: { padding: "10px 14px", borderTop: `1px solid ${t.border}`, background: t.bgSubtle, display: "flex", flexWrap: "wrap", gap: 6, flexShrink: 0 }, children: k ? /* @__PURE__ */ o(J, { children: [
      /* @__PURE__ */ r("button", { onClick: A, disabled: S || !z.trim(), style: { padding: "5px 14px", fontSize: 12, fontWeight: 600, borderRadius: 6, fontFamily: "inherit", cursor: S ? "not-allowed" : "pointer", background: t.btnActive, color: t.btnActiveTxt, border: "none", opacity: S ? 0.6 : 1 }, children: S ? "Saving..." : "Save" }),
      /* @__PURE__ */ r("button", { onClick: ue, disabled: S, style: { padding: "5px 12px", fontSize: 12, fontWeight: 600, borderRadius: 6, fontFamily: "inherit", cursor: "pointer", background: t.btnIdle, color: t.btnIdleTxt, border: `1px solid ${t.border}` }, children: "Cancel" })
    ] }) : /* @__PURE__ */ o(J, { children: [
      ne && /* @__PURE__ */ r("button", { onClick: I, disabled: b, style: { padding: "5px 12px", fontSize: 12, fontWeight: 600, borderRadius: 6, fontFamily: "inherit", cursor: b ? "not-allowed" : "pointer", background: t.infoBg, color: t.infoText, border: `1px solid ${t.infoBorder}`, opacity: b ? 0.6 : 1 }, children: b ? "Running..." : "▶ Run Test" }),
      /* @__PURE__ */ r("button", { onClick: () => L(!0), style: { padding: "5px 12px", fontSize: 12, fontWeight: 600, borderRadius: 6, fontFamily: "inherit", cursor: "pointer", background: t.btnIdle, color: t.btnIdleTxt, border: `1px solid ${t.border}` }, children: "✎ Edit" }),
      Y.map((c) => {
        const re = !K(c);
        return /* @__PURE__ */ r("button", { onClick: () => !re && s(x, e.id, c), disabled: re, title: se(c) ?? void 0, style: { padding: "5px 12px", fontSize: 12, fontWeight: 600, borderRadius: 6, fontFamily: "inherit", cursor: re ? "not-allowed" : "pointer", background: c === "verified" && !re ? t.btnActive : t.btnIdle, color: c === "verified" && !re ? t.btnActiveTxt : t.btnIdleTxt, border: c === "closed" ? `1px solid ${t.failText}` : `1px solid ${t.border}`, opacity: re ? 0.45 : 1 }, children: w[c] ?? Te(c) }, c);
      }),
      Y.includes("verified") && !K("verified") && /* @__PURE__ */ r("div", { style: { width: "100%", fontSize: 11, color: t.warnText, marginTop: 2 }, children: se("verified") }),
      /* @__PURE__ */ r("button", { onClick: () => {
        m(x, e.id), n();
      }, style: { marginLeft: "auto", padding: "5px 12px", fontSize: 12, fontWeight: 600, borderRadius: 6, fontFamily: "inherit", cursor: "pointer", background: "transparent", color: t.failText, border: `1px solid ${t.failText}` }, children: "Delete" })
    ] }) })
  ] });
}
function at({ onClose: e, origin: n = "manual" }) {
  const { theme: i } = oe(), t = ie[i], { addIssue: s } = ce(), { baseUrl: d } = de(), [u, m] = h(""), [g, x] = h(""), [b, p] = h(""), [C, D] = h(""), [k, L] = h("medium"), [v, z] = h(""), [E, M] = h(""), [$, P] = h(""), [W, q] = h([]), [N, Q] = h(""), [O, R] = h(""), [F, f] = h(!1), [y, B] = h(""), [_, S] = h("medium"), [te, a] = h(""), [T, w] = h("");
  H(() => {
    n === "manual" && (f(!0), Ne(d).then(q).finally(() => f(!1)));
  }, [n, d]);
  async function Y() {
    f(!0);
    try {
      const l = await Le(d);
      q(l);
    } finally {
      f(!1);
    }
  }
  const ne = (O ? W.filter((l) => l.fullTitle.toLowerCase().includes(O.toLowerCase())) : W).reduce((l, Z) => {
    const V = Z.describe ?? Z.file;
    return l[V] || (l[V] = []), l[V].push(Z), l;
  }, {}), K = W.find((l) => l.id === N);
  function se() {
    if (!u.trim()) {
      p("Title is required.");
      return;
    }
    if (n === "manual" && !C.trim()) {
      p("Description is required.");
      return;
    }
    if (n === "feature" && !y.trim()) {
      p("Description is required.");
      return;
    }
    if (n === "note" && !T.trim()) {
      p("Content is required.");
      return;
    }
    const l = Date.now();
    n === "manual" ? s(d, {
      id: `issue-${l}-${Math.random().toString(36).slice(2, 6)}`,
      origin: "manual",
      title: u.trim(),
      description: C.trim(),
      status: "open",
      severity: k,
      area: g.trim() || void 0,
      reproSteps: v.trim() || void 0,
      expected: E.trim() || void 0,
      actual: $.trim() || void 0,
      linkedTest: K ? { ...K, tag: `@issue-${l}` } : void 0,
      automationStatus: K ? { result: "not_run", lastRun: null, message: "" } : void 0,
      createdAt: l,
      updatedAt: l
    }) : n === "feature" ? s(d, {
      id: `issue-${l}-${Math.random().toString(36).slice(2, 6)}`,
      origin: "feature",
      title: u.trim(),
      description: y.trim(),
      status: "open",
      severity: _,
      area: g.trim() || void 0,
      notes: te.trim() || void 0,
      createdAt: l,
      updatedAt: l
    }) : n === "note" && s(d, {
      id: `issue-${l}-${Math.random().toString(36).slice(2, 6)}`,
      origin: "note",
      title: u.trim(),
      description: T.trim(),
      status: "open",
      area: g.trim() || void 0,
      createdAt: l,
      updatedAt: l
    });
  }
  const I = { width: "100%", padding: "6px 8px", fontSize: 13, background: t.bg, color: t.text, border: `1px solid ${t.border}`, borderRadius: 6, fontFamily: "inherit", boxSizing: "border-box", outline: "none" }, A = { fontSize: 11, fontWeight: 600, color: t.textMuted, textTransform: "uppercase", marginBottom: 4, display: "block" }, ue = n === "feature" ? "✨ New Feature" : n === "note" ? "📝 New Note" : "🐛 New Issue", G = n === "feature" ? "Add Feature" : n === "note" ? "Add Note" : "Create Issue";
  return /* @__PURE__ */ o("div", { style: { display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }, children: [
    /* @__PURE__ */ o("div", { style: { padding: "14px 16px", overflowY: "auto", flex: 1 }, children: [
      /* @__PURE__ */ o("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }, children: [
        /* @__PURE__ */ r("span", { style: { fontWeight: 700, fontSize: 14, color: t.text }, children: ue }),
        /* @__PURE__ */ r("button", { onClick: e, style: { background: "none", border: "none", cursor: "pointer", color: t.textMuted, fontSize: 16, padding: 0 }, children: "✕" })
      ] }),
      b && /* @__PURE__ */ r("div", { style: { fontSize: 12, color: t.failText, background: t.failBg, padding: "8px 12px", borderRadius: 6, marginBottom: 10 }, children: b }),
      n === "manual" && /* @__PURE__ */ o(J, { children: [
        /* @__PURE__ */ o("div", { style: { marginBottom: 14, padding: "10px 12px", background: t.bgSubtle, borderRadius: 8, border: `1px solid ${t.border}` }, children: [
          /* @__PURE__ */ o("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }, children: [
            /* @__PURE__ */ r("label", { style: A, children: "Link Playwright Test (optional)" }),
            /* @__PURE__ */ r("button", { type: "button", onClick: Y, disabled: F, style: { fontSize: 11, color: t.link, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0 }, children: F ? "Scanning..." : "↻ Refresh" })
          ] }),
          /* @__PURE__ */ r("input", { type: "text", placeholder: "Search tests...", value: O, onChange: (l) => R(l.target.value), style: { ...I, marginBottom: 6 } }),
          /* @__PURE__ */ o("select", { value: N, onChange: (l) => Q(l.target.value), style: { ...I, height: 80 }, size: 4, children: [
            /* @__PURE__ */ r("option", { value: "", children: "— No linked test —" }),
            Object.entries(ne).map(([l, Z]) => /* @__PURE__ */ r("optgroup", { label: l, children: Z.map((V) => /* @__PURE__ */ r("option", { value: V.id, children: V.testTitle }, V.id)) }, l))
          ] }),
          K && /* @__PURE__ */ o("div", { style: { fontSize: 11, color: t.infoText, marginTop: 6 }, children: [
            "✓ ",
            K.fullTitle
          ] })
        ] }),
        /* @__PURE__ */ o("div", { style: { marginBottom: 10 }, children: [
          /* @__PURE__ */ r("label", { style: A, children: "Title *" }),
          /* @__PURE__ */ r("input", { value: u, onChange: (l) => m(l.target.value), placeholder: "Short bug title", style: I })
        ] }),
        /* @__PURE__ */ o("div", { style: { marginBottom: 10 }, children: [
          /* @__PURE__ */ r("label", { style: A, children: "Description *" }),
          /* @__PURE__ */ r("textarea", { value: C, onChange: (l) => D(l.target.value), rows: 3, placeholder: "What is the bug?", style: { ...I, resize: "vertical" } })
        ] }),
        /* @__PURE__ */ o("div", { style: { display: "flex", gap: 8, marginBottom: 10 }, children: [
          /* @__PURE__ */ o("div", { style: { flex: 1 }, children: [
            /* @__PURE__ */ r("label", { style: A, children: "Severity" }),
            /* @__PURE__ */ r("select", { value: k, onChange: (l) => L(l.target.value), style: I, children: ["critical", "high", "medium", "low", "info"].map((l) => /* @__PURE__ */ r("option", { value: l, children: l.charAt(0).toUpperCase() + l.slice(1) }, l)) })
          ] }),
          /* @__PURE__ */ o("div", { style: { flex: 1 }, children: [
            /* @__PURE__ */ r("label", { style: A, children: "Area / Module" }),
            /* @__PURE__ */ r("input", { value: g, onChange: (l) => x(l.target.value), placeholder: "e.g. auth, checkout", style: I })
          ] })
        ] }),
        /* @__PURE__ */ o("div", { style: { marginBottom: 10 }, children: [
          /* @__PURE__ */ r("label", { style: A, children: "Repro Steps" }),
          /* @__PURE__ */ r("textarea", { value: v, onChange: (l) => z(l.target.value), rows: 3, placeholder: "1. Go to...", style: { ...I, resize: "vertical" } })
        ] }),
        /* @__PURE__ */ o("div", { style: { display: "flex", gap: 8, marginBottom: 10 }, children: [
          /* @__PURE__ */ o("div", { style: { flex: 1 }, children: [
            /* @__PURE__ */ r("label", { style: A, children: "Expected" }),
            /* @__PURE__ */ r("input", { value: E, onChange: (l) => M(l.target.value), placeholder: "What should happen", style: I })
          ] }),
          /* @__PURE__ */ o("div", { style: { flex: 1 }, children: [
            /* @__PURE__ */ r("label", { style: A, children: "Actual" }),
            /* @__PURE__ */ r("input", { value: $, onChange: (l) => P(l.target.value), placeholder: "What actually happens", style: I })
          ] })
        ] })
      ] }),
      n === "feature" && /* @__PURE__ */ o(J, { children: [
        /* @__PURE__ */ o("div", { style: { marginBottom: 10 }, children: [
          /* @__PURE__ */ r("label", { style: A, children: "Feature Name *" }),
          /* @__PURE__ */ r("input", { value: u, onChange: (l) => m(l.target.value), placeholder: "e.g. Dark mode toggle", style: I })
        ] }),
        /* @__PURE__ */ o("div", { style: { marginBottom: 10 }, children: [
          /* @__PURE__ */ r("label", { style: A, children: "Description *" }),
          /* @__PURE__ */ r("textarea", { value: y, onChange: (l) => B(l.target.value), rows: 4, placeholder: "What should this feature do? Who is it for?", style: { ...I, resize: "vertical" } })
        ] }),
        /* @__PURE__ */ o("div", { style: { display: "flex", gap: 8, marginBottom: 10 }, children: [
          /* @__PURE__ */ o("div", { style: { flex: 1 }, children: [
            /* @__PURE__ */ r("label", { style: A, children: "Priority" }),
            /* @__PURE__ */ o("select", { value: _, onChange: (l) => S(l.target.value), style: I, children: [
              /* @__PURE__ */ r("option", { value: "critical", children: "🔴 Critical" }),
              /* @__PURE__ */ r("option", { value: "high", children: "🟠 High" }),
              /* @__PURE__ */ r("option", { value: "medium", children: "🟡 Medium" }),
              /* @__PURE__ */ r("option", { value: "low", children: "🟢 Low" }),
              /* @__PURE__ */ r("option", { value: "info", children: "⚪ Nice to have" })
            ] })
          ] }),
          /* @__PURE__ */ o("div", { style: { flex: 1 }, children: [
            /* @__PURE__ */ r("label", { style: A, children: "Area / Module" }),
            /* @__PURE__ */ r("input", { value: g, onChange: (l) => x(l.target.value), placeholder: "e.g. settings, dashboard", style: I })
          ] })
        ] }),
        /* @__PURE__ */ o("div", { style: { marginBottom: 10 }, children: [
          /* @__PURE__ */ r("label", { style: A, children: "Acceptance Criteria" }),
          /* @__PURE__ */ r("textarea", { value: te, onChange: (l) => a(l.target.value), rows: 4, placeholder: `- Given... When... Then...
- User can...
- System should...`, style: { ...I, resize: "vertical" } })
        ] })
      ] }),
      n === "note" && /* @__PURE__ */ o(J, { children: [
        /* @__PURE__ */ o("div", { style: { marginBottom: 10 }, children: [
          /* @__PURE__ */ r("label", { style: A, children: "Title *" }),
          /* @__PURE__ */ r("input", { value: u, onChange: (l) => m(l.target.value), placeholder: "e.g. Design feedback, Meeting notes", style: I })
        ] }),
        /* @__PURE__ */ o("div", { style: { marginBottom: 10 }, children: [
          /* @__PURE__ */ r("label", { style: A, children: "Content *" }),
          /* @__PURE__ */ r("textarea", { value: T, onChange: (l) => w(l.target.value), rows: 8, placeholder: "Write your note here...", style: { ...I, resize: "vertical" } })
        ] }),
        /* @__PURE__ */ o("div", { style: { marginBottom: 10 }, children: [
          /* @__PURE__ */ r("label", { style: A, children: "Tag / Area" }),
          /* @__PURE__ */ r("input", { value: g, onChange: (l) => x(l.target.value), placeholder: "e.g. design, backend, meeting", style: I })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ o("div", { style: { padding: "10px 14px", borderTop: `1px solid ${t.border}`, background: t.bgSubtle, display: "flex", gap: 8, justifyContent: "flex-end", flexShrink: 0 }, children: [
      /* @__PURE__ */ r("button", { onClick: e, style: { padding: "6px 14px", fontSize: 13, fontWeight: 600, background: t.btnIdle, color: t.btnIdleTxt, border: `1px solid ${t.border}`, borderRadius: 6, cursor: "pointer", fontFamily: "inherit" }, children: "Cancel" }),
      /* @__PURE__ */ r("button", { onClick: se, style: { padding: "6px 14px", fontSize: 13, fontWeight: 600, background: t.btnActive, color: t.btnActiveTxt, border: "none", borderRadius: 6, cursor: "pointer", fontFamily: "inherit" }, children: G })
    ] })
  ] });
}
function st({ message: e, sub: n }) {
  const { theme: i } = oe(), t = ie[i];
  return /* @__PURE__ */ o("div", { style: { padding: "2rem 1rem", textAlign: "center", color: t.textFaint, fontSize: 13 }, children: [
    /* @__PURE__ */ r("div", { style: { fontSize: 15, fontWeight: 600, color: t.textMuted, marginBottom: 4 }, children: e }),
    n && /* @__PURE__ */ r("div", { style: { fontSize: 12 }, children: n })
  ] });
}
function dt() {
  const { theme: e } = oe(), n = ie[e], { name: i } = de(), [t, s] = h(!1), [d, u] = h("manual"), m = U(null), {
    isDrawerOpen: g,
    closeDrawer: x,
    issues: b,
    filters: p,
    setFilters: C,
    switchTab: D,
    selectedIssueId: k,
    selectIssue: L,
    isCreating: v,
    openCreateForm: z,
    closeCreateForm: E,
    isLoading: M
  } = ce();
  H(() => {
    if (!t) return;
    function a(T) {
      m.current && !m.current.contains(T.target) && s(!1);
    }
    return document.addEventListener("mousedown", a), () => document.removeEventListener("mousedown", a);
  }, [t]);
  function $(a) {
    u(a), s(!1), z();
  }
  if (!g) return null;
  const P = /* @__PURE__ */ new Set(["open", "in_progress", "ready_for_qa"]), W = 10, q = p.page ?? 1, N = (a) => C({ page: a }), Q = p.origin ?? "manual", O = p.status ?? "open", R = p.search ? "all" : Q, F = O, f = b.filter((a) => {
    var T, w;
    if (p.search) {
      const Y = p.search.toLowerCase();
      return a.title.toLowerCase().includes(Y) || (((T = a.area) == null ? void 0 : T.toLowerCase().includes(Y)) ?? !1) || (((w = a.description) == null ? void 0 : w.toLowerCase().includes(Y)) ?? !1);
    }
    if (Q === "manual") {
      if (a.origin !== "manual" && a.origin !== "imported_markdown") return !1;
    } else if (a.origin !== Q)
      return !1;
    return !(O !== "all" && a.status !== O);
  }), y = k ? b.find((a) => a.id === k) ?? null : null, B = b.filter((a) => P.has(a.status)).length, _ = Math.ceil(f.length / W), S = Math.min(q, Math.max(1, _)), te = f.slice((S - 1) * W, S * W);
  return /* @__PURE__ */ o(J, { children: [
    /* @__PURE__ */ r("div", { onClick: x, style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 1002 } }),
    /* @__PURE__ */ o("div", { style: { position: "fixed", top: 0, right: 0, bottom: 0, width: "min(440px, 100vw)", background: n.bg, borderLeft: `1px solid ${n.border}`, zIndex: 1003, display: "flex", flexDirection: "column", boxShadow: "-4px 0 24px rgba(0,0,0,0.2)" }, children: [
      /* @__PURE__ */ o("div", { style: { padding: "14px 16px", borderBottom: `1px solid ${n.border}`, background: n.bgSubtle, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }, children: [
        /* @__PURE__ */ o("div", { children: [
          /* @__PURE__ */ r("div", { style: { fontWeight: 700, fontSize: 14, color: n.text }, children: i }),
          /* @__PURE__ */ r("div", { style: { fontSize: 11, color: n.textFaint, marginTop: 2 }, children: M ? "Loading..." : B > 0 ? `${B} active issue${B > 1 ? "s" : ""}` : "No active issues" })
        ] }),
        /* @__PURE__ */ o("div", { style: { display: "flex", gap: 8, alignItems: "center" }, children: [
          !v && !y && /* @__PURE__ */ r(J, { children: /* @__PURE__ */ o("div", { ref: m, style: { position: "relative" }, children: [
            /* @__PURE__ */ o(
              "button",
              {
                onClick: () => s((a) => !a),
                style: { padding: "5px 12px", fontSize: 12, fontWeight: 600, background: n.btnActive, color: n.btnActiveTxt, border: "none", borderRadius: 6, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4 },
                children: [
                  "+ Add ",
                  /* @__PURE__ */ r("span", { style: { fontSize: 10, opacity: 0.8 }, children: "▾" })
                ]
              }
            ),
            t && /* @__PURE__ */ r("div", { style: { position: "absolute", top: "calc(100% + 4px)", right: 0, background: n.bg, border: `1px solid ${n.border}`, borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.2)", zIndex: 1100, minWidth: 140, overflow: "hidden" }, children: [
              { type: "manual", label: "🐛 New Issue" },
              { type: "feature", label: "✨ Feature" },
              { type: "note", label: "📝 Note" }
            ].map(({ type: a, label: T }) => /* @__PURE__ */ r(
              "button",
              {
                onClick: () => $(a),
                style: { display: "block", width: "100%", textAlign: "left", padding: "9px 14px", fontSize: 12, fontWeight: 500, background: "none", border: "none", color: n.text, cursor: "pointer", fontFamily: "inherit" },
                onMouseEnter: (w) => w.currentTarget.style.background = n.bgMuted,
                onMouseLeave: (w) => w.currentTarget.style.background = "none",
                children: T
              },
              a
            )) })
          ] }) }),
          /* @__PURE__ */ r("button", { onClick: x, style: { background: "none", border: "none", cursor: "pointer", color: n.textMuted, fontSize: 18, lineHeight: 1, padding: "4px 6px" }, children: "✕" })
        ] })
      ] }),
      !v && !y && /* @__PURE__ */ o("div", { style: { borderBottom: `1px solid ${n.border}`, background: n.bgSubtle, flexShrink: 0 }, children: [
        /* @__PURE__ */ r("div", { style: { padding: "8px 12px 6px" }, children: /* @__PURE__ */ r(
          "input",
          {
            type: "text",
            placeholder: "Search issues, features, notes...",
            value: p.search ?? "",
            onChange: (a) => {
              C({ search: a.target.value || void 0, page: 1 });
            },
            style: { width: "100%", padding: "6px 10px", fontSize: 12, background: n.bg, color: n.text, border: `1px solid ${n.border}`, borderRadius: 6, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }
          }
        ) }),
        /* @__PURE__ */ r("div", { style: { display: "flex", padding: "0 12px", gap: 2 }, children: [
          { value: "manual", label: "🐛 Issues" },
          { value: "feature", label: "✨ Features" },
          { value: "note", label: "📝 Notes" }
        ].map(({ value: a, label: T }) => {
          const w = (p.origin ?? "manual") === a;
          return /* @__PURE__ */ r(
            "button",
            {
              onClick: () => {
                D(a);
              },
              style: { padding: "5px 12px", fontSize: 12, fontWeight: w ? 700 : 500, background: w ? n.bg : "transparent", color: w ? n.text : n.textMuted, border: w ? `1px solid ${n.border}` : "1px solid transparent", borderBottom: w ? `1px solid ${n.bg}` : "1px solid transparent", borderRadius: "6px 6px 0 0", cursor: "pointer", fontFamily: "inherit", marginBottom: -1, position: "relative", zIndex: w ? 1 : 0 },
              children: T
            },
            a
          );
        }) }),
        !p.search && /* @__PURE__ */ r("div", { style: { padding: "8px 12px", display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }, children: (() => {
          const a = p.origin ?? "manual";
          return (a === "feature" ? [{ v: "all", l: "All" }, { v: "open", l: "Open" }, { v: "in_progress", l: "In Progress" }, { v: "verified", l: "Done" }, { v: "closed", l: "Closed" }] : a === "note" ? [{ v: "all", l: "All" }, { v: "open", l: "Open" }, { v: "closed", l: "Archived" }] : [{ v: "all", l: "All" }, { v: "open", l: "Open" }, { v: "in_progress", l: "In Progress" }, { v: "ready_for_qa", l: "Ready for QA" }, { v: "verified", l: "Verified" }, { v: "closed", l: "Closed" }]).map(({ v: w, l: Y }) => {
            const j = (p.status ?? "open") === w;
            return /* @__PURE__ */ r(
              "button",
              {
                onClick: () => {
                  C({ status: w, page: 1 });
                },
                style: { padding: "3px 10px", fontSize: 11, fontWeight: j ? 700 : 500, borderRadius: 99, border: `1px solid ${j ? n.accent : n.border}`, background: j ? n.accent : "transparent", color: j ? n.accentText : n.textMuted, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" },
                children: Y
              },
              w
            );
          });
        })() })
      ] }),
      /* @__PURE__ */ o("div", { style: { flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }, children: [
        v && /* @__PURE__ */ r(at, { origin: d, onClose: E }),
        !v && y && /* @__PURE__ */ r(lt, { issue: y, onClose: () => L(null) }),
        !v && !y && (f.length === 0 ? /* @__PURE__ */ r(
          st,
          {
            message: p.search ? "No results found" : R === "feature" ? "No features found" : R === "note" ? "No notes found" : "No issues found",
            sub: (() => {
              if (p.search) return `No items match "${p.search}". Try a different search term.`;
              if (!b.some(
                (w) => R === "manual" ? w.origin === "manual" || w.origin === "imported_markdown" : w.origin === R
              ))
                return R === "feature" ? "Click '+ Add' → Feature to log your first feature." : R === "note" ? "Click '+ Add' → Note to capture your first note." : "Click '+ Add' → New Issue to log your first bug.";
              const T = F === "all" ? "" : F === "open" ? "open" : F === "in_progress" ? "in progress" : F === "ready_for_qa" ? "ready for QA" : F === "verified" ? R === "feature" ? "done" : "verified" : F === "closed" ? R === "note" ? "archived" : "closed" : F;
              return R === "feature" ? `No ${T ? T + " " : ""}features. Try a different filter.` : R === "note" ? `No ${T ? T + " " : ""}notes. Try a different filter.` : `No ${T ? T + " " : ""}issues. Try a different filter.`;
            })()
          }
        ) : /* @__PURE__ */ o("div", { style: { overflowY: "auto", flex: 1, display: "flex", flexDirection: "column" }, children: [
          /* @__PURE__ */ r("div", { style: { flex: 1 }, children: te.map((a, T) => /* @__PURE__ */ r(Ke, { issue: a, selected: k === a.id, onClick: () => L(a.id) }, `${a.id}-${T}`)) }),
          _ > 1 && /* @__PURE__ */ o("div", { style: { padding: "10px 14px", borderTop: `1px solid ${n.border}`, background: n.bgSubtle, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }, children: [
            /* @__PURE__ */ r(
              "button",
              {
                onClick: () => N(Math.max(1, S - 1)),
                disabled: S === 1,
                style: { padding: "4px 12px", fontSize: 12, fontWeight: 600, borderRadius: 6, border: `1px solid ${n.border}`, background: n.btnIdle, color: S === 1 ? n.textFaint : n.btnIdleTxt, cursor: S === 1 ? "not-allowed" : "pointer", fontFamily: "inherit" },
                children: "← Prev"
              }
            ),
            /* @__PURE__ */ o("span", { style: { fontSize: 12, color: n.textMuted }, children: [
              S,
              " / ",
              _,
              " ",
              /* @__PURE__ */ o("span", { style: { color: n.textFaint }, children: [
                "(",
                f.length,
                " total)"
              ] })
            ] }),
            /* @__PURE__ */ r(
              "button",
              {
                onClick: () => N(Math.min(_, S + 1)),
                disabled: S === _,
                style: { padding: "4px 12px", fontSize: 12, fontWeight: 600, borderRadius: 6, border: `1px solid ${n.border}`, background: n.btnIdle, color: S === _ ? n.textFaint : n.btnIdleTxt, cursor: S === _ ? "not-allowed" : "pointer", fontFamily: "inherit" },
                children: "Next →"
              }
            )
          ] })
        ] }))
      ] })
    ] })
  ] });
}
function ct(e, n) {
  return e || (n !== void 0 ? `http://localhost:${n}` : "http://localhost:3333");
}
function ut(e) {
  return typeof e == "string" ? { dark: e, light: e } : e;
}
function gt({
  buttonColor: e = { dark: "#7c3aed", light: "#7c3aed" },
  buttonSize: n = 52,
  shape: i = "circle",
  logo: t,
  name: s = "QA Center",
  apiBaseUrl: d,
  port: u,
  ownTheme: m = !0,
  neko: g = !1,
  nekoSpriteUrl: x
}) {
  const b = ct(d, u), p = ut(e), [C, D] = h(!1);
  if (H(() => {
    D(!0);
  }, []), !C) return null;
  const k = /* @__PURE__ */ o(
    Ce.Provider,
    {
      value: { baseUrl: b, buttonColor: p, buttonSize: n, shape: i, logo: t, name: s, neko: g, nekoSpriteUrl: x },
      children: [
        /* @__PURE__ */ r(Ye, {}),
        /* @__PURE__ */ r(dt, {})
      ]
    }
  );
  return m ? /* @__PURE__ */ r(ze, { children: k }) : k;
}
export {
  gt as QACenter
};
