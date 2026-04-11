# QA Center

A local QA issue tracker that sits in the corner of your browser. Zero database — issues are saved to `qa-issues.json` in your project directory.

## Usage

```bash
npx @purr/qa-center
```

Opens at `http://localhost:3333`. Issues are saved to `qa-issues.json` wherever you run the command.

## Options

```bash
npx @purr/qa-center --port 4000     # custom port
npx @purr/qa-center --no-open       # don't auto-open browser
```

## Local Development

```bash
npm install

# Terminal 1 — React UI with hot reload
npm run dev

# Terminal 2 — Express API server
npm run server
```

The Vite dev server proxies `/api` requests to `localhost:3333`.

## Build

```bash
npm run build   # outputs to dist/
```
