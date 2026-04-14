import { type Locator, type Page } from "@playwright/test";

export default class NewFormPage {
  page: Page;
  addButton: Locator;
  newIssueButton: Locator;
  newFeatureButton: Locator;
  newNoteButton: Locator;
  submitButton: Locator;
  refreshButton: Locator;
  searchBar: Locator;
  listBoxPlaywright: Locator;
  issueTitle: Locator;
  description: Locator;
  severity: Locator;
  areaModule: Locator;
  reproSteps: Locator;
  expected: Locator;
  actual: Locator;
  featureTitle: Locator;
  featureDescription: Locator;
  priority: Locator;
  featureAreaModule: Locator;
  acceptanceCriteria: Locator;
  noteTitle: Locator;
  content: Locator;
  tagArea: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addButton = page.getByRole("button", { name: "+ Add " });
    this.newIssueButton = page.getByRole("button", { name: "🐛 New Issue" });
    this.newFeatureButton = page.getByTestId("qa-add-feature");
    this.newNoteButton = page.getByTestId("qa-add-note");
    this.submitButton = page.getByTestId("form-submit");
    //Issue Form
    this.refreshButton = page.getByRole("button", { name: "↻ Refresh" });
    this.searchBar = page.getByPlaceholder("Search tests...");
    this.listBoxPlaywright = page.getByTestId("test-select");
    this.issueTitle = page.getByPlaceholder("Short bug title");
    this.description = page.getByPlaceholder("What is the bug?");
    this.severity = page.getByTestId("issue-severity");
    this.areaModule = page.getByPlaceholder("e.g. auth, checkout");
    this.reproSteps = page.getByPlaceholder("1. Go to...");
    this.expected = page.getByPlaceholder("What should happen");
    this.actual = page.getByPlaceholder("What actually happens");
    //Feature Form
    this.featureTitle = page.getByPlaceholder("e.g. Dark mode toggle");
    this.featureDescription = page.getByPlaceholder("What should this feature do? Who is it for?");
    this.priority = page.getByTestId("feature-priority");
    this.featureAreaModule = page.getByPlaceholder("e.g. settings, dashboard");
    this.acceptanceCriteria = page.getByTestId("feature-acceptance-criteria");
    //Note Form
    this.noteTitle = page.getByPlaceholder("e.g. Design feedback, Meeting notes");
    this.content = page.getByTestId("note-content");
    this.tagArea = page.getByPlaceholder("e.g. design, backend, meeting");
  }

  async addIssue(
    linkedPlaywrightTest: string,
    title: string,
    description: string,
    severity: string,
    areaModule: string,
    reproSteps: string,
    expected: string,
    actual: string
  ): Promise<void> {
    await this.addButton.click();
    await this.newIssueButton.click();
    await this.refreshButton.click();
    await this.searchBar.fill(linkedPlaywrightTest);
    await this.listBoxPlaywright.selectOption("test-uzpucp");
    await this.issueTitle.fill(title);
    await this.description.fill(description);
    await this.severity.selectOption(severity);
    await this.areaModule.fill(areaModule);
    await this.reproSteps.fill(reproSteps);
    await this.expected.fill(expected);
    await this.actual.fill(actual);
    await this.submitButton.click();
  }

  async addFeature(
    name: string,
    description: string,
    priority: string,
    areaModule: string,
    acceptanceCriteria: string
  ): Promise<void> {
    await this.addButton.click();
    await this.newFeatureButton.click();
    await this.featureTitle.fill(name);
    await this.featureDescription.fill(description);
    await this.priority.selectOption(priority);
    await this.featureAreaModule.fill(areaModule);
    await this.acceptanceCriteria.fill(acceptanceCriteria);
    await this.submitButton.click();
  }

  async addNote(noteTitle: string, content: string, tagArea: string): Promise<void> {
    await this.addButton.click();
    await this.newNoteButton.click();
    await this.noteTitle.fill(noteTitle);
    await this.content.fill(content);
    await this.tagArea.fill(tagArea);
    await this.submitButton.click();
  }
}
