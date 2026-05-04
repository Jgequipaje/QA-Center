import {
  validateQAItemStructure,
  validateTimeStamp,
} from "../framework/api/validators/qaItemValidators";
import { apiTest, expect } from "../utils/fixtures/api.fixture";

apiTest.describe("@API Issues API", () => {
  // GET /api/qa-items
  apiTest(
    "Should return 200 and an array when GET /api/qa-items is called",
    async ({ qaItemsClient }) => {
      const response = await qaItemsClient.getQAItems();
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBeTruthy();
      for (const item of data) {
        validateQAItemStructure(item);
        validateTimeStamp(item.createdAt);
      }
    }
  );

  // POST /api/qa-items
  apiTest(
    "Should return 201 and a single item when POST /api/qa-items is called",
    async ({ qaItemsClient }) => {
      const uniqueTitle = `API Test ${Date.now()}-${Math.random().toString(36).substring(7)}`;

      const response = await qaItemsClient.createItem({
        origin: "feature",
        title: uniqueTitle,
        status: "open",
        description: "User can switch between dark and light mode",
        severity: "high",
        area: "settings",
        notes: "- Given user is on settings\n- When they toggle theme\n- Then UI updates",
      });

      expect(response.status()).toBe(201);
      const data = await response.json();

      // Validate single item, not array
      validateQAItemStructure(data);
      validateTimeStamp(data.createdAt);

      // Verify specific fields
      expect(data.origin).toBe("feature");
      expect(data.title).toBe(uniqueTitle);

      // Cleanup
      await qaItemsClient.deleteItemById(data.id);
    }
  );

  apiTest(
    "Should return 400 when POST /api/qa-items with missing title",
    async ({ qaItemsClient }) => {
      const response = await qaItemsClient.createItem({
        origin: "issue",
        status: "open",
        description: "sample description",
        severity: "critical",
        area: "dark mode",
        reproSteps: "test",
        expected: "test",
        actual: "test",
      });
      expect(response.status()).toBe(400);
      const data = await response.json();
      expect(data.error).toEqual("Title is required.");
    }
  );

  apiTest(
    "Should return 400 when POST /api/qa-items with invalid severity",
    async ({ qaItemsClient }) => {
      const response = await qaItemsClient.createItemRaw({
        title: "Dark Mode",
        origin: "issue",
        status: "open",
        description: "sample description",
        severity: "go lang",
        area: "dark mode",
        reproSteps: "test",
        expected: "test",
        actual: "test",
      });
      expect(response.status()).toBe(400);
      const data = await response.json();
      expect(data.error).toEqual("Invalid severity value.");
    }
  );

  apiTest(
    "Should return 400 when POST /api/qa-items with invalid status",
    async ({ qaItemsClient }) => {
      const response = await qaItemsClient.createItemRaw({
        title: "Dark Mode",
        origin: "issue",
        status: "opened",
        description: "sample description",
        severity: "critical",
        area: "dark mode",
        reproSteps: "test",
        expected: "test",
        actual: "test",
      });
      expect(response.status()).toBe(400);
      const data = await response.json();
      expect(data.error).toEqual("Invalid status value.");
    }
  );

  apiTest(
    "Should return 400 when POST /api/qa-items with invalid origin",
    async ({ qaItemsClient }) => {
      const response = await qaItemsClient.createItemRaw({
        title: "Dark Mode",
        origin: "chismis",
        status: "open",
        description: "sample description",
        severity: "critical",
        area: "dark mode",
        reproSteps: "test",
        expected: "test",
        actual: "test",
      });
      expect(response.status()).toBe(400);
      const data = await response.json();
      expect(data.error).toEqual("Invalid origin value.");
    }
  );

  // PATCH /api/qa-items/:id
  apiTest("Should return 200 when PATCH /api/qa-items/:id is called", async ({ qaItemsClient }) => {
    const uniqueTitle = `Sample Test ${Date.now()}-${Math.random().toString(36).substring(7)}`;

    const createIssueResponse = await qaItemsClient.createItem({
      origin: "issue",
      status: "open",
      title: uniqueTitle,
      description: "sample description",
      severity: "critical",
      area: "dark mode",
      reproSteps: "test",
      expected: "test",
      actual: "test",
    });
    const createdIssueJSON = await createIssueResponse.json();
    const createdIssueId = createdIssueJSON.id;

    const response = await qaItemsClient.editItemById(createdIssueId, {
      title: `${uniqueTitle} - Edited`,
    });
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toMatchObject({ origin: "issue", title: `${uniqueTitle} - Edited` });

    // Cleanup
    await qaItemsClient.deleteItemById(createdIssueId);
  });

  apiTest(
    "Should return 404 when PATCH /api/qa-items/:id is called and cannot find that id",
    async ({ qaItemsClient }) => {
      const response = await qaItemsClient.editItemById("issue-nonexistent-000", {
        title: "dsad - edited",
        status: "closed",
        description: "sadas - edited",
        area: "sadas - edited",
      });
      expect(response.status()).toBe(404);
      const data = await response.json();
      expect(data.error).toEqual("Not found.");
    }
  );

  // DELETE /api/qa-items/:id
  apiTest(
    "Should return 200 when DELETE /api/qa-items/:id is called",
    async ({ qaItemsClient }) => {
      const uniqueTitle = `API Test For Deletion ${Date.now()}-${Math.random().toString(36).substring(7)}`;

      const response = await qaItemsClient.createItem({
        origin: "feature",
        title: uniqueTitle,
        status: "open",
        description: "User can switch between dark and light mode",
        severity: "high",
        area: "settings",
        notes: "- Given user is on settings\n- When they toggle theme\n- Then UI updates",
      });
      expect(response.status()).toBe(201);
      const data = await response.json();

      expect((await qaItemsClient.getQAItem(data.id)).status()).toBe(200);

      const deleteItemResponse = await qaItemsClient.deleteItemById(data.id);
      expect(deleteItemResponse.status()).toBe(200);

      expect((await qaItemsClient.getQAItem(data.id)).status()).toBe(404);
    }
  );

  apiTest(
    "Should return 404 when DELETE /api/qa-items/:id is called and cannot find that id",
    async ({ qaItemsClient }) => {
      const response = await qaItemsClient.deleteItemById("issue-1776500282552-d3522e5d");
      const body = await response.json();
      expect(response.status()).toBe(404);
      expect(body.error).toBe("Not found.");
    }
  );
});
