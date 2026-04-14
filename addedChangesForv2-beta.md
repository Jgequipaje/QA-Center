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
