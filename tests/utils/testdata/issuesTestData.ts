export interface IssueTestData {
  id: string;
  linkedPlaywrightTest: string;
  title?: string;
  description?: string;
  severity: "Critical" | "High" | "Medium" | "Low" | "Info";
  areaModule: string;
  reproSteps: string;
  expected: string;
  actual: string;
}

export const issueSingleData: IssueTestData[] = [
  {
    id: "issue-005",
    linkedPlaywrightTest: "GET response contains issues summary",
    title: `Issue Single Test Data ${Date.now()}`,
    description: "Issue Single Test Data",
    severity: "High",
    areaModule: "Test",
    reproSteps: "Test",
    expected: "Test",
    actual: "Test",
  },
];

export const issues: IssueTestData[] = [
  {
    id: "issue-001",
    linkedPlaywrightTest: "GET response contains issues summary",
    title: "Login button unresponsive on Safari",
    description: "The login button does not respond to clicks on Safari 17",
    severity: "High",
    areaModule: "auth",
    reproSteps: "1. Open Safari\n2. Navigate to /login\n3. Click the Login button",
    expected: "User is redirected to dashboard",
    actual: "Nothing happens, no error shown",
  },
  {
    id: "issue-002",
    linkedPlaywrightTest: "GET response contains issues summary",
    title: "Dashboard crashes on empty data",
    description: "Dashboard throws a white screen when the user has no issues logged",
    severity: "Critical",
    areaModule: "dashboard",
    reproSteps: "1. Create a new account\n2. Navigate to /dashboard",
    expected: "Empty state UI is shown",
    actual: "Page crashes with uncaught TypeError",
  },
  {
    id: "issue-003",
    linkedPlaywrightTest: "GET response contains issues summary",
    title: "Search input not debounced",
    description: "Typing quickly in the search box fires too many API requests",
    severity: "Medium",
    areaModule: "search",
    reproSteps: "1. Open the drawer\n2. Type rapidly in the search box\n3. Check network tab",
    expected: "One request fired after typing stops",
    actual: "A request fires on every keystroke",
  },
  {
    id: "issue-004",
    linkedPlaywrightTest: "GET response contains issues summary",
    title: "Severity badge missing on imported issues",
    description: "Issues imported from markdown do not display a severity badge in the card",
    severity: "Low",
    areaModule: "import",
    reproSteps: "1. Import a markdown file with issues\n2. View the issue cards",
    expected: "Severity badge visible on each card",
    actual: "Badge is missing for imported issues",
  },
  {
    id: "issue-005",
    linkedPlaywrightTest: "GET response contains issues summary",
    title: "Tooltip missing on draggable button",
    description: "The floating QA button has no tooltip explaining what it does",
    severity: "Info",
    areaModule: "ui",
    reproSteps: "1. Hover over the floating button",
    expected: "Tooltip appears with a description",
    actual: "No tooltip shown",
  },
];

export const issuesMissingDescription: IssueTestData[] = [
  {
    id: "issue-001",
    linkedPlaywrightTest: "GET response contains issues summary",
    title: "Login button unresponsive on Safari",
    severity: "High",
    areaModule: "auth",
    reproSteps: "1. Open Safari\n2. Navigate to /login\n3. Click the Login button",
    expected: "User is redirected to dashboard",
    actual: "Nothing happens, no error shown",
  },
  {
    id: "issue-002",
    linkedPlaywrightTest: "GET response contains issues summary",
    title: "Dashboard crashes on empty data",
    severity: "Critical",
    areaModule: "dashboard",
    reproSteps: "1. Create a new account\n2. Navigate to /dashboard",
    expected: "Empty state UI is shown",
    actual: "Page crashes with uncaught TypeError",
  },
  {
    id: "issue-003",
    linkedPlaywrightTest: "GET response contains issues summary",
    title: "Search input not debounced",
    severity: "Medium",
    areaModule: "search",
    reproSteps: "1. Open the drawer\n2. Type rapidly in the search box\n3. Check network tab",
    expected: "One request fired after typing stops",
    actual: "A request fires on every keystroke",
  },
  {
    id: "issue-004",
    linkedPlaywrightTest: "GET response contains issues summary",
    title: "Severity badge missing on imported issues",
    severity: "Low",
    areaModule: "import",
    reproSteps: "1. Import a markdown file with issues\n2. View the issue cards",
    expected: "Severity badge visible on each card",
    actual: "Badge is missing for imported issues",
  },
  {
    id: "issue-005",
    linkedPlaywrightTest: "GET response contains issues summary",
    title: "Tooltip missing on draggable button",
    severity: "Info",
    areaModule: "ui",
    reproSteps: "1. Hover over the floating button",
    expected: "Tooltip appears with a description",
    actual: "No tooltip shown",
  },
];

export const issuesMissingTitle: IssueTestData[] = [
  {
    id: "issue-001",
    linkedPlaywrightTest: "GET response contains issues summary",
    description: "The login button does not respond to clicks on Safari 17",
    severity: "High",
    areaModule: "auth",
    reproSteps: "1. Open Safari\n2. Navigate to /login\n3. Click the Login button",
    expected: "User is redirected to dashboard",
    actual: "Nothing happens, no error shown",
  },
  {
    id: "issue-002",
    linkedPlaywrightTest: "GET response contains issues summary",
    description: "Dashboard throws a white screen when the user has no issues logged",
    severity: "Critical",
    areaModule: "dashboard",
    reproSteps: "1. Create a new account\n2. Navigate to /dashboard",
    expected: "Empty state UI is shown",
    actual: "Page crashes with uncaught TypeError",
  },
  {
    id: "issue-003",
    linkedPlaywrightTest: "GET response contains issues summary",
    description: "Typing quickly in the search box fires too many API requests",
    severity: "Medium",
    areaModule: "search",
    reproSteps: "1. Open the drawer\n2. Type rapidly in the search box\n3. Check network tab",
    expected: "One request fired after typing stops",
    actual: "A request fires on every keystroke",
  },
  {
    id: "issue-004",
    linkedPlaywrightTest: "GET response contains issues summary",
    description: "Issues imported from markdown do not display a severity badge in the card",
    severity: "Low",
    areaModule: "import",
    reproSteps: "1. Import a markdown file with issues\n2. View the issue cards",
    expected: "Severity badge visible on each card",
    actual: "Badge is missing for imported issues",
  },
  {
    id: "issue-005",
    linkedPlaywrightTest: "GET response contains issues summary",
    description: "The floating QA button has no tooltip explaining what it does",
    severity: "Info",
    areaModule: "ui",
    reproSteps: "1. Hover over the floating button",
    expected: "Tooltip appears with a description",
    actual: "No tooltip shown",
  },
];
