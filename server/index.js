import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { issuesRouter } from "./routes/issues.js";
import { testsRouter } from "./routes/tests.js";
import { runTestRouter } from "./routes/runTest.js";
import { statusRouter } from "./routes/status.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, "../dist");

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
  app.use("/api/qa-items", issuesRouter);
  app.use("/api/qa-tests", testsRouter);
  app.use("/api/qa-items", runTestRouter);
  app.use("/api/status", statusRouter);

  // Serve static assets that are genuinely needed (e.g. oneko.gif)
  // but do NOT serve the React UI — port 3333 is API-only.
  // The React UI runs on the Vite dev server (port 5173) or is embedded
  // in the consumer's own app.
  app.use("/public", express.static(DIST));

  // Serve docs at root — visiting localhost:3333 shows the QA Center documentation
  const DOCS = path.join(__dirname, "../docs");
  app.get("/", (_req, res) => {
    res.sendFile(path.join(DOCS, "index.html"));
  });
  app.use("/docs", express.static(DOCS));

  // Catch-all: return a clean JSON response instead of the React app
  app.use((_req, res) => {
    res.status(404).json({
      error: "Not found.",
      hint: "This is the QA Center API server. Available routes: /api/qa-items, /api/qa-tests, /api/status",
    });
  });

  return app;
}
