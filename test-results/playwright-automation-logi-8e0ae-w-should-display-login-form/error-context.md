# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: playwright-automation\login.spec.ts >> Login Flow >> should display login form
- Location: playwright-automation\login.spec.ts:4:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /login/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: /login/i })

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - generic [ref=e4]: 🐾
    - heading "QA Center" [level=1] [ref=e5]
    - paragraph [ref=e6]:
      - text: Click the
      - strong [ref=e7]: QA
      - text: button in the corner to open your issue tracker.
    - button "☀ Light mode" [ref=e8] [cursor=pointer]
  - button "🔍 4" [ref=e9]:
    - generic [ref=e10]: 🔍
    - generic: "4"
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Login Flow", () => {
  4  |   test("should display login form", async ({ page }) => {
  5  |     await page.goto("/");
> 6  |     await expect(page.getByRole("heading", { name: /login/i })).toBeVisible();
     |                                                                 ^ Error: expect(locator).toBeVisible() failed
  7  |   });
  8  | 
  9  |   test("should show error on invalid credentials", async ({ page }) => {
  10 |     await page.goto("/login");
  11 |     await page.getByLabel("Email").fill("wrong@example.com");
  12 |     await page.getByLabel("Password").fill("wrongpassword");
  13 |     await page.getByRole("button", { name: /sign in/i }).click();
  14 |     await expect(page.getByText(/invalid credentials/i)).toBeVisible();
  15 |   });
  16 | 
  17 |   test("should redirect to dashboard on success", async ({ page }) => {
  18 |     await page.goto("/login");
  19 |     await page.getByLabel("Email").fill("user@example.com");
  20 |     await page.getByLabel("Password").fill("correctpassword");
  21 |     await page.getByRole("button", { name: /sign in/i }).click();
  22 |     await expect(page).toHaveURL(/dashboard/);
  23 |   });
  24 | });
  25 | 
```