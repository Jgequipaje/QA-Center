#!/usr/bin/env node
// QA Center CLI entry point
// Usage: npx @purr/qa-center [--port 3333] [--no-open] [--data-dir <path>]

import { createServer } from "../server/index.js";
import path from "path";

const args = process.argv.slice(2);
const portArg = args.indexOf("--port");
const rawPort = portArg !== -1 ? parseInt(args[portArg + 1], 10) : 3333;
const noOpen = args.includes("--no-open");
const dataDirArg = args.indexOf("--data-dir");
// --data-dir lets consumers store qa-issues.json outside their Vite watch scope
// e.g. npx qa-center --data-dir ~/.qa-data  (prevents Vite HMR reload on save)
const dataDir = dataDirArg !== -1
  ? path.resolve(args[dataDirArg + 1])
  : process.cwd();

// Validate port range
if (isNaN(rawPort) || rawPort < 1024 || rawPort > 65535) {
  console.error("  Error: --port must be a number between 1024 and 65535");
  process.exit(1);
}

const port = rawPort;
const app = createServer({ cwd: dataDir });

app.listen(port, async () => {
  const url = `http://localhost:${port}`;
  console.log(`\n  QA Center running at ${url}`);
  console.log(`  Issues saved to: ${dataDir}/qa-issues.json\n`);

  if (!noOpen) {
    const { default: open } = await import("open");
    open(url);
  }
});

app.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`\n  Error: Port ${port} is already in use. Try --port ${port + 1}\n`);
  } else {
    console.error(`\n  Server error: ${err.message}\n`);
  }
  process.exit(1);
});
