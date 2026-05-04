import { APIRequestContext, Page } from "@playwright/test";
import { QAFloatingButtonPage } from "./QAFloatingButtonPage";
import { QADrawerPage } from "./QADrawerPage";
import NewFormPage from "./NewFormPage";

export default class POManager {
  private readonly page: Page;
  private readonly request?: APIRequestContext;
  private readonly qaFloatingButtonPage: QAFloatingButtonPage;
  private readonly qaDrawerPage: QADrawerPage;
  private readonly newFormPage: NewFormPage;

  constructor(page: Page, request?: APIRequestContext) {
    this.page = page;
    this.request = request;
    this.qaFloatingButtonPage = new QAFloatingButtonPage(this.page, this.request);
    this.qaDrawerPage = new QADrawerPage(this.page);
    this.newFormPage = new NewFormPage(this.page);
  }

  public getQAFloatingButtonPage(): QAFloatingButtonPage {
    return this.qaFloatingButtonPage;
  }

  public getQADrawerPage(): QADrawerPage {
    return this.qaDrawerPage;
  }

  public getNewFormPage(): NewFormPage {
    return this.newFormPage;
  }
}
