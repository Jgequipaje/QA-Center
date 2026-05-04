# QA Center

A draggable floating QA issue tracker for your React app. Zero database — issues save to `qa-issues.json` in your project. Log bugs, features, and notes without leaving the browser.

> **Beta** — install directly from GitHub, no npm publish required.

---

## Install

```bash
npm install github:Jgequipaje/qa-center
```

Pin to a specific release:

```bash
npm install github:Jgequipaje/qa-center#v0.1.0-beta
```

Requires React 19 as a peer dependency.

---

## Setup

QA Center has two parts: a React component (UI) and an Express backend (persistence).

### 1. Add the component to your app

Drop `<QACenter />` anywhere in your React tree — it renders a floating button that doesn't affect your layout.

```tsx
import { QACenter } from "@purr/qa-center";

export default function App() {
  return (
    <>
      <YourApp />
      <QACenter port={3333} />
    </>
  );
}
```

### 2. Start the backend

In a separate terminal, run the Express server. It handles reads/writes to `qa-issues.json`.

```bash
npx qa-center --port 3333
```

That's it. Click the floating button in the corner to open the drawer.

---

## Props

| Prop            | Type                                | Default       | Description                                             |
| --------------- | ----------------------------------- | ------------- | ------------------------------------------------------- |
| `port`          | `number`                            | `3333`        | Port the Express backend is running on                  |
| `apiBaseUrl`    | `string`                            | —             | Full base URL if not using localhost (overrides `port`) |
| `name`          | `string`                            | `"QA Center"` | Label shown in the drawer header                        |
| `buttonColor`   | `string \| { dark, light }`         | `"#7c3aed"`   | Floating button color, supports per-theme values        |
| `buttonSize`    | `number`                            | `52`          | Button diameter in px                                   |
| `shape`         | `"circle" \| "rounded" \| "square"` | `"circle"`    | Button shape                                            |
| `logo`          | `ReactNode`                         | —             | Custom icon inside the button                           |
| `ownTheme`      | `boolean`                           | `true`        | Set to `false` if your app already has a ThemeProvider  |
| `neko`          | `boolean`                           | `false`       | Show an animated cat on the button                      |
| `nekoSpriteUrl` | `string`                            | —             | Custom sprite URL for the neko cat                      |

---

## CLI Options

```bash
npx qa-center                           # default port 3333
npx qa-center --port 4000               # custom port
npx qa-center --no-open                 # skip auto-opening browser
npx qa-center --data-dir ./qa-data      # store qa-issues.json outside Vite's watch scope
```

Issues are saved to `qa-issues.json` in the directory where you run the command (or `--data-dir` if specified). The file is git-friendly — commit it to share issue state with your team, or add it to `.gitignore` to keep it local.

> **React Router v7 / Vite HMR tip:** If updating an issue status causes a full page reload, it's because Vite is watching `qa-issues.json`. Fix it by storing the data file outside your project:
>
> ```bash
> npx qa-center --data-dir ../qa-data
> ```

> **After upgrading QA Center:** always run `npm run build` before restarting the server. The Express backend serves the compiled `dist/` bundle — skipping the build means the old bundle still calls previous API routes, causing 404 errors. If you're using the Vite dev server (`npm run dev`), just restart Vite — it reads from source directly and no build step is needed.

---

## Features

- Log bugs, features, and notes from a slide-out drawer
- Status workflow: `open → in_progress → ready_for_qa → verified → closed`
- Search and filter by status, severity, and type

- Link and run Playwright tests from the issue detail panel
- Dark / light theme toggle
- Draggable button that snaps to left or right edge

---

## API Reference

All endpoints are served by the Express backend on `http://localhost:<port>`.

### Issues

| Method   | Route                        | Description                           |
| -------- | ---------------------------- | ------------------------------------- |
| `GET`    | `/api/qa-items`              | Return all items, sorted newest first |
| `GET`    | `/api/qa-items/:id`          | Return a single item by ID            |
| `POST`   | `/api/qa-items`              | Create a new item                     |
| `PATCH`  | `/api/qa-items/:id`          | Update item fields or status          |
| `DELETE` | `/api/qa-items/:id`          | Delete an item                        |
| `POST`   | `/api/qa-items/:id/run-test` | Run the linked Playwright test        |

### Tests

| Method | Route           | Description                        |
| ------ | --------------- | ---------------------------------- |
| `GET`  | `/api/qa-tests` | Return cached Playwright test list |
| `POST` | `/api/qa-tests` | Force rescan of test directories   |

### Status

| Method | Route         | Description                                   |
| ------ | ------------- | --------------------------------------------- |
| `GET`  | `/api/status` | Server health, issue summary, test cache info |

#### POST /api/qa-items — body

```json
{
  "title": "Bug title",
  "origin": "issue",
  "status": "open",
  "severity": "high",
  "area": "Auth",
  "description": "What is the bug?",
  "reproSteps": "1. Go to...",
  "expected": "Should work",
  "actual": "Doesn't work",
  "notes": "Additional notes"
}
```

#### PATCH /api/qa-items/:id — body

```json
{
  "status": "in_progress",
  "notes": "Updated notes"
}
```

Valid `status` values: `open` `in_progress` `ready_for_qa` `verified` `closed`

Valid `severity` values: `critical` `high` `medium` `low` `info`

Valid `origin` values: `issue` `feature` `note` `imported_markdown`

```bash
git clone https://github.com/Jgequipaje/qa-center
cd qa-center
npm install

# Terminal 1 — React UI with hot reload
npm run dev

# Terminal 2 — Express API + JSON persistence
npm run server
```

The Vite dev server proxies `/api` to `localhost:3333` automatically.

```bash
# Production build
npm run build
node bin/cli.js
```

---

## License

MIT © [Jgequipaje](https://github.com/Jgequipaje)
