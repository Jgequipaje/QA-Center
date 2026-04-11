# Implementation Plan: QACenter Component API

## Overview

Refactor QA Center from a hardwired standalone app into a properly exported React component (`<QACenter />`) with a typed props API. The implementation threads configuration through a React context, refactors the API service and store to accept `baseUrl` as a parameter, and exposes a single clean package entry point.

## Tasks

- [x] 1. Define public types and create QACenterConfigContext
  - [x] 1.1 Add `QACenterButtonColor` and `QACenterShape` type aliases to `src/features/qa-center/types/index.ts`
    - `QACenterButtonColor = { dark: string; light: string }`
    - `QACenterShape = "circle" | "rounded" | "square"`
    - _Requirements: 13.1, 13.2, 13.3_

  - [x] 1.2 Create `src/features/qa-center/components/QACenterConfigContext.tsx`
    - Define internal `QACenterConfig` type with fields: `baseUrl`, `buttonColor`, `buttonSize`, `shape`, `logo`, `name`
    - Create `QACenterConfigContext` with default values matching DefaultProps
    - Export `useQACenterConfig()` hook
    - _Requirements: 7.2, 7.4, 11.1–11.7_

- [x] 2. Refactor `issueApiService` to accept `baseUrl` parameter
  - [x] 2.1 Remove the module-level `BASE` constant from `src/features/qa-center/services/issueApiService.ts`
    - Add `baseUrl: string` as the first parameter to all exported functions: `fetchIssues`, `createIssue`, `updateIssueStatus`, `deleteIssue`, `fetchAvailableTests`, `refreshAvailableTests`, `runLinkedTest`
    - Construct URLs as `` `${baseUrl}/api/qa-issues` `` etc. inside each function
    - _Requirements: 7.2, 7.3, 7.4_

  - [ ]* 2.2 Write unit tests for `issueApiService` URL construction
    - Test that each function uses the provided `baseUrl` as the URL prefix
    - Mock `fetch` and assert the called URL matches `${baseUrl}/api/...`
    - _Requirements: 7.2_

- [x] 3. Refactor `useQACenterStore` actions to accept `baseUrl` parameter
  - [x] 3.1 Update store action signatures in `src/features/qa-center/store/useQACenterStore.ts`
    - `loadIssues(baseUrl: string): Promise<void>`
    - `addIssue(baseUrl: string, issue: Issue): void`
    - `updateIssueStatus(baseUrl: string, id: string, status: IssueStatus): void`
    - `deleteIssue(baseUrl: string, id: string): void`
    - Pass `baseUrl` through to the corresponding `api.*` calls
    - _Requirements: 7.2, 7.4_

- [x] 4. Create the `QACenter` component
  - [x] 4.1 Create `src/features/qa-center/components/QACenter.tsx`
    - Define `QACenterProps` interface referencing `QACenterButtonColor` and `QACenterShape`
    - Implement `resolveBaseUrl(apiBaseUrl?, port?): string` pure function
    - Apply DefaultProps: `buttonColor = { dark: "#7c3aed", light: "#7c3aed" }`, `buttonSize = 52`, `shape = "circle"`, `name = "QA Center"`
    - Render `ThemeProvider` > `QACenterConfigContext.Provider` > `QAFloatingButton` + `QADrawer`
    - _Requirements: 1.1–1.5, 7.1–7.4, 8.1–8.4, 10.3, 11.1–11.7_

  - [ ]* 4.2 Write property test for `resolveBaseUrl` (Property 9)
    - **Property 9: URL resolution follows priority order**
    - For arbitrary `(string | undefined) × (number | undefined)` combinations, assert `apiBaseUrl` wins, then `port`, then default
    - **Validates: Requirements 8.2, 8.3, 8.4**

  - [ ]* 4.3 Write unit tests for `QACenter` default props
    - Render `<QACenter />` with no props; assert `QACenterConfigContext` receives all DefaultProps values
    - Render `<QACenter />` with all props; assert context receives resolved values
    - _Requirements: 1.3, 11.1–11.7_

- [x] 5. Update `QAFloatingButton` to read config from context
  - [x] 5.1 Replace hardcoded constants in `src/features/qa-center/components/QAFloatingButton.tsx`
    - Call `useQACenterConfig()` to get `buttonColor`, `buttonSize`, `shape`, `logo`, `baseUrl`
    - Replace `BTN_SIZE` constant with `buttonSize` from context in all geometry calculations (`snapToEdge`, `clamp` calls, `defaultPos`, drag boundary)
    - Apply `buttonColor[theme]` as the active background instead of `t.btnActive`
    - Map `shape` to `border-radius`: `"circle"` → `"50%"`, `"rounded"` → `"12px"`, `"square"` → `"4px"`
    - Render `logo` node when drawer is closed and `logo` is provided; otherwise render `"QA"` text
    - Pass `baseUrl` to `loadIssues(baseUrl)` and other store actions
    - _Requirements: 2.2, 2.3, 3.2, 3.4, 4.2–4.5, 5.2, 5.3, 5.4_

  - [ ]* 5.2 Write property test for button color (Property 1)
    - **Property 1: Button color matches theme**
    - For arbitrary CSS color strings × theme values, assert rendered button background equals `buttonColor[theme]`
    - **Validates: Requirements 2.2, 2.3**

  - [ ]* 5.3 Write property test for button size (Property 2)
    - **Property 2: Button size is applied exactly**
    - For arbitrary positive integers, assert button `width` and `height` styles equal `buttonSize`
    - **Validates: Requirements 3.2**

  - [ ]* 5.4 Write property test for boundary geometry (Property 3)
    - **Property 3: Button size governs boundary geometry**
    - For arbitrary `buttonSize` × viewport dimension pairs, assert snap/clamp output keeps button within `[EDGE_MARGIN, vw/vh - buttonSize - EDGE_MARGIN]`
    - **Validates: Requirements 3.4**

  - [ ]* 5.5 Write property test for shape mapping (Property 4)
    - **Property 4: Shape maps to correct border-radius**
    - Exhaustive over `{ "circle", "rounded", "square" }`, assert `borderRadius` equals expected value
    - **Validates: Requirements 4.2, 4.3, 4.4, 4.5**

  - [ ]* 5.6 Write property test for logo rendering (Properties 5 & 6)
    - **Property 5: Logo is rendered when drawer is closed**
    - **Property 6: Close icon overrides logo when drawer is open**
    - For arbitrary `React.ReactNode` logo values, assert correct content in each drawer state
    - **Validates: Requirements 5.2, 5.3**

- [x] 6. Update `QADrawer` to read name from context
  - [x] 6.1 Call `useQACenterConfig()` in `src/features/qa-center/components/QADrawer.tsx`
    - Replace the hardcoded `"QA Center"` string in the header with `config.name`
    - Pass `baseUrl` from context to all store actions (`loadIssues`, `addIssue`, `updateIssueStatus`, `deleteIssue`)
    - _Requirements: 6.2, 6.3, 7.2_

  - [ ]* 6.2 Write property test for custom name in drawer header (Property 7)
    - **Property 7: Custom name appears in drawer header**
    - For arbitrary non-empty strings, assert the drawer header contains the `name` value
    - **Validates: Requirements 6.2**

- [x] 7. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Update other components that call store actions with `baseUrl`
  - [x] 8.1 Update `NewIssueForm`, `IssueDetail`, `ImportedIssueDetail`, and `ImportIssuesModal` to read `baseUrl` from `useQACenterConfig()` and pass it to store actions
    - Each component that calls `addIssue`, `updateIssueStatus`, `deleteIssue`, or `runLinkedTest` must destructure `baseUrl` from context and forward it
    - _Requirements: 7.2, 7.4_

- [x] 9. Create `src/index.ts` as the single package entry point
  - [x] 9.1 Create `src/index.ts` with explicit named exports only
    - `export type { QACenterButtonColor, QACenterShape, QACenterProps } from "./features/qa-center/components/QACenter"`
    - `export { QACenter } from "./features/qa-center/components/QACenter"`
    - No wildcard re-exports; no internal symbols
    - _Requirements: 12.1, 12.2, 13.1–13.5, 16.3, 17.1–17.3_

  - [ ]* 9.2 Write unit test for export surface
    - Import `* as QALib from "./index"` and assert the namespace contains exactly `{ QACenter, QACenterProps }` (runtime-visible symbols)
    - _Requirements: 12.3, 17.2_

- [x] 10. Update `package.json` exports field
  - [x] 10.1 Add `exports` field to `package.json` pointing to the compiled entry point
    - Set `"exports": { ".": { "import": "./dist/index.js", "types": "./dist/index.d.ts" } }`
    - Set `"main"` and `"module"` fields to `"./dist/index.js"` if not already present
    - _Requirements: 12.4, 17.1, 17.4_

- [x] 11. Update `src/main.tsx` for backward-compatible standalone mode
  - [x] 11.1 Replace direct `ThemeProvider + QAFloatingButton + QADrawer` composition with `<QACenter />`
    - Import `QACenter` from `./features/qa-center/components/QACenter`
    - Remove `ThemeProvider`, `QAFloatingButton`, and `QADrawer` imports
    - Render `<QACenter />` with no props (uses DefaultProps)
    - _Requirements: 10.2, 10.3_

- [x] 12. Update `test-host.html` to use the new `QACenter` component API
  - [x] 12.1 Replace any direct component usage in `test-host.html` with the `<QACenter />` component
    - Update script/import references to use the new entry point
    - Verify the host page still loads and the floating button appears
    - _Requirements: 10.1, 10.3_

- [x] 13. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- `QACenterConfigContext` is internal — not exported from `src/index.ts`
- Store actions accept `baseUrl` as a parameter (Option B from design) to support multi-instance correctness
- Property tests use Vitest + fast-check; tag format: `// Feature: qa-center-component-api, Property {N}: {property_text}`
- `bin/cli.js` requires no changes — it invokes the Express server which is unaffected by this refactor
