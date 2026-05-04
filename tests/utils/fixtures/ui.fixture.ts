import { test as base, request } from "@playwright/test";
import POManager from "../../pageobjects/POManager";
import { QAItemsClient } from "../../framework/api/clients/qaItemsClient";

export const uiTest = base.extend<{
  poManager: POManager;
  qaDrawer: ReturnType<POManager["getQADrawerPage"]>;
  newFormPage: ReturnType<POManager["getNewFormPage"]>;
  goToQADrawer: () => Promise<void>;
  qaItemsClient: QAItemsClient;
}>({
  poManager: async ({ page }, use) => {
    await use(new POManager(page));
  },

  qaDrawer: async ({ poManager }, use) => {
    await use(poManager.getQADrawerPage());
  },

  newFormPage: async ({ poManager }, use) => {
    await use(poManager.getNewFormPage());
  },

  goToQADrawer: async ({ qaDrawer }, use) => {
    await use(() => qaDrawer.goToQADrawer());
  },

  qaItemsClient: async ({}, use) => {
    const apiContext = await request.newContext({
      baseURL: "http://localhost:3333",
    });
    await use(new QAItemsClient(apiContext));
    await apiContext.dispose();
  },
});

export { expect } from "@playwright/test";
