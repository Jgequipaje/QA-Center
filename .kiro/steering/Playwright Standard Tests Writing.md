# Playwright Testing Standards & Best Practices

A practical reference for writing consistent, maintainable, and scalable Playwright tests for both UI and API automation. These standards define what good looks like in a real-world QA automation project.

---

## Part I — UI Test Standards

### 1. Core Principles

**1.1 Every test must be independent**

Each test should be runnable by itself. A UI test must never depend on another test creating data first, test execution order, or shared browser state from previous tests.

```typescript
// ❌ Bad — test depends on previous test
test("create issue", async () => {
  /* creates issue */
});
test("verify issue exists", async () => {
  /* depends on previous test */
});

// ✅ Good — self-contained
test("should create issue and show it in the list", async () => {
  // create issue
  // verify issue in same test
});
```

**1.2 One test should verify one behavior**

Each test should focus on one clear expected behavior. Avoid combining too many actions in one test unless they represent one business flow.

- `should create a new issue with valid data`
- `should show title validation error when title is empty`
- `should delete an existing issue`

**1.3 Tests should read like user behavior**

```typescript
await qaDrawer.goToQADrawer();
await newFormPage.addIssue(issue);
await expect(qaDrawer.getIssueCardByTitle(issue.title)).toBeVisible();
```

**1.4 Prefer clarity over cleverness**

Avoid overly abstract or tricky test code. Senior-level tests are clean and obvious.

---

### 2. UI Test File Structure

```
tests/
  ui/
    issues/
      create-issue.spec.ts
      edit-issue.spec.ts
      delete-issue.spec.ts

pageobjects/
  POManager.ts
  QADrawerPage.ts
  NewFormPage.ts

utils/
  testdata/
    issuesTestData.ts
```

- Group tests by feature
- Keep page objects separate from tests
- Keep test data separate from test logic
- Keep helpers and utilities reusable

---

### 3. Naming Standards

Use names that describe expected behavior.

> **Recommended style:** `Should [expected behavior] when [condition]`

```
✅ Good names:
Should create an issue when valid data is submitted
Should show a validation error when title is missing
Should keep the drawer open when submission fails

❌ Avoid:
test issue
validation test
add issue 1
```

---

### 4. Page Object Model Standards

**4.1 Use POM for actions and locators, not assertions**

Page objects should contain locators and page actions, and return locators when needed. They should NOT contain test assertions or hide verification logic behind booleans.

```typescript
// ❌ Bad — assertion hidden in POM
async checkIssueExists(title: string): Promise<boolean> {
  return await this.page.getByText(title).isVisible();
}

// ✅ Better — return locator, assert in test
getIssueCardByTitle(title: string) {
  return this.page.getByText(title, { exact: true });
}

// In test:
await expect(qaDrawer.getIssueCardByTitle(title)).toBeVisible();
```

**4.2 Page methods should represent real user actions**

```typescript
// ✅ Good method names
goToQADrawer();
addIssue(issue);
clickSave();
fillTitle(title);

// ❌ Avoid unclear names
doThing();
checkStuff();
handleAction();
```

**4.3 Keep page objects focused**

Each page object should represent one page, component, modal, or major section.

---

### 5. Locator Standards

**5.1 Prefer stable locators**

```typescript
// ✅ Stable — preferred
page.getByTestId("issue-card");
page.getByRole("button", { name: "Save" });
page.getByLabel("Title");

// ❌ Brittle — avoid
page.locator("div > div:nth-child(3) > span");
```

**5.2 Locator priority order**

1. `getByTestId`
2. `getByRole`
3. `getByLabel`
4. `getByText`
5. CSS selectors — only when needed

---

### 6. Assertion Standards

**6.1 Prefer Playwright locator assertions**

```typescript
// ✅ Good — auto-retrying
await expect(locator).toBeVisible();
await expect(locator).toHaveText("Saved");
await expect(locator).toBeHidden();

// ❌ Less ideal — manual boolean
const visible = await locator.isVisible();
expect(visible).toBeTruthy();
```

**6.2 Let Playwright auto-wait**

```typescript
// ❌ Bad — hard wait
await page.waitForTimeout(2000);

// ✅ Better — wait for state
await expect(successToast).toBeVisible();
```

**6.3 Use expect.poll() for delayed state changes**

```typescript
await expect
  .poll(async () => {
    return await qaDrawer.getIssueCount();
  })
  .toBe(3);
```

---

### 7. Test Data Standards

**7.1 Keep test data separate**

```typescript
export const issues = [
  {
    id: "TC-01",
    title: "Sample bug",
    description: "Bug details here",
  },
];
```

**7.2 Use unique data when data persists**

```typescript
const uniqueTitle = `Bug-${Date.now()}`;
```

**7.3 Separate valid and invalid data**

Keep positive and negative test data in separate groups when possible.

---

### 8. Hooks Standards

**8.1 Use beforeEach for repeated setup**

```typescript
test.beforeEach(async ({ page }) => {
  poManager = new POManager(page);
  qaDrawer = poManager.getQADrawerPage();
  newFormPage = poManager.getNewFormPage();
  await qaDrawer.goToQADrawer();
});
```

**8.2 Do not overuse beforeAll**

> ⚠️ Avoid using `beforeAll` for UI page state — UI tests should remain isolated.

---

### 9. Common Anti-Patterns in UI Tests

| Anti-Pattern          | Description                                                    |
| --------------------- | -------------------------------------------------------------- |
| 🔗 Test dependencies  | Never create a test that depends on another test running first |
| ⏱️ Hard waits         | Avoid `waitForTimeout()` — use locator assertions instead      |
| 🙈 Hidden assertions  | Don't hide assertions inside page objects behind booleans      |
| 💔 Brittle selectors  | Avoid CSS paths like `div:nth-child(3) > span`                 |
| 🎭 Too many behaviors | Don't mix multiple unrelated behaviors in one test             |
| 🏷️ Vague names        | Avoid names like "test issue" or "validation test"             |

---

### 10. UI Test Review Checklist

Before committing a UI test, verify:

- [ ] Is the test independent?
- [ ] Is the test name clear and behavior-focused?
- [ ] Does it verify one main behavior?
- [ ] Are selectors stable (testid, role, label)?
- [ ] Are assertions using Playwright locators where possible?
- [ ] Is test data readable and maintainable?
- [ ] Is repeated setup placed in `beforeEach` only when appropriate?
- [ ] Can another person understand the test quickly?

---

### 11. Full UI Test Example

```typescript
import { test, expect } from "@playwright/test";
import POManager from "../pageobjects/POManager";

test.describe("Create Issue", () => {
  let poManager: POManager;
  let qaDrawer: ReturnType<POManager["getQADrawerPage"]>;
  let newFormPage: ReturnType<POManager["getNewFormPage"]>;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
    qaDrawer = poManager.getQADrawerPage();
    newFormPage = poManager.getNewFormPage();
    await qaDrawer.goToQADrawer();
  });

  test("Should create an issue when valid data is submitted", async () => {
    const issue = {
      title: `Issue-${Date.now()}`,
      description: "Sample issue description",
    };

    await newFormPage.addIssue(issue);

    await expect(qaDrawer.getIssueCardByTitle(issue.title)).toBeVisible();
  });

  test("Should show a validation error when title is empty", async () => {
    await newFormPage.addIssue({
      title: "",
      description: "Missing title",
    });

    await expect(newFormPage.getValidationError("title")).toBeVisible();
  });
});
```

---

## Part II — API Test Standards

### 12. Core Principles

**12.1 Validate contract, not just status code**

```typescript
// ❌ Bad — status only
expect(response.status()).toBe(200);

// ✅ Better — status + body
expect(response.status()).toBe(200);
const body = await response.json();
expect(body.user).toHaveProperty("token");
expect(body.user.email).toBe(email);
```

**12.2 Cover both positive and negative scenarios**

For each important endpoint, include:

- Valid request tests
- Invalid request tests
- Auth tests when relevant
- Permission tests when relevant

**12.3 Keep API tests focused on behavior and contract**

> 💡 Do not overcomplicate API tests with UI-like patterns. API tests should be lean and contract-focused.

---

### 13. API Test Architecture

For API automation, do not use POM. Use an API client or service layer pattern instead.

```
tests/
  api/
    auth.spec.ts
    users.spec.ts

framework/
  api/
    clients/
      authClient.ts
      userClient.ts
    fixtures/
      auth.fixture.ts
    validators/
      userValidators.ts
    models/
      user.model.ts
```

---

### 14. API Client Standards

**14.1 Centralize request logic**

```typescript
export class AuthClient {
  constructor(private request) {}

  async login(email: string, password: string) {
    return this.request.post("/api/users/login", {
      data: { user: { email, password } },
    });
  }
}
```

**14.2 Tests should remain business-focused**

```typescript
// ✅ Clean test call
const response = await authClient.login(email, password);

// ❌ Raw payload repeated everywhere
const response = await request.post("/api/users/login", {
  data: { user: { email, password } },
}); // repeated in every test
```

---

### 15. Naming Standards for API Tests

> **Recommended style:** `Should return [expected result] when [condition]`

- `Should return a token when valid credentials are provided`
- `Should return 401 when password is incorrect`
- `Should return validation errors when required fields are missing`

---

### 16. Assertion Standards for API Tests

**16.1 Always verify status and body**

```typescript
expect(response.status()).toBe(200);
const body = await response.json();
expect(body.user.email).toBe(email);
expect(body.user.token).toBeTruthy();
```

**16.2 Validate error responses intentionally**

```typescript
expect(response.status()).toBe(422);
const body = await response.json();
expect(body.errors).toBeDefined();
```

**16.3 Match structure when useful**

```typescript
expect(body).toMatchObject({
  user: {
    email,
    token: expect.any(String),
  },
});
```

---

### 17. Test Data Standards for API Tests

- Keep credentials and payload data organized — store reusable payloads in one place
- Do not hardcode sensitive credentials — use environment variables for real credentials
- Make negative test data explicit — missing email, missing password, invalid token, malformed payload

---

### 18. Fixtures Standards for API Tests

Use fixtures for reusable setup like auth tokens.

```typescript
import { test as base } from "@playwright/test";

export const test = base.extend<{ token: string }>({
  token: async ({ request }, use) => {
    const response = await request.post("/api/users/login", {
      data: { user: { email: "test@example.com", password: "password123" } },
    });
    const body = await response.json();
    await use(body.user.token);
  },
});
```

---

### 19. Common API Test Anti-Patterns

| Anti-Pattern             | Description                                                              |
| ------------------------ | ------------------------------------------------------------------------ |
| 📊 Status code only      | Never validate just the status code — always check the response body too |
| 🔁 Duplicated requests   | Don't repeat raw request logic in every test — use a client layer        |
| 🖥️ UI POM for APIs       | Don't use Page Object Model patterns for API tests                       |
| 🎯 Mixed coverage        | Don't mix unrelated endpoint coverage in one test file                   |
| 🚫 Ignoring negatives    | Always include negative/error case tests for each endpoint               |
| 🔑 Hardcoded credentials | Never hardcode sensitive credentials in shared/public projects           |

---

### 20. API Test Review Checklist

- [ ] Does it validate both status and response body?
- [ ] Does it cover positive or negative behavior clearly?
- [ ] Is repeated request logic reusable via a client?
- [ ] Are test names clear and behavior-focused?
- [ ] Is setup reusable through fixtures or clients?
- [ ] Is the payload accurate to the API contract?
- [ ] Does the test fail with useful information?

---

### 21. Full API Test Example

```typescript
import { test, expect } from "@playwright/test";

test.describe("Login API", () => {
  test("Should return a token when valid credentials are provided", async ({ request }) => {
    const email = "test@example.com";

    const response = await request.post("https://conduit-api.bondaracademy.com/api/users/login", {
      data: { user: { email, password: "password123" } },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toMatchObject({
      user: { email, token: expect.any(String) },
    });
  });

  test("Should return an error when password is missing", async ({ request }) => {
    const response = await request.post("https://conduit-api.bondaracademy.com/api/users/login", {
      data: { user: { email: "test@example.com", password: "" } },
    });

    expect(response.status()).toBeGreaterThanOrEqual(400);
    const body = await response.json();
    expect(body).toBeDefined();
  });
});
```

---

## Part III — Final Summary

### 22. Standards Summary

**Senior-level UI tests should be:**

- ✓ Independent
- ✓ Readable
- ✓ Locator-based
- ✓ Stable
- ✓ Maintainable
- ✓ Data-driven when useful

**Senior-level API tests should be:**

- ✓ Contract-aware
- ✓ Reusable
- ✓ Status-and-body validated
- ✓ Structured with clients or fixtures
- ✓ Strong on positive and negative cases

---

### 23. Personal Practice Rule

Before committing any Playwright test, ask yourself:

1. Is this test independent?
2. Is the behavior clear?
3. Is the assertion strong enough?
4. Is the structure reusable?
5. Would this still look good in a team code review?

> ✅ If the answer is yes to all five, the test is usually on the right track.
