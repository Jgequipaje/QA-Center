import { Browser, type Locator, type Page } from "@playwright/test";

export class QADrawerPage {
  private readonly page: Page;
  public readonly qaCenter: Locator;
  public readonly issuesTab: Locator;
  public readonly featureTab: Locator;
  public readonly notesTab: Locator;
  public readonly cardTitle: Locator;
  public readonly category: Locator;
  public readonly closeButton: Locator;
  public readonly card: Locator;
  public readonly deleteButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.qaCenter = page.locator('button[title="QA Center"]');
    this.issuesTab = page.getByTestId("qa-tab-issue");
    this.featureTab = page.getByTestId("qa-tab-feature");
    this.notesTab = page.getByTestId("qa-tab-note");
    this.cardTitle = page
      .locator(".issueCard")
      .locator("[data-testid^='issue-card-title']")
      .first();
    this.category = page
      .locator(".issueCard")
      .locator("[data-testid^='issue-card-origin']")
      .first();
    this.closeButton = page.getByTestId("qa-drawer-close");
    this.card = page.locator('button[data-testid^="issue-card"]');
    this.deleteButton = page.getByRole("button", { name: "Delete" });
  }

  public async goToQADrawer(): Promise<void> {
    await this.page.goto("/");
    await this.qaCenter.click();
  }

  public async switchToTab(category: "issue" | "feature" | "note"): Promise<void> {
    const normalizedCategory = category.toLowerCase().trim();

    switch (normalizedCategory) {
      case "issue":
        await this.issuesTab.click();
        break;
      case "feature":
        await this.featureTab.click();
        break;
      case "note":
        await this.notesTab.click();
        break;
      default:
        throw new Error("Invalid category");
    }
  }

  public getCardByTitle(title: string): Locator {
    return this.card.filter({
      has: this.page.locator('div[data-testid^="issue-card-title"]', { hasText: title }),
    });
  }

  public getItemStatus(
    title: string,
    category: "issue" | "note" | "feature",
    status: "open" | "in_progress" | "ready_for_qa" | "verified" | "closed"
  ): Locator {
    const normalizedStatus = status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

    return this.card
      .filter({
        has: this.page.locator('div[data-testid^="issue-card-title"]', { hasText: title }),
      })
      .filter({
        has: this.page.locator("span[data-testid^='issue-card-origin']", {
          hasText: category,
        }),
      })
      .filter({
        has: this.page.locator("span[data-testid^='issue-card-status']", {
          hasText: normalizedStatus,
        }),
      });
  }

  public async deleteItem(card: Locator): Promise<void> {
    await card.click();
    await this.deleteButton.click();
    this.page.on("dialog", (dialog) => dialog.accept());
  }
}
