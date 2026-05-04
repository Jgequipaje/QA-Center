import { type Locator, type Page } from "@playwright/test";
import {
  type AddNoteOptionsType,
  type AddFeatureOptionsType,
  type AddIssueOptionsType,
} from "../utils/types/types";

export default class NewFormPage {
  private readonly page: Page;
  public readonly addButton: Locator;
  public readonly newIssueButton: Locator;
  public readonly newFeatureButton: Locator;
  public readonly newNoteButton: Locator;
  public readonly submitButton: Locator;
  public readonly refreshButton: Locator;
  public readonly searchBar: Locator;
  public readonly listBoxPlaywright: Locator;
  public readonly issueTitle: Locator;
  public readonly description: Locator;
  public readonly severity: Locator;
  public readonly areaModule: Locator;
  public readonly reproSteps: Locator;
  public readonly expected: Locator;
  public readonly actual: Locator;
  public readonly featureTitle: Locator;
  public readonly featureDescription: Locator;
  public readonly priority: Locator;
  public readonly featureAreaModule: Locator;
  public readonly acceptanceCriteria: Locator;
  public readonly noteTitle: Locator;
  public readonly content: Locator;
  public readonly tagArea: Locator;
  public readonly errorBanner: Locator;

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
    //Validation
    this.errorBanner = page.getByTestId("form-error-banner");
  }

  public async addIssue(options: AddIssueOptionsType = {}): Promise<void> {
    const {
      linkedPlaywrightTest,
      title,
      description,
      severity,
      areaModule,
      reproSteps,
      expected,
      actual,
    } = options;

    await this.addButton.click();
    await this.newIssueButton.click();

    if (linkedPlaywrightTest) {
      await this.refreshButton.click();
      await this.searchBar.fill(linkedPlaywrightTest);
      await this.listBoxPlaywright.selectOption({ label: linkedPlaywrightTest });
    }

    if (title) await this.issueTitle.fill(title);
    if (description) await this.description.fill(description);
    if (severity) await this.severity.selectOption(severity);
    if (areaModule) await this.areaModule.fill(areaModule);
    if (reproSteps) await this.reproSteps.fill(reproSteps);
    if (expected) await this.expected.fill(expected);
    if (actual) await this.actual.fill(actual);

    await this.submitButton.click();
  }

  public async addFeature(options: AddFeatureOptionsType): Promise<void> {
    const { name, description, priority, areaModule, acceptanceCriteria } = options;

    await this.addButton.click();
    await this.newFeatureButton.click();

    if (name) await this.featureTitle.fill(name);
    if (description) await this.featureDescription.fill(description);
    if (priority) await this.priority.selectOption(priority);
    if (areaModule) await this.featureAreaModule.fill(areaModule);
    if (acceptanceCriteria) await this.acceptanceCriteria.fill(acceptanceCriteria);

    await this.submitButton.click();
  }

  public async addNote(options: AddNoteOptionsType): Promise<void> {
    const { title, content, tagArea } = options;

    await this.addButton.click();
    await this.newNoteButton.click();

    if (title) await this.noteTitle.fill(title);
    if (content) await this.content.fill(content);
    if (tagArea) await this.tagArea.fill(tagArea);

    await this.submitButton.click();
  }

  public async openNewForm(category: string): Promise<void> {
    switch (category.trim().toLowerCase()) {
      case "issue":
        await this.addButton.click();
        await this.newIssueButton.click();
        await this.submitButton.click();
        break;
      case "feature":
        await this.addButton.click();
        await this.newFeatureButton.click();
        await this.submitButton.click();
        break;
      case "note":
        await this.addButton.click();
        await this.newNoteButton.click();
        await this.submitButton.click();
        break;
      default:
        throw new Error("Invalid category input");
    }
  }

  public getValidationBannerByTitle(title: "title" | "description" | "content"): Locator {
    return this.errorBanner.filter({ hasText: title.trim().toLowerCase() });
  }
}
