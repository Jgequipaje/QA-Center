#!/usr/bin/env node
// QA Center CLI entry point
// Usage: npx @purr/qa-center [--port 3333] [--no-open]

import { createServer } from "../server/index.js";

const args = process.argv.slice(2);
const portArg = args.indexOf("--port");
const port = portArg !== -1 ? parseInt(args[portArg + 1], 10) : 3333;
const noOpen = args.includes("--no-open");

const app = createServer({ cwd: process.cwd() });

app.listen(port, async () => {
  const url = `http://localhost:${port}`;
  console.log(`\n  QA Center running at ${url}`);
  console.log(`  Issues saved to: ${process.cwd()}/qa-issues.json\n`);

  if (!noOpen) {
    const { default: open } = await import("open");
    open(url);
  }
});
