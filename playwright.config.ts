import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  testMatch: [
    "playwright-automation/**/*.spec.ts",
    "playwright-automation/**/*.test.ts",
    "e2e/**/*.spec.ts",
    "e2e/**/*.test.ts",
    "tests/**/*.spec.ts",
    "tests/**/*.test.ts",
  ],
  timeout: 30000,
  use: {
    baseURL: "http://localhost:5173",
    headless: true,
  },
});
