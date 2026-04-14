import { APIRequestContext, Page } from "@playwright/test";
import { QAFloatingButtonPage } from "./QAFloatingButtonPage";
import { QADrawerPage } from "./QADrawerPage";
import NewFormPage from "./NewFormPage";

export default class POManager {
  page: Page;
  request?: APIRequestContext;
  qaFloatingButtonPage: QAFloatingButtonPage;
  qaDrawerPage: QADrawerPage;
  newFormPage: NewFormPage;
  constructor(page: Page, request?: APIRequestContext) {
    this.page = page;
    this.request = request;
    this.qaFloatingButtonPage = new QAFloatingButtonPage(this.page, this.request);
    this.qaDrawerPage = new QADrawerPage(this.page);
    this.newFormPage = new NewFormPage(this.page);
  }

  getQAFloatingButtonPage() {
    return this.qaFloatingButtonPage;
  }

  getQADrawerPage() {
    return this.qaDrawerPage;
  }

  getNewFormPage() {
    return this.newFormPage;
  }
}
