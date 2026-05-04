import {
  type APIRequestContext,
  type APIResponse,
  type Locator,
  type Page,
} from "@playwright/test";

export class QAFloatingButtonPage {
  private readonly page: Page;
  public readonly qaCenter: Locator;
  private readonly request?: APIRequestContext;

  constructor(page: Page, request?: APIRequestContext) {
    this.page = page;
    this.request = request;
    this.qaCenter = page.locator('button[title="QA Center"]');
  }

  public async goToDevServer(): Promise<void> {
    await this.page.goto("/");
  }

  public async getResponseNeko(): Promise<APIResponse> {
    if (!this.request) throw new Error("request context is required for getResponseNeko");
    return await this.request.get("http://localhost:3333/oneko.gif");
  }

  public async getQAFloatingButton(): Promise<Locator> {
    return this.qaCenter;
  }
}
