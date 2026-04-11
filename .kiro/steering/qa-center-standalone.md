---
inclusion: always
---

# QA Center — Standalone Local Tool Spec

A self-contained, zero-database QA issue tracker that runs as a local dev tool.
Clone it, install deps, run it — a floating panel appears in your browser for
tracking QA issues, persisted to a local JSON file.

---

## Vision

```bash
git clone <repo>
cd qa-center
npm install
npm run build
node bin/cli.js
```

Opens a local server + browser tab. A draggable floating button sits in the corner.
Click it — a slide-out drawer appears. Log issues, track status, import from Markdown,
link Playwright tests. Everything saves to `qa-issues.json` in the project directory.
Works on any machine, any browser, shareable via git.

---

## Tech Stack

| Layer       | Choice              | Why                                              |
|-------------|---------------------|--------------------------------------------------|
| UI          | React 19 + Vite     | Fast builds, no Next.js overhead                 |
| State       | Zustand v5          | Already in use, lightweight                      |
| Styling     | styled-components v6 (or inline styles) | Already in use          |
| Server      | Express (Node.js)   | Minimal, handles JSON file read/write            |
| Persistence | JSON file on disk   | Zero setup, git-friendly, cross-machine          |
| CLI entry   | Node.js bin script  | `node bin/cli.js`, opens browser automatically  |
| Testing     | Vitest              | Already in use                                   |

No database. No cloud. No auth. Just a file.

---

## Package Structure

```
qa-center/
  bin/
    cli.js                  ← npx entry point — starts Express + opens browser
  server/
    index.js                ← Express app setup
    routes/
      issues.js             ← CRUD for /api/qa-issues (ported from Next.js handlers)
      tests.js              ← /api/qa-tests — Playwright test registry scanner
      runTest.js            ← /api/qa-issues/:id/run-test — Playwright runner
  src/
    main.tsx                ← React entry, mounts QAFloatingButton + QADrawer
    features/
      qa-center/
        components/         ← All existing components (ported 1:1)
        store/              ← useQACenterStore (Zustand)
        services/           ← issueApiService, markdownIssueParser, issueImportService
        types/              ← Issue, IssueStatus, etc.
        utils/              ← formatters
  dist/                     ← Vite build output (committed or built on install)
  qa-issues.json            ← Created on first run in the consumer's project dir
  package.json
  vite.config.ts
  tsconfig.json
  README.md
```

---

## Features

### Core Issue Tracking

- **Create issues manually** — title, description, severity (critical / high / medium / low / info),
  area/module, repro steps, expected vs actual, notes
- **Issue status workflow** — `open → in_progress → ready_for_qa → verified → closed`
  with valid transition rules enforced in the UI
- **Re-open closed issues** — `closed → open` always available
- **Delete issues** — with optimistic UI rollback on failure
- **Issue list** — sorted newest first, scrollable

### Filtering & Search

- Search by title or area (live filter)
- Filter by status
- Filter by severity
- Clear all filters in one click

### Markdown Import

- Upload any `.md` file with `## HEADING` sections
- Parser extracts `Title:` and `Status:` fields; everything else preserved as `rawContent`
- Preview imported issues before committing — select/deselect individually or all at once
- Warnings shown for missing fields (non-blocking)
- Imported issues tracked with `origin: "imported_markdown"` badge

### Playwright Test Linking

- Scan the local `playwright-automation/` directory for test files
- Link a Playwright test to any manual issue at creation time
- Run the linked test directly from the issue detail panel (`▶ Run Test`)
- Automation result badge: `not run / passed / failed` with timestamp
- **Verification gating** — an issue cannot be marked `verified` unless its linked
  test exists and has passed

### Floating UI

- Draggable floating button — snaps to left or right edge on release
- Position persisted to `localStorage` (per browser, just for UI preference)
- Badge on button shows count of `open` + `in_progress` issues
- Slide-out drawer panel (440px wide) from the right edge
- Backdrop click closes the drawer
- `✕` / `QA` toggle on the button

### Persistence

- All issues stored in `qa-issues.json` in the directory where the CLI is run
- File is created automatically on first issue
- Human-readable, git-committable — teams can share issue state via version control
- Optimistic UI updates — changes reflect instantly, server confirms in background,
  rolls back on failure

### History Tab *(stub — ready for implementation)*

- Tracks status change events per issue (field, from, to, timestamp, actor)
- Sorted newest first
- Shown in a dedicated tab in the drawer

### Theme

- Dark / light toggle
- Design tokens system (`tokens.dark` / `tokens.light`)
- FOUC prevention via `data-theme` attribute set before paint
- Default: dark

---

## CLI Behaviour

```bash
node bin/cli.js                  # start on default port 3333
node bin/cli.js --port 4000
node bin/cli.js --no-open        # don't auto-open browser
```

- Starts Express server
- Serves the built React UI as static files
- Opens `http://localhost:3333` in the default browser automatically
- Writes `qa-issues.json` to `process.cwd()` (the project root where npx is run)
- Logs the port and file path on startup

---

## API Routes (Express)

| Method | Route                          | Description                        |
|--------|--------------------------------|------------------------------------|
| GET    | `/api/qa-issues`               | Return all issues, newest first    |
| POST   | `/api/qa-issues`               | Create a new issue                 |
| PATCH  | `/api/qa-issues/:id`           | Update issue fields / status       |
| DELETE | `/api/qa-issues/:id`           | Delete an issue                    |
| GET    | `/api/qa-tests`                | Return cached Playwright test list |
| POST   | `/api/qa-tests`                | Re-scan and refresh test list      |
| POST   | `/api/qa-issues/:id/run-test`  | Run the linked Playwright test     |

---

## What Changes from the PurrScope Version

| Thing                        | PurrScope (current)              | Standalone package               |
|------------------------------|----------------------------------|----------------------------------|
| API routes                   | Next.js route handlers           | Express routes (same logic)      |
| `issueApiService.ts` BASE    | `/api/qa-issues`                 | `http://localhost:PORT/api/...`  |
| SSR registry                 | `lib/registry.tsx` (required)    | Removed (not needed)             |
| Theme bootstrap              | Blocking script in `layout.tsx`  | Inline script in `index.html`    |
| Entry point                  | `app/layout.tsx`                 | `src/main.tsx` (Vite)            |
| Data file location           | `data/issues.json` (repo-fixed)  | `process.cwd()/qa-issues.json`   |
| Import button                | Hidden (commented out)           | Re-enabled                       |

---

## Local Development Workflow

```bash
# Terminal 1 — Vite dev server (hot reload for UI changes)
npm run dev

# Terminal 2 — Express server (API + JSON persistence)
npm run server

# Production build + run
npm run build
node bin/cli.js
```

---

## Out of Scope (v1)

- Multi-user / real-time sync
- Cloud storage or database
- Authentication
- Email / Slack notifications
- Issue comments / threads
- File attachments
- Custom fields
- Export to CSV / PDF
