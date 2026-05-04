export interface NoteTestData {
  id: string;
  title: string;
  content?: string;
  tagArea: string;
}

export const notes: NoteTestData[] = [
  {
    id: "note-001",
    title: "Sprint 3 QA kickoff notes",
    content:
      "Discussed testing scope for sprint 3.\n- Auth flow needs regression\n- Import feature is new, needs full coverage\n- Dashboard empty state flagged as risk",
    tagArea: "meeting",
  },
  {
    id: "note-002",
    title: "Design feedback — drawer layout",
    content:
      "The drawer feels cramped on mobile viewports.\n- Consider collapsible filter bar\n- Status pills wrap awkwardly below 375px\n- Font size on badges too small at 10px",
    tagArea: "design",
  },
  {
    id: "note-003",
    title: "Backend API edge cases to verify",
    content:
      "- What happens when qa-issues.json is corrupted?\n- PATCH with unknown fields — are they silently ignored?\n- DELETE on already-deleted ID returns 404 ✓",
    tagArea: "backend",
  },
  {
    id: "note-004",
    title: "Playwright test coverage gaps",
    content:
      "Currently missing tests for:\n- Status transitions (open → verified)\n- Delete issue flow\n- Import markdown happy path\n- Run Test button in detail panel",
    tagArea: "qa",
  },
  {
    id: "note-005",
    title: "Accessibility checklist",
    content:
      "Items to check before v1 release:\n- All buttons have accessible labels\n- Drawer focus trap working\n- Color contrast passes WCAG AA\n- Keyboard navigation through issue list",
    tagArea: "accessibility",
  },
];

export const notesMissingContent: NoteTestData[] = [
  {
    id: "note-001",
    title: "Sprint 3 QA kickoff notes",
    tagArea: "meeting",
  },
  {
    id: "note-002",
    title: "Design feedback — drawer layout",
    tagArea: "design",
  },
  {
    id: "note-003",
    title: "Backend API edge cases to verify",
    tagArea: "backend",
  },
  {
    id: "note-004",
    title: "Playwright test coverage gaps",
    tagArea: "qa",
  },
  {
    id: "note-005",
    title: "Accessibility checklist",
    tagArea: "accessibility",
  },
];
