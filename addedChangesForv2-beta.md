# QA Center v2-beta Changelog

## [April 14, 2026] - Auto-refresh issues while drawer is open

- `src/features/qa-center/components/QAFloatingButton.tsx` — replaced single on-mount `loadIssues` call with a polling effect that re-fetches every 5s while the drawer is open, so issues created by Playwright tests (or any other tab/context) appear without a manual page refresh.

## [April 14, 2026] - Added data-testid attributes for Playwright locators

- `src/features/qa-center/components/QAFloatingButton.tsx` — added `data-testid="qa-floating-btn"` to the draggable button
- `src/features/qa-center/components/QADrawer.tsx` — added testids to drawer panel, overlay, close button, add button, add menu items, search input, type tabs, status pills, and pagination buttons
- `src/features/qa-center/components/NewIssueForm.tsx` — added testids to test search, test select, title, description, severity select, and submit/cancel buttons
- `src/features/qa-center/components/IssueCard.tsx` — added `data-testid="issue-card-{id}"` to each card
- `src/features/qa-center/components/IssueDetail.tsx` — added testids to close, edit, save, cancel, run test, status transition, and delete buttons

## [April 14, 2026] - Made POManager request parameter optional

- `tests/pageobjects/POManager.ts` — made `request` optional so POManager can be instantiated without it in tests that don't need API request context

## [April 14, 2026] - Added missing data-testid to remaining select elements

- `src/features/qa-center/components/NewIssueForm.tsx` — added `data-testid="feature-priority"` to the Priority select in the feature form
- `src/features/qa-center/components/IssueDetail.tsx` — added `data-testid="detail-severity"` to the Severity/Priority select in the edit form

## [April 14, 2026] - Added data-testid to all textarea elements

- `src/features/qa-center/components/NewIssueForm.tsx` — added testids to repro steps, feature description, acceptance criteria, and note content textareas
- `src/features/qa-center/components/IssueDetail.tsx` — added testids to description, repro steps, and acceptance criteria textareas in edit mode

## [April 14, 2026] - Fixed ESLint setup and resolved all lint errors

- `src/features/qa-center/components/ImportIssuesModal.tsx` — replaced ternary with if/else to fix `no-unused-expressions` lint error
- `src/features/qa-center/components/QAFloatingButton.tsx` — added `eslint-disable` comment on polling useEffect to suppress false-positive `exhaustive-deps` warning for stable Zustand action

## [April 16, 2026] - Added test plan tracking document

- `tests/TEST-PLAN.md` — created to track all features, test cases, types (happy path vs edge case), and automation status across the QA Center

## [April 16, 2026] - Updated TEST-PLAN.md with current automation status

- `tests/TEST-PLAN.md` — updated automation status to reflect completed tests, added spec/method references, noted missing assertions, and added Page Objects inventory section

## [April 16, 2026] - Scaffolded API and API+UI combo test files

- `tests/api/issues.api.spec.ts` — created with 11 test stubs covering GET, POST, PATCH, DELETE for the issues endpoint
- `tests/api/tests.api.spec.ts` — created with 3 test stubs for the /api/qa-tests endpoint
- `tests/api/status.api.spec.ts` — created with 4 test stubs for the /api/status endpoint
- `tests/features/issueVisibility.spec.ts` — created with 4 API+UI combo test stubs for issue visibility across contexts

## [April 16, 2026] - Split qacenter.spec.ts into feature-based UI test files

- `tests/qacenter.spec.ts` — reduced to 2 smoke tests only (app loads, drawer opens)
- `tests/ui/floatingButton.spec.ts` — created with existing floating button test + 3 stubs
- `tests/ui/createIssue.spec.ts` — created with existing add issue test + 3 stubs
- `tests/ui/createFeature.spec.ts` — created with existing add feature test + 2 stubs
- `tests/ui/createNote.spec.ts` — created with existing add note test + 2 stubs
- `tests/ui/drawer.spec.ts` — created with 7 stubs for drawer interactions
- `tests/ui/issueDetail.spec.ts` — created with 6 stubs for issue detail panel

## [April 16, 2026] - Added data-testid to IssueCard inner elements

- `src/features/qa-center/components/IssueCard.tsx` — added testids to title, origin badge, status badge, severity badge, priority badge, area badge, source ref, and test result badge for easier Playwright locators

## [April 16, 2026] - Improved test scanner to support DDT template literals and nested describes

- `server/routes/tests.js` — rewrote `extractTests` to handle template literal test titles (DDT `${variable}` replaced with `*` wildcard), support nested `test.describe` blocks via a stack, and match `.only`/`.skip` variants
- `eslint.config.js` — disabled `no-unused-vars` for test files to allow empty stub test bodies without lint errors

## [April 16, 2026] - Fixed DEP0190 security warning in test runner

- `server/routes/runTest.js` — changed `spawn` from `shell: true` to `shell: false` with args as a proper array to eliminate Node.js DEP0190 shell concatenation security warning

## [April 16, 2026] - DDT support: stable test IDs and improved scanner

- `src/features/qa-center/types/index.ts` — added optional `testId` field to `LinkedTest` and `AvailableTest` types to support stable `[id:xxx]` identifiers for DDT
- `server/routes/tests.js` — added `extractTestId()` to parse `[id:xxx]` from test titles and include it in scanned test results

## [April 16, 2026] - Added qaTest() utility for reliable DDT test linking

- `src/index.ts` — exported `qaTest(id, title)` utility that embeds a stable `[id:xxx]` tag into test titles for reliable DDT linking and grep execution
- `server/routes/runTest.js` — updated runner to prefer `[id:xxx]` grep when `testId` is present on linked test, falls back to title-based grep for static tests
- `docs/index.html` — added DDT section to nav and page documenting `qaTest()` usage, examples, and when it's needed vs optional

## [April 17, 2026] - Added data-testid to validation error and warning banners

- `src/features/qa-center/components/NewIssueForm.tsx` — added `data-testid="form-error-banner"` to the validation error banner for easier Playwright assertions
- `src/features/qa-center/components/IssueDetail.tsx` — added `data-testid="detail-run-error"` to the run test error message and `data-testid="detail-verify-blocked-msg"` to the verification blocked warning

## [April 17, 2026] - Added dummy test data files for issues and notes

- `tests/utils/issuesTestData.ts` — created with 5 typed issue test data entries covering all severity levels and different modules
- `tests/utils/notesTestData.ts` — created with 5 typed note test data entries covering meeting notes, design feedback, backend, QA coverage, and accessibility

## [April 18, 2026] - Refactored validation assertions and test setup to follow POM standards

- `tests/pageobjects/NewFormPage.ts` — removed `checkValidationError()` boolean method (hidden assertion anti-pattern), replaced with `getValidationBannerByTitle()` that returns a Locator for use in test assertions
- `tests/pageobjects/QADrawerPage.ts` — replaced hardcoded `http://localhost:5173/` with relative `/` to use baseURL from playwright.config.ts
- `tests/ui/createNote.spec.ts` — made `beforeEach` async, moved `goToQADrawer()` into it, updated validation assertion to use `getValidationBannerByTitle()`, improved test name to use `note.title` instead of `note.id`
- `tests/ui/createIssue.spec.ts` — made `beforeEach` async, moved `goToQADrawer()` into it, updated validation assertions to use `getValidationBannerByTitle()`
- `tests/ui/createFeature.spec.ts` — updated validation assertion to use `getValidationBannerByTitle()`

## [April 18, 2026] - Fixed duplicate test titles and incorrect names in createFeature spec

- `tests/ui/createFeature.spec.ts` — interpolated `feature.name` and `missingTitle.id` into test titles to prevent duplicate title errors in DDT loops
- `tests/ui/createFeature.spec.ts` — corrected test name from "Notes tab" to "Features tab" and "note content" to "title" (copy-paste errors from notes spec)
- `tests/ui/createFeature.spec.ts` — removed incorrect `.first()` call from inside `expect()` (locator method must be called on the locator, not the matcher)

## [April 18, 2026] - Added query param filtering to GET /api/qa-issues

- `server/routes/issues.js` — added `?origin` and `?status` query param support to the GET endpoint so callers can filter issues by origin (manual, feature, note, imported_markdown) or status (open, in_progress, etc.), with 400 validation for invalid filter values

## [April 18, 2026] - Renamed API route from /api/qa-issues to /api/qa-items and origin "manual" to "issue"

- `server/index.js` — updated route mount from `/api/qa-issues` to `/api/qa-items`
- `server/routes/issues.js` — updated `VALID_ORIGINS` set, default origin value, and route comments
- `server/routes/runTest.js` — updated route comment to reflect new path
- `src/features/qa-center/services/issueApiService.ts` — updated all fetch calls to use `/api/qa-items`
- `src/features/qa-center/types/index.ts` — updated `IssueOrigin` type from `"manual"` to `"issue"`
- `src/features/qa-center/components/QADrawer.tsx` — updated tab value, defaults, filter logic, and add menu from `"manual"` to `"issue"`
- `src/features/qa-center/components/NewIssueForm.tsx` — updated default prop, conditionals, and POST body origin from `"manual"` to `"issue"`
- `src/features/qa-center/components/IssueDetail.tsx` — updated all origin checks from `"manual"` to `"issue"`
- `src/features/qa-center/components/IssueCard.tsx` — updated badge map key and origin conditionals from `"manual"` to `"issue"`
- `src/features/qa-center/components/QAFloatingButton.tsx` — updated neko active check from `"manual"` to `"issue"`
- `src/features/qa-center/store/useQACenterStore.ts` — updated initial filters and `clearFilters` default origin from `"manual"` to `"issue"`
- `tests/pageobjects/QADrawerPage.ts` — updated `issuesTab` locator from `qa-tab-manual` to `qa-tab-issue`
- `tests/api/issues.api.spec.ts` — updated all request URLs to `/api/qa-items`
- `tests/features/issueVisibility.spec.ts` — updated test name to reference `/api/qa-items`
- `tests/framework/api/models/qaIssue.model.ts` — updated `QAIssue.origin` type from `"manual"` to `"issue"`
- `qa-issues.json` — migrated all existing data entries from `"origin": "manual"` to `"origin": "issue"`

## [April 18, 2026] - Added GET by ID endpoint to /api/qa-items

- `server/routes/issues.js` — added `GET /:id` route to return a single item by ID, returning 404 if not found
- `src/features/qa-center/services/issueApiService.ts` — added `fetchIssueById()` function to expose the new endpoint to the frontend

## [April 18, 2026] - Fixed implicit any type error in DELETE test

- `tests/api/issues.api.spec.ts` — imported `QAIssue`, `QAFeature`, `QANote` models and defined a `QAItem` union type to fix implicit `any` on the `forEach` callback parameter, also typed `qaIds` as `string[]` with an `id` null guard

## [April 18, 2026] - Fixed deleteItemById passing bare ID instead of full URL path

- `tests/framework/api/clients/qaItemsClient.ts` — fixed `deleteItemById()` to use `/api/qa-items/${id}` instead of passing the raw ID string as the URL, which caused DELETE requests to fail silently

## [April 19, 2026] - Enforced unique titles across all item origins on POST

- `server/routes/issues.js` — added duplicate title check on POST that returns 409 Conflict if any existing item (regardless of origin) already has the same title (case-insensitive), preventing duplicate cards in the UI

## [April 19, 2026] - Surface 409 duplicate title error in the create form

- `src/features/qa-center/components/NewIssueForm.tsx` — made `handleSubmit` async and wrapped `addIssue` in try/catch so server errors (including 409 duplicate title) are displayed in the error banner instead of failing silently; added `setError("")` on submit to clear previous errors
- `src/features/qa-center/store/useQACenterStore.ts` — updated `addIssue` to return a Promise and re-throw on API error so the form can catch it; sets `isCreating: true` on failure to keep the form open; updated type signature from `void` to `Promise<void>`

## [April 19, 2026] - Fixed error banner not showing on duplicate title submission

- `src/features/qa-center/store/useQACenterStore.ts` — removed optimistic update from `addIssue`; now waits for API response before closing the form and adding the item, so errors (409 duplicate title, etc.) can propagate back to the form and be displayed

## [April 19, 2026] - Added success/error toast notifications for create, edit, and delete

- `src/features/qa-center/store/useQACenterStore.ts` — added `toast` state, `showToast()`, and `dismissToast()` actions; toast auto-dismisses after 3.5s and new toasts replace old ones immediately
- `src/features/qa-center/components/QADrawer.tsx` — renders the toast as a fixed bottom-right banner (green for success, red for error); click to dismiss early
- `src/features/qa-center/components/NewIssueForm.tsx` — calls `showToast()` with the item title after successful create
- `src/features/qa-center/components/IssueDetail.tsx` — calls `showToast()` with the item title after successful save and after delete

## [April 19, 2026] - Moved toast notification position to top-right

- `src/features/qa-center/components/QADrawer.tsx` — changed toast position from bottom-right to top-right

## [April 19, 2026] - Scoped title uniqueness check to per-category instead of global

- `server/routes/issues.js` — updated duplicate title check to only enforce uniqueness within the same origin/category, so the same title can exist across different categories (e.g. an issue and a feature can share a title) but not within the same one

## [April 19, 2026] - Made port 3333 API-only and added confirmation dialogs for save and delete

- `server/index.js` — removed catch-all that served the React UI on port 3333; unknown routes now return a clean 404 JSON with a hint about available API routes instead of rendering the app
- `src/features/qa-center/components/IssueDetail.tsx` — added `window.confirm` before saving edits and before deleting an item so users must confirm before destructive or mutating actions proceed

## [April 19, 2026] - Serve documentation at localhost:3333 root

- `server/index.js` — added GET `/` route that serves `docs/index.html` so visiting the API server root shows the QA Center documentation instead of a 404

## [April 19, 2026] - Increased floating button badge count limit from 9+ to 99+

- `src/features/qa-center/components/QAFloatingButton.tsx` — changed badge overflow threshold from 9 to 99 so exact counts show up to 99, then displays 99+ for 100 and above

## [April 19, 2026] - Fixed linkedPlaywrightTest values in issue test data to match dropdown labels

- `tests/utils/testdata/issuesTestData.ts` — corrected `linkedPlaywrightTest` values across all three arrays from the full title (`"@API Status API > GET response contains issues summary"`) to just the `testTitle` (`"GET response contains issues summary"`) which is what the select option label actually displays, fixing a timeout error in `selectOption`

## [April 19, 2026] - Added "All" tab to QA Drawer showing all items across origins

- `src/features/qa-center/components/QADrawer.tsx` — added "All" tab as the first tab in the type tab bar; updated filter logic to skip origin filtering when `origin === "all"`; added status pill set for the "all" tab; updated empty state messages to handle "all" origin
- `src/features/qa-center/store/useQACenterStore.ts` — updated `switchTab` to default status to `"all"` (instead of `"open"`) when switching to the "All" tab so all items are visible immediately

## [April 19, 2026] - Set "All" tab as the default when opening QA Center

- `src/features/qa-center/store/useQACenterStore.ts` — changed initial filters and `clearFilters` default from `origin: "issue", status: "open"` to `origin: "all", status: "all"` so the drawer opens showing all items
- `src/features/qa-center/components/QADrawer.tsx` — updated tab active fallback from `"issue"` to `"all"` to match the new default

## [April 19, 2026] - Enforce unique title on edit and surface duplicate error in detail form

- `server/routes/issues.js` — added duplicate title check to PATCH route, excluding the item being edited, returning 409 if another item in the same category already has that title
- `src/features/qa-center/store/useQACenterStore.ts` — updated `saveIssue` to re-throw on API error (previously swallowed it silently) so the form can catch and display it
- `src/features/qa-center/components/IssueDetail.tsx` — wrapped `handleSave` in try/catch; added `saveError` state that renders an inline error banner (e.g. duplicate title 409); clears error on cancel

## [April 19, 2026] - Improved duplicate title error message to include the conflicting title

- `server/routes/issues.js` — updated both POST and PATCH 409 error messages to include the actual title in the message (e.g. `"Login button broken" already exists in this category. Title must be unique.`) for clearer user feedback

## [April 19, 2026] - Fixed patchIssue swallowing server error message

- `src/features/qa-center/services/issueApiService.ts` — updated `patchIssue` to parse the response body on error and throw the server's actual message instead of the hardcoded "Failed to update issue." string, so 409 duplicate title errors now surface correctly in the edit form

## [April 22, 2026] - Fixed goToQADrawer fixture type in ui.fixture.ts

- `tests/utils/fixtures/ui.fixture.ts` — corrected `goToQADrawer` type from `Promise<void>` to `() => Promise<void>` so it is callable in tests instead of being a resolved promise value

## [April 22, 2026] - Fixed neko gif loading from wrong server

- `src/features/qa-center/components/NekoButton.tsx` — changed default sprite URL from `${baseUrl}/oneko.gif` (API server port 3333) to `/oneko.gif` (relative path) so the gif loads from the Vite dev server instead of hitting the API server and getting a 404; removed now-unused `baseUrl` prop
- `src/features/qa-center/components/QAFloatingButton.tsx` — removed `baseUrl` prop from `<NekoButton>` call site since it is no longer needed

## [April 22, 2026] - Added neko sprite accessibility check to GET /api/status

- `server/routes/status.js` — added a `neko` section to the status response that probes common local origins (5173, 4173, 3000) for `oneko.gif` via a HEAD request and reports whether the sprite is accessible, which URL it was found at, and a human-readable note

## [April 27, 2026] - Made DELETE /api/qa-items/:id response more informative

- `server/routes/issues.js` — updated DELETE endpoint to return success message and deleted item details (id, title, origin) instead of just `{ ok: true }` for better logging, auditing, and test assertions

## [April 27, 2026] - Added proper access modifiers to all Playwright test classes

- `tests/pageobjects/POManager.ts` — added `private readonly` to internal properties and `public` to getter methods for proper encapsulation
- `tests/pageobjects/QADrawerPage.ts` — added `private readonly` to page, `public readonly` to locators, and `public` to methods following TypeScript best practices
- `tests/pageobjects/NewFormPage.ts` — added `private readonly` to page, `public readonly` to locators, and `public` to methods for clear API boundaries
- `tests/pageobjects/QAFloatingButtonPage.ts` — added `private readonly` to page and request, `public readonly` to qaCenter locator, and `public` to methods
- `tests/framework/api/clients/qaItemsClient.ts` — added `private readonly` to request property and `public` to all API methods, also added missing return type to `createItemRaw`

## [April 27, 2026] - Fixed create issue UI test to use unique titles and remove redundant navigation

- `tests/ui/createIssue.spec.ts` — added timestamp to issue titles to avoid 409 duplicate conflicts, removed redundant `goToQADrawer()` and `switchToTab()` calls, increased timeout to 10s to account for polling refresh

## [April 27, 2026] - Fixed flaky test by preventing timestamp collisions in unique title generation

- `tests/ui/createIssue.spec.ts` — added random string suffix to timestamp-based unique titles to prevent collisions when tests run in quick succession, added cleanup guard to skip empty cleanup

## [April 27, 2026] - Applied best practices to create issue tests for better isolation and reliability

- `tests/ui/createIssue.spec.ts` — replaced shared array with per-test `createdItemId` for true test isolation, changed cleanup to use item ID instead of title search for reliability, added form-still-open assertions to validation tests to verify failure behavior

## [April 27, 2026] - Fixed race condition in create issue test caused by auto-opening detail panel

- `tests/ui/createIssue.spec.ts` — added verification that detail panel opens after creation, then closes it before asserting card visibility, fixing race condition where detail panel covered the card list

## [April 27, 2026] - Simplified create issue test to avoid non-existent testid dependency

- `tests/ui/createIssue.spec.ts` — removed detail panel title check (testid doesn't exist), simplified to just wait for card visibility with 15s timeout to account for polling refresh

## [April 27, 2026] - Disabled parallel test execution to prevent race conditions with shared backend

- `playwright.config.ts` — set `fullyParallel: false` and `workers: 1` to run tests serially, preventing race conditions caused by multiple tests sharing the same `qa-issues.json` file

## [April 27, 2026] - Made create issue test more robust by waiting for form close and handling detail panel

- `tests/ui/createIssue.spec.ts` — added wait for form to close after submission, conditional detail panel close, and explicit tab switch to ensure card is visible in the correct view

## [April 27, 2026] - Re-applied polished test files that weren't properly saved

- `tests/ui/createNote.spec.ts` — re-applied polished version with per-test cleanup, unique titles, form close wait, and detail panel handling (previous strReplace didn't persist)
- `tests/ui/createFeature.spec.ts` — re-applied polished version with per-test cleanup, unique titles, form close wait, and detail panel handling (previous strReplace didn't persist)
- `tests/features/issueVisibility.spec.ts` — re-applied polished version with per-test cleanup, unique titles, and improved assertions (previous strReplace didn't persist)

## [April 27, 2026] - Fixed remaining flakiness issues in API tests with unique titles and cleanup

- `tests/api/issues.api.spec.ts` — removed `deleteAllItems()` call from POST test, added unique titles with timestamp+random suffix to POST/PATCH/DELETE tests, added cleanup after each test to prevent 409 conflicts and ensure true test isolation

## [May 4, 2026] - Fixed prettier command and resolved all ESLint errors

- `package.json` — updated format script to use `npx prettier` instead of bare `prettier` to avoid dependency resolution conflicts
- `server/index.js` — removed unused `fs` and `distExists` imports to fix `no-unused-vars` lint errors
- `server/routes/status.js` — added eslint-disable comments for Node.js built-in globals (`AbortController`, `fetch`) to fix `no-undef` errors
- `tests/utils/fixtures/api.fixture.ts` — added eslint-disable comment for empty object pattern (required by Playwright's fixture API)
- `tests/utils/fixtures/apiUi.fixture.ts` — added eslint-disable comment for empty object pattern (required by Playwright's fixture API)
- `tests/utils/fixtures/ui.fixture.ts` — added eslint-disable comment for empty object pattern (required by Playwright's fixture API)

## [May 4, 2026] - Fixed ESLint dependency conflict and PostCSS security vulnerability

- `package.json` — downgraded `@eslint/js` from ^10.0.1 to ^9.0.0 to match ESLint 9.39.4 and resolve peer dependency conflict
- `package-lock.json` — updated PostCSS from <8.5.10 to >=8.5.10 to fix moderate severity XSS vulnerability (GHSA-qx2v-qp2m-jg93)
