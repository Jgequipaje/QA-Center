import { apiUiTest, expect } from "../utils/fixtures/apiUi.fixture";
import { issueSingleData } from "../utils/testdata/issuesTestData";

apiUiTest.describe("@APIxUI Issue Visibility", () => {
  let createdItemId: string | null = null;

  apiUiTest.afterEach(async ({ qaItemsClient }) => {
    if (createdItemId) {
      await qaItemsClient.deleteItemById(createdItemId);
      createdItemId = null;
    }
  });

  apiUiTest(
    "Should Create an Issue via API and appears in the drawer when valid inputs",
    async ({ qaItemsClient, qaDrawer }) => {
      const response = await qaItemsClient.createItem({
        origin: "issue",
        status: "open",
        title: `API X UI Issue ${Date.now()}-${Math.random().toString(36).substring(7)}`,
        description: "API X UI Issue",
        severity: "critical",
        area: "dark mode",
        reproSteps: "test",
        expected: "test",
        actual: "test",
      });
      expect(response.status()).toBe(201);

      const data = await response.json();
      createdItemId = data.id;

      await qaDrawer.goToQADrawer();
      await qaDrawer.switchToTab(data.origin);
      await expect(qaDrawer.getCardByTitle(data.title)).toBeVisible({ timeout: 10000 });
    }
  );

  apiUiTest(
    "Should Delete an Issue via API and disappears from the drawer",
    async ({ qaItemsClient, qaDrawer }) => {
      const response = await qaItemsClient.createItem({
        origin: "issue",
        status: "open",
        title: `API X UI Delete An Issue ${Date.now()}-${Math.random().toString(36).substring(7)}`,
        description: "API X UI Issue",
        severity: "critical",
        area: "dark mode",
        reproSteps: "test",
        expected: "test",
        actual: "test",
      });
      expect(response.status()).toBe(201);

      const data = await response.json();

      await qaDrawer.goToQADrawer();
      await qaDrawer.switchToTab(data.origin);
      await expect(qaDrawer.getCardByTitle(data.title)).toBeVisible();

      const responseDelete = await qaItemsClient.deleteItemById(data.id);
      expect(responseDelete.status()).toBe(200);

      // Wait for item to disappear (polling will refresh)
      await expect(qaDrawer.getCardByTitle(data.title)).not.toBeVisible({ timeout: 10000 });
    }
  );

  apiUiTest(
    "Should Edit Status via API and reflects in the drawer",
    async ({ qaItemsClient, qaDrawer }) => {
      const response = await qaItemsClient.createItem({
        origin: "feature",
        title: `API X UI Test For PATCH ${Date.now()}-${Math.random().toString(36).substring(7)}`,
        status: "open",
        description: "User can switch between dark and light mode",
        severity: "high",
        area: "settings",
        notes: "- Given user is on settings\n- When they toggle theme\n- Then UI updates",
      });
      expect(response.status()).toBe(201);

      const data = await response.json();
      createdItemId = data.id;

      expect((await qaItemsClient.getQAItem(data.id)).status()).toBe(200);

      const editResponse = await qaItemsClient.editItemById(data.id, {
        status: "ready_for_qa",
      });
      expect(editResponse.status()).toBe(200);
      const editResponseJSON = await editResponse.json();

      await qaDrawer.goToQADrawer();
      await expect(
        qaDrawer.getItemStatus(
          editResponseJSON.title,
          editResponseJSON.origin,
          editResponseJSON.status
        )
      ).toBeVisible({ timeout: 10000 });
    }
  );

  apiUiTest(
    "Should Create an Issue via UI persists in GET /api/qa-items",
    async ({ qaItemsClient, qaDrawer, newFormPage }) => {
      const uniqueIssue = {
        ...issueSingleData[0],
        title: `${issueSingleData[0].title} ${Date.now()}-${Math.random().toString(36).substring(7)}`,
      };

      await qaDrawer.goToQADrawer();
      await newFormPage.addIssue(uniqueIssue);

      // Wait for form to close
      await expect(newFormPage.submitButton).not.toBeVisible({ timeout: 5000 });

      const response = await qaItemsClient.getQAItems();
      expect(response.status()).toBe(200);

      const data = await response.json();
      const found = data.find(
        (item: { title: string | undefined }) => item.title === uniqueIssue.title
      );
      expect(found).toBeDefined();
      createdItemId = found.id;
    }
  );
});
