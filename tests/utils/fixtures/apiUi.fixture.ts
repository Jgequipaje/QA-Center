import { test as base, request as playwrightRequest } from "@playwright/test";
import { QAItemsClient } from "../../framework/api/clients/qaItemsClient";
import POManager from "../../pageobjects/POManager";

export const apiUiTest = base.extend<{
  qaItemsClient: QAItemsClient;
  poManager: POManager;
  qaDrawer: ReturnType<POManager["getQADrawerPage"]>;
  newFormPage: ReturnType<POManager["getNewFormPage"]>;
}>({
  // eslint-disable-next-line no-empty-pattern
  qaItemsClient: async ({}, use) => {
    const apiContext = await playwrightRequest.newContext({
      baseURL: "http://localhost:3333",
    });
    await use(new QAItemsClient(apiContext));
    await apiContext.dispose();
  },

  poManager: async ({ page }, use) => {
    await use(new POManager(page));
  },

  qaDrawer: async ({ poManager }, use) => {
    await use(poManager.getQADrawerPage());
  },

  newFormPage: async ({ poManager }, use) => {
    await use(poManager.getNewFormPage());
  },
});

export { expect } from "@playwright/test";
