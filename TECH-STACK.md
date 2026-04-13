# QA Center — Tech Stack

A breakdown of every technology used to build the QA Center package itself.

---

## UI Layer

| Technology | Version | Purpose |
|---|---|---|
| **React** | 19 | Component rendering, hooks, context API |
| **TypeScript** | 5 | Type safety across all components, services, and store |
| **Vite** | 6 | Dev server with HMR, production bundler, library mode |
| **Inline styles** | — | All styling — zero CSS files, fully isolated from consumer apps |

---

## State Management

| Technology | Version | Purpose |
|---|---|---|
| **Zustand** | 5 | Global store — issues, filters, drawer state, pagination, loading |

---

## Server

| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | 20+ | Runtime for CLI entry point and Express server |
| **Express** | 4 | REST API — CRUD for issues, test scanning, test runner |
| **CORS** | — | Cross-origin support for dev mode (Vite on :5173, API on :3333) |
| **JSON file** | — | Persistence layer — `qa-issues.json` written to `process.cwd()` |

---

## CLI

| Technology | Purpose |
|---|---|
| **Node.js bin script** (`bin/cli.js`) | Starts Express server, opens browser automatically |
| **`open`** | Cross-platform browser launcher |
| **CLI flags** | `--port`, `--no-open` for configuration |

---

## Testing

| Technology | Purpose |
|---|---|
| **Playwright** | E2E tests — UI interactions, CRUD flows, API validation |
| **Playwright Test Runner** | Test discovery, execution, `--grep` filtering, JSON/line reporters |

---

## Animation

| Technology | Purpose |
|---|---|
| **oneko.gif** | Pixel art sprite sheet — 32×32px frames, 8×4 grid |
| **CSS `background-position`** | Frame animation via sprite offset cycling |
| **`requestAnimationFrame`** | Smooth 100ms tick loop for neko animation |

---

## Build & Distribution

| Technology | Purpose |
|---|---|
| **`tsc -b`** | TypeScript compilation and `.d.ts` declaration generation |
| **Vite library mode** | Builds `src/index.ts` as ESM — `dist/index.js` + `dist/index.d.ts` |
| **`npm pack`** | Creates `.tgz` tarball for distribution without npm registry |
| **GitHub Releases** | Hosts `.tgz` for direct install — no npm publish required |

---

## Package Design

| Decision | Detail |
|---|---|
| **Single entry point** | `src/index.ts` — exports only `QACenter`, `QACenterProps`, `QACenterButtonColor`, `QACenterShape` |
| **Peer dependencies** | React 19 provided by consumer — not bundled |
| **ESM only** | `"type": "module"` throughout — no CommonJS |
| **No global side effects** | Nothing touches `window` or `document` at import time |
| **CSS isolation** | Inline styles only — no stylesheets injected into consumer's document |
| **Namespace-safe exports** | All exported types prefixed with `QACenter` to avoid name collisions |

---

## What's NOT included

- No database
- No cloud services
- No authentication
- No external CSS frameworks (no Tailwind, no Bootstrap)
- No bundled React (peer dependency)
