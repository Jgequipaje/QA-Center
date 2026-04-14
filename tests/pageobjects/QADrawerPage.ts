import { type Locator, type Page } from "@playwright/test";

export class QADrawerPage {
  page: Page;
  qaCenter: Locator;

  constructor(page: Page) {
    this.page = page;
    this.qaCenter = page.locator('button[title="QA Center"]');
  }

  async goToQADrawer(): Promise<void> {
    await this.page.goto("http://localhost:5173/");
    await this.qaCenter.click();
  }
}
