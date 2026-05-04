import { test as base, request } from "@playwright/test";
import { QAItemsClient } from "../../framework/api/clients/qaItemsClient";

export const apiTest = base.extend<{ qaItemsClient: QAItemsClient }>({
  // eslint-disable-next-line no-empty-pattern
  qaItemsClient: async ({}, use) => {
    const apiContext = await request.newContext({
      baseURL: "http://localhost:3333",
    });

    await use(new QAItemsClient(apiContext));
    await apiContext.dispose();
  },
});

export { expect } from "@playwright/test";
