import { test, expect } from "@playwright/test";

test.describe("QA Center Widget", () => {
  test("should show floating button on page load", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("button[title='QA Center']")).toBeVisible();
  });

  test("should open drawer when floating button is clicked", async ({ page }) => {
    await page.goto("/");
    await page.locator("button[title='QA Center']").click();
    await expect(page.getByText(/QA Center/i).first()).toBeVisible();
  });

  test("should close drawer when backdrop is clicked", async ({ page }) => {
    await page.goto("/");
    await page.locator("button[title='QA Center']").click();
    // Click the backdrop (fixed overlay behind the drawer)
    await page.mouse.click(100, 300);
    await expect(page.locator("button[title='QA Center']")).toBeVisible();
  });
});
