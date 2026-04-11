import { test, expect } from "@playwright/test";

test.describe("Dashboard", () => {
  test("should load dashboard page", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByRole("heading", { name: /dashboard/i })).toBeVisible();
  });

  test("should display stats cards", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.locator(".card")).toHaveCount(3);
  });

  test("should display orders table", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByRole("table")).toBeVisible();
    await expect(page.getByRole("row")).toHaveCount(6); // header + 5 rows
  });
});
