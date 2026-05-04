# GitHub Actions — Workflow Guide

A practical reference for writing your own workflows, based on real examples from this project.

---

## How It Works

GitHub Actions runs automated tasks (jobs) when something happens in your repo (an event).

```
Event → Workflow → Jobs → Steps
```

- **Event** — what triggers the workflow (push, pull request, manual, schedule)
- **Workflow** — a `.yml` file inside `.github/workflows/`
- **Job** — a group of steps that run on a machine (runner)
- **Step** — a single command or action

---

## Anatomy of a Workflow File

```yaml
name: My Workflow # Display name in GitHub Actions UI

on: # Trigger(s)
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  my-job: # Job ID (used in needs:, branch protection)
    name: My Job # Display name (optional, nicer in UI)
    runs-on: ubuntu-latest # Runner OS

    steps:
      - name: Checkout code
        uses: actions/checkout@v4 # Clone the repo

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: lts/*
          cache: npm # Cache node_modules for speed

      - name: Install dependencies
        run: npm ci

      - name: Run something
        run: npm run build
```

---

## Triggers (`on:`)

```yaml
on:
  push: # On every push
    branches: [main, development]

  pull_request: # On PR open/update
    branches: [main]

  workflow_dispatch: # Manual trigger from GitHub UI

  schedule:
    - cron: "0 9 * * 1" # Every Monday at 9am UTC
```

---

## Runners (`runs-on:`)

| Value            | OS                           |
| ---------------- | ---------------------------- |
| `ubuntu-latest`  | Linux (most common, fastest) |
| `windows-latest` | Windows                      |
| `macos-latest`   | macOS                        |

---

## Common Actions (`uses:`)

These are pre-built steps from the GitHub marketplace:

```yaml
# Checkout your repo
- uses: actions/checkout@v4

# Setup Node.js
- uses: actions/setup-node@v4
  with:
    node-version: lts/*
    cache: npm

# Upload files as artifacts (e.g. test reports)
- uses: actions/upload-artifact@v4
  with:
    name: my-report
    path: report/
    retention-days: 30

# Download a previously uploaded artifact
- uses: actions/download-artifact@v4
  with:
    name: my-report
```

---

## Job Dependencies (`needs:`)

By default jobs run in parallel. Use `needs:` to run them in sequence:

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps: [...]

  build:
    needs: lint # Only runs if lint passes
    runs-on: ubuntu-latest
    steps: [...]

  deploy:
    needs: [lint, build] # Waits for both
    runs-on: ubuntu-latest
    steps: [...]
```

---

## Environment Variables

```yaml
jobs:
  my-job:
    runs-on: ubuntu-latest
    env:
      NODE_ENV: production # Job-level env var

    steps:
      - name: Run with env
        run: echo $NODE_ENV
        env:
          MY_SECRET: ${{ secrets.MY_SECRET }} # From GitHub Secrets
```

---

## Secrets

Store sensitive values in **GitHub → Settings → Secrets and variables → Actions**.

```yaml
- name: Deploy
  run: npm run deploy
  env:
    API_KEY: ${{ secrets.API_KEY }}
```

Never hardcode secrets in workflow files.

---

## Conditional Steps (`if:`)

```yaml
- name: Upload report
  if: always() # Run even if previous steps failed

- name: Deploy
  if: github.ref == 'refs/heads/main' # Only on main branch

- name: Notify
  if: failure() # Only if something failed
```

---

## Running Background Processes

For servers that need to stay running during tests:

```yaml
- name: Start dev server
  run: npm run dev & # & runs it in background

- name: Wait for server to be ready
  run: npx wait-on http://localhost:5173 --timeout 30000
```

---

## Artifacts

Save files from a workflow run (test reports, build output, logs):

```yaml
- uses: actions/upload-artifact@v4
  if: always() # Upload even on failure
  with:
    name: playwright-report
    path: playwright-report/
    retention-days: 30
```

Download them from the GitHub Actions run page.

---

## Starter Templates

### Minimal CI (lint + build)

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: lts/*
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run build
```

---

### Playwright E2E

```yaml
name: Playwright Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  playwright:
    runs-on: ubuntu-latest
    timeout-minutes: 60
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: lts/*
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps
      - name: Start app
        run: npm run dev &
      - name: Wait for app
        run: npx wait-on http://localhost:5173 --timeout 30000
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

---

### Scheduled Job (runs every day at midnight)

```yaml
name: Nightly Check

on:
  schedule:
    - cron: "0 0 * * *"

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: lts/*
          cache: npm
      - run: npm ci
      - run: npm test
```

---

## Tips

- **Job ID vs name** — the job key (e.g. `my-job:`) is what GitHub uses for branch protection checks, not the `name:` field
- **`npm ci` vs `npm install`** — always use `npm ci` in CI, it's faster and uses the lockfile exactly
- **`cache: npm`** — add this to `setup-node` to cache `node_modules` between runs, speeds up workflows significantly
- **`if: always()`** — use on artifact uploads so you get reports even when tests fail
- **`timeout-minutes:`** — always set this on long-running jobs to prevent stuck workflows eating your free minutes
- **Secrets never appear in logs** — GitHub automatically masks them
- **Free plan limits** — 2,000 minutes/month for private repos, unlimited for public repos
