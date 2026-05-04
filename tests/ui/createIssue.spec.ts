import { uiTest, expect } from "../utils/fixtures/ui.fixture";
import {
  issues,
  issuesMissingTitle,
  issuesMissingDescription,
} from "../utils/testdata/issuesTestData";

uiTest.describe("@CreateFunctions @AddIssue Create Issue", () => {
  let createdItemId: string | null = null;

  uiTest.afterEach(async ({ qaItemsClient }) => {
    if (createdItemId) {
      await qaItemsClient.deleteItemById(createdItemId);
      createdItemId = null;
    }
  });

  for (const issue of issues) {
    uiTest(
      `Should appear under Issues tab when ${issue.title} is added`,
      async ({ newFormPage, qaDrawer, goToQADrawer, qaItemsClient, page }) => {
        await goToQADrawer();

        const uniqueIssue = {
          ...issue,
          title: `${issue.title} ${Date.now()}-${Math.random().toString(36).substring(7)}`,
        };

        await newFormPage.addIssue(uniqueIssue);

        // Wait for form to close (indicates successful submission)
        await expect(newFormPage.submitButton).not.toBeVisible({ timeout: 5000 });

        // If detail panel opened, close it
        const detailClose = page.getByTestId("detail-close");
        if (await detailClose.isVisible()) {
          await detailClose.click();
        }

        // Ensure we're on the Issues tab
        await qaDrawer.switchToTab("issue");

        // Wait for the item to appear in the list
        await expect(qaDrawer.getCardByTitle(uniqueIssue.title!)).toBeVisible({ timeout: 15000 });

        // Store ID for cleanup
        const response = await qaItemsClient.getQAItems({ origin: "issue" });
        const data: { id: string; title: string }[] = await response.json();
        const created = data.find((item) => item.title === uniqueIssue.title);
        if (created) {
          createdItemId = created.id;
        }
      }
    );
  }

  for (const missingTitle of issuesMissingTitle) {
    uiTest(
      `Should show a validation error when title is empty [${missingTitle.id}]`,
      async ({ newFormPage, goToQADrawer }) => {
        await goToQADrawer();
        await newFormPage.addIssue(missingTitle);

        await expect(newFormPage.getValidationBannerByTitle("title")).toBeVisible();

        await expect(newFormPage.submitButton).toBeVisible();
      }
    );
  }

  for (const missingDescription of issuesMissingDescription) {
    uiTest(
      `Should show a validation error when description is empty [${missingDescription.id}]`,
      async ({ newFormPage, goToQADrawer }) => {
        await goToQADrawer();
        await newFormPage.addIssue(missingDescription);

        await expect(newFormPage.getValidationBannerByTitle("description")).toBeVisible();

        await expect(newFormPage.submitButton).toBeVisible();
      }
    );
  }
});
