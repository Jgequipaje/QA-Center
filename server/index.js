import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { issuesRouter } from "./routes/issues.js";
import { testsRouter } from "./routes/tests.js";
import { runTestRouter } from "./routes/runTest.js";
import { statusRouter } from "./routes/status.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, "../dist");
const distExists = fs.existsSync(path.join(DIST, "index.html"));

/**
 * @param {{ cwd: string }} options
 * @returns {import("express").Express}
 */
export function createServer({ cwd }) {
  const app = express();

  // Localhost-only CORS — this is a local dev tool, only allow local origins
  app.use(
    cors({
      origin: (origin, cb) => {
        // Allow requests with no origin (curl, Postman) and localhost origins
        if (!origin || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
          return cb(null, true);
        }
        cb(new Error("CORS: only localhost origins allowed"));
      },
    })
  );

  // Limit JSON payload size to prevent memory exhaustion
  app.use(express.json({ limit: "1mb" }));

  // Inject cwd into every request so routes know where to read/write files
  app.use((req, _res, next) => {
    req.appCwd = cwd;
    next();
  });

  // API routes
  app.use("/api/qa-issues", issuesRouter);
  app.use("/api/qa-tests", testsRouter);
  app.use("/api/qa-issues", runTestRouter);
  app.use("/api/status", statusRouter);

  // Always serve static assets from dist/ (includes oneko.gif, etc.)
  app.use(express.static(DIST));

  // Serve built React UI (only if dist/ exists)
  if (distExists) {
    app.get("*", (_req, res) => {
      res.sendFile(path.join(DIST, "index.html"));
    });
  } else {
    app.get("*", (_req, res) => {
      res
        .status(503)
        .send(
          `<pre style="font-family:monospace;padding:2rem">` +
            `QA Center API is running.\n\n` +
            `UI not built yet. Run:\n\n  npm run build\n\nThen restart the server.\n\n` +
            `Or use the Vite dev server:\n  npm run dev  (in a separate terminal)</pre>`
        );
    });
  }

  return app;
}
