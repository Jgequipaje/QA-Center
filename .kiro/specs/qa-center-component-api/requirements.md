# Requirements Document

## Introduction

QA Center is currently a standalone app that mounts itself via `main.tsx` with hardcoded styles and a fixed button appearance. This feature refactors QA Center so it is exported as a proper React component (`<QACenter />`) with a clean, typed props API. Any project can import the package and render the component with their own visual configuration — button color, size, shape, logo, and label — without forking or patching the source. The standalone CLI entry point (`bin/cli.js`) continues to work unchanged; it simply renders `<QACenter />` with default props internally.

---

## Glossary

- **QACenter**: The top-level React component exported from `@purr/qa-center` that renders the floating button and slide-out drawer.
- **QACenterProps**: The TypeScript interface describing all configurable props accepted by `QACenter`.
- **QACenterButtonColor**: The exported type alias (prefixed for namespace safety) for the `{ dark: string; light: string }` button color object.
- **QACenterShape**: The exported type alias (prefixed for namespace safety) for the `"circle" | "rounded" | "square"` union.
- **ButtonColor**: An object with `dark` and `light` string fields, each a valid CSS color value, used to set the floating button's active background per theme.
- **ButtonShape**: A union type `"circle" | "rounded" | "square"` controlling the border-radius of the floating button.
- **Consumer**: Any project that imports and renders `<QACenter />` from `@purr/qa-center`.
- **ThemeProvider**: The internal context provider that manages dark/light theme state and exposes design tokens.
- **FloatingButton**: The draggable button rendered in the corner of the viewport that opens/closes the drawer.
- **Drawer**: The slide-out panel that displays the issue list, filters, and issue detail views.
- **APIBaseURL**: The URL string passed to `QACenter` that overrides the default `http://localhost:3333` base used by `issueApiService`.
- **DefaultProps**: The set of prop values applied when a consumer does not supply a given prop.
- **Port**: An optional numeric prop on `QACenterProps` that, when provided without `apiBaseUrl`, constructs the API base URL as `http://localhost:{port}`.
- **PackageEntryPoint**: The single `index.ts` (or `index.tsx`) file at the root of the package source that is the sole module listed in the `exports` field of `package.json`.
- **PublicAPI**: The complete set of symbols intentionally re-exported from the PackageEntryPoint — currently `QACenter` and `QACenterProps` only.
- **GlobalSideEffect**: Any operation that mutates state outside the component's own React subtree, including registering `window` event listeners, modifying `document` properties, or injecting stylesheet rules into the global document.

---

## Requirements

### Requirement 1: Exportable QACenter Component

**User Story:** As a developer integrating QA Center into my project, I want to import `QACenter` as a named export from `@purr/qa-center`, so that I can render it anywhere in my React tree without cloning or modifying the source.

#### Acceptance Criteria

1. THE `@purr/qa-center` package SHALL export a named `QACenter` React component.
2. THE `QACenter` component SHALL accept a `QACenterProps` object as its props.
3. WHEN `<QACenter />` is rendered with no props, THE `QACenter` component SHALL render using DefaultProps for all visual options.
4. THE `QACenter` component SHALL render both the FloatingButton and the Drawer within a single self-contained subtree.
5. THE `QACenter` component SHALL wrap its subtree in a ThemeProvider so consumers do not need to add one themselves.

---

### Requirement 2: Button Color Configuration

**User Story:** As a developer, I want to set the floating button's active background color for both dark and light themes, so that QA Center matches my project's brand.

#### Acceptance Criteria

1. THE `QACenterProps` interface SHALL include an optional `buttonColor` prop of type `{ dark: string; light: string }`.
2. WHEN `buttonColor` is provided, THE FloatingButton SHALL use `buttonColor.dark` as its active background color when the active theme is dark.
3. WHEN `buttonColor` is provided, THE FloatingButton SHALL use `buttonColor.light` as its active background color when the active theme is light.
4. WHEN `buttonColor` is not provided, THE FloatingButton SHALL use the DefaultProps color values `{ dark: "#7c3aed", light: "#7c3aed" }`.
5. WHEN an invalid CSS color string is supplied in `buttonColor`, THE FloatingButton SHALL render without throwing an error, applying the value as-is to the CSS `background` property.

---

### Requirement 3: Button Size Configuration

**User Story:** As a developer, I want to control the size of the floating button, so that it fits the visual density of my application.

#### Acceptance Criteria

1. THE `QACenterProps` interface SHALL include an optional `buttonSize` prop of type `number`, representing the button's width and height in pixels.
2. WHEN `buttonSize` is provided, THE FloatingButton SHALL render with a width and height equal to `buttonSize` pixels.
3. WHEN `buttonSize` is not provided, THE FloatingButton SHALL render with a default size of 52 pixels.
4. WHEN `buttonSize` is provided, THE FloatingButton's snap-to-edge and drag-boundary calculations SHALL use the provided `buttonSize` value instead of the hardcoded constant.

---

### Requirement 4: Button Shape Configuration

**User Story:** As a developer, I want to choose the shape of the floating button, so that it matches my application's design language.

#### Acceptance Criteria

1. THE `QACenterProps` interface SHALL include an optional `shape` prop of type `"circle" | "rounded" | "square"`.
2. WHEN `shape` is `"circle"`, THE FloatingButton SHALL apply a `border-radius` of `50%`.
3. WHEN `shape` is `"rounded"`, THE FloatingButton SHALL apply a `border-radius` of `12px`.
4. WHEN `shape` is `"square"`, THE FloatingButton SHALL apply a `border-radius` of `4px`.
5. WHEN `shape` is not provided, THE FloatingButton SHALL default to `"circle"`.

---

### Requirement 5: Custom Logo / Icon

**User Story:** As a developer, I want to supply a custom logo or icon element for the floating button, so that users of my app recognise the QA tool as part of my product.

#### Acceptance Criteria

1. THE `QACenterProps` interface SHALL include an optional `logo` prop of type `React.ReactNode`.
2. WHEN `logo` is provided and the drawer is closed, THE FloatingButton SHALL render the `logo` node in place of the default `"QA"` text label.
3. WHEN `logo` is provided and the drawer is open, THE FloatingButton SHALL render the close icon (`✕`) regardless of the `logo` value.
4. WHEN `logo` is not provided, THE FloatingButton SHALL render the default `"QA"` text label when the drawer is closed.

---

### Requirement 6: Custom Name / Label

**User Story:** As a developer, I want to set a display name for the QA Center panel, so that the drawer header reflects my application's context.

#### Acceptance Criteria

1. THE `QACenterProps` interface SHALL include an optional `name` prop of type `string`.
2. WHEN `name` is provided, THE Drawer header SHALL display the `name` value in place of the default `"QA Center"` title.
3. WHEN `name` is not provided, THE Drawer header SHALL display `"QA Center"` as the default title.

---

### Requirement 7: Configurable API Base URL

**User Story:** As a developer embedding QA Center in a project that runs the Express server on a non-default port or path, I want to configure the API base URL, so that the component communicates with the correct server endpoint.

#### Acceptance Criteria

1. THE `QACenterProps` interface SHALL include an optional `apiBaseUrl` prop of type `string`.
2. WHEN `apiBaseUrl` is provided, THE `issueApiService` SHALL use `apiBaseUrl` as the base for all HTTP requests.
3. WHEN `apiBaseUrl` is not provided, THE `issueApiService` SHALL use `"http://localhost:3333"` as the default base URL.
4. WHEN `apiBaseUrl` changes between renders, THE `issueApiService` SHALL use the updated value for all subsequent requests.

---

### Requirement 8: Convenience Port Prop

**User Story:** As a developer, I want to specify just a port number instead of a full URL, so that I can configure the API endpoint with less boilerplate when running the server locally.

#### Acceptance Criteria

1. THE `QACenterProps` interface SHALL include an optional `port` prop of type `number`.
2. WHEN `port` is provided and `apiBaseUrl` is not provided, THE `issueApiService` SHALL use `http://localhost:{port}` as the base URL for all HTTP requests.
3. WHEN both `port` and `apiBaseUrl` are provided, THE `issueApiService` SHALL use `apiBaseUrl` and ignore `port`.
4. WHEN neither `port` nor `apiBaseUrl` is provided, THE `issueApiService` SHALL use `"http://localhost:3333"` as the default base URL.

---

### Requirement 9: Props Type Export

**User Story:** As a TypeScript developer consuming `@purr/qa-center`, I want the `QACenterProps` type to be exported from the package, so that I can type my configuration objects without duplicating the interface.

#### Acceptance Criteria

1. THE `@purr/qa-center` package SHALL export the `QACenterProps` TypeScript interface as a named export.
2. WHEN a consumer imports `QACenterProps`, THE TypeScript compiler SHALL resolve all prop types without requiring additional type declarations.

---

### Requirement 10: Backward-Compatible Standalone Mode

**User Story:** As a developer using the CLI standalone mode, I want the existing `node bin/cli.js` workflow to continue working after the refactor, so that no existing usage is broken.

#### Acceptance Criteria

1. WHEN `bin/cli.js` is executed, THE CLI SHALL start the Express server and open the browser as before.
2. THE `src/main.tsx` standalone entry point SHALL render `<QACenter />` with DefaultProps, replacing the previous direct composition of `QAFloatingButton` and `QADrawer`.
3. WHEN `<QACenter />` is rendered via `src/main.tsx`, THE QACenter component SHALL behave identically to the current standalone app.

---

### Requirement 11: Default Props Consistency

**User Story:** As a developer, I want all unspecified props to produce the same visual result as the current standalone app, so that existing users see no change after the refactor.

#### Acceptance Criteria

1. THE DefaultProps for `buttonColor` SHALL be `{ dark: "#7c3aed", light: "#7c3aed" }`.
2. THE DefaultProps for `buttonSize` SHALL be `52`.
3. THE DefaultProps for `shape` SHALL be `"circle"`.
4. THE DefaultProps for `logo` SHALL be `undefined`, causing the FloatingButton to render the `"QA"` text label.
5. THE DefaultProps for `name` SHALL be `"QA Center"`.
6. THE DefaultProps for `apiBaseUrl` SHALL be `"http://localhost:3333"`.
7. THE DefaultProps for `port` SHALL be `undefined`, causing the component to fall back to the `apiBaseUrl` default.

---

### Requirement 12: Controlled Export Surface

**User Story:** As a Consumer, I want the package to expose only the symbols I need, so that internal implementation details do not pollute my project's type namespace or create unexpected coupling.

#### Acceptance Criteria

1. THE PackageEntryPoint SHALL re-export `QACenter` and `QACenterProps` as named exports and SHALL NOT re-export any other symbol unless it is explicitly added to the PublicAPI.
2. THE `@purr/qa-center` package SHALL NOT export internal components (e.g. `QAFloatingButton`, `QADrawer`, `NewIssueForm`, `IssueCard`), store modules (e.g. `useQACenterStore`), service modules (e.g. `issueApiService`, `markdownIssueParser`), or utility modules (e.g. `formatters`) from the PackageEntryPoint.
3. WHEN a Consumer imports `* as QALib from "@purr/qa-center"`, THE TypeScript compiler SHALL resolve exactly the symbols `QACenter` and `QACenterProps` in the `QALib` namespace.
4. THE `package.json` `exports` field SHALL specify the PackageEntryPoint as the sole module entry so that deep imports such as `@purr/qa-center/store/useQACenterStore` are not resolvable by Consumers.

---

### Requirement 13: Namespace-Safe Exported Type Names

**User Story:** As a TypeScript Consumer, I want all exported type names to carry a `QACenter` prefix, so that they do not clash with identically named types already defined in my project.

#### Acceptance Criteria

1. THE `@purr/qa-center` package SHALL export the button color type under the name `QACenterButtonColor` rather than `ButtonColor`.
2. THE `@purr/qa-center` package SHALL export the button shape type under the name `QACenterShape` rather than `Shape` or `ButtonShape`.
3. THE `QACenterProps` interface SHALL reference `QACenterButtonColor` and `QACenterShape` for the `buttonColor` and `shape` props respectively.
4. THE `@purr/qa-center` package SHALL NOT export any type whose name is a common single-word identifier (e.g. `Props`, `Config`, `Options`, `Shape`, `Color`, `Theme`) without a `QACenter` prefix.
5. WHEN a Consumer imports `QACenterButtonColor` or `QACenterShape`, THE TypeScript compiler SHALL resolve the types without requiring additional type declarations.

---

### Requirement 14: No Global Side Effects on Import

**User Story:** As a Consumer, I want importing `@purr/qa-center` to have no GlobalSideEffects, so that the package does not interfere with my application's global state or event handling.

#### Acceptance Criteria

1. THE `@purr/qa-center` package module SHALL NOT register any `window` or `document` event listeners at module evaluation time (i.e. outside of a React component lifecycle or effect).
2. THE `@purr/qa-center` package module SHALL NOT mutate `window`, `document`, or any other globally shared object at module evaluation time.
3. THE `@purr/qa-center` package module SHALL NOT modify `globalThis` or attach properties to it at module evaluation time.
4. WHEN `<QACenter />` is unmounted, THE QACenter component SHALL remove any event listeners it registered during mounting so that no listeners remain active after unmount.
5. WHEN `<QACenter />` is unmounted, THE QACenter component SHALL not leave any timers, intervals, or pending async operations that reference the unmounted component's state.

---

### Requirement 15: CSS Isolation

**User Story:** As a Consumer, I want the component's styles to be fully isolated, so that QA Center's CSS does not override or conflict with my application's existing styles.

#### Acceptance Criteria

1. THE `@purr/qa-center` package SHALL NOT inject any global CSS rules into the Consumer's document (e.g. via `<style>` tags appended to `<head>`, `document.styleSheets`, or imported `.css` files with global selectors).
2. THE QACenter component SHALL apply all visual styles using scoped inline styles or a CSS-in-JS solution that generates unique, component-scoped class names.
3. WHEN the QACenter component is rendered, THE styles applied to its internal elements SHALL NOT affect elements outside the QACenter component's React subtree.
4. WHEN the QACenter component is unmounted, THE QACenter component SHALL remove any style nodes it injected into the document during mounting.
5. THE QACenter component SHALL NOT use CSS selectors that target HTML element types (e.g. `body`, `h1`, `button`) without scoping them to the component's own container.

---

### Requirement 16: Internal File Naming Convention

**User Story:** As a Consumer, I want the package's internal source files to follow a namespaced naming convention, so that there is no risk of filename conflicts if I happen to have files with the same names in my own project.

#### Acceptance Criteria

1. THE source files that implement internal components, services, store, and utilities SHALL reside under a `qa-center/` directory subtree (e.g. `src/features/qa-center/`) and SHALL NOT be placed at a flat top-level path that a Consumer's project is likely to use.
2. THE `@purr/qa-center` package SHALL NOT re-export the contents of `src/features/qa-center/types/index.ts` directly as the package's public types module; internal type definitions SHALL be re-exported only through the PackageEntryPoint under their namespaced names.
3. THE PackageEntryPoint file SHALL be named `index.ts` or `index.tsx` and SHALL be the only file in the package root source directory that is referenced by the `exports` field in `package.json`.

---

### Requirement 17: Single Package Entry Point

**User Story:** As a Consumer, I want the package to have exactly one entry point, so that I always know where the public API is defined and there is no ambiguity about which import path to use.

#### Acceptance Criteria

1. THE `package.json` `exports` field SHALL define exactly one entry point (`.`) that maps to the compiled PackageEntryPoint output.
2. THE PackageEntryPoint SHALL contain explicit named re-exports for every symbol in the PublicAPI and SHALL NOT use wildcard re-exports (e.g. `export * from "..."`) that could unintentionally expose internal symbols.
3. WHEN a Consumer writes `import { QACenter, QACenterProps } from "@purr/qa-center"`, THE TypeScript compiler and bundler SHALL resolve both symbols from the single PackageEntryPoint without requiring any additional path configuration.
4. THE `package.json` `main` and `module` fields, if present, SHALL point to the same compiled PackageEntryPoint output as the `exports["."]` field.
