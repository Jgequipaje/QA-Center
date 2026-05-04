import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:3333";

test.describe("@API Tests API", () => {
  // GET /api/qa-tests
  test("GET returns cached tests as an array", async ({ request }) => {});

  // POST /api/qa-tests
  test("POST rescans and returns count and tests array", async ({ request }) => {});

  test("POST rescan returns updated test list after spec changes", async ({ request }) => {});
});
