import { uiTest, expect } from "../utils/fixtures/ui.fixture";
import { features, featuresMissingTitle } from "../utils/testdata/featuresTestData";

uiTest.describe("@CreateFunctions @AddFeature Create Feature", () => {
  let createdItemId: string | null = null;

  uiTest.afterEach(async ({ qaItemsClient }) => {
    if (createdItemId) {
      await qaItemsClient.deleteItemById(createdItemId);
      createdItemId = null;
    }
  });

  for (const feature of features) {
    uiTest(
      `Should appear under Features tab when ${feature.name} is added`,
      async ({ newFormPage, qaDrawer, goToQADrawer, qaItemsClient, page }) => {
        await goToQADrawer();

        const uniqueFeature = {
          ...feature,
          name: `${feature.name} ${Date.now()}-${Math.random().toString(36).substring(7)}`,
        };

        await newFormPage.addFeature(uniqueFeature);

        // Wait for form to close (indicates successful submission)
        await expect(newFormPage.submitButton).not.toBeVisible({ timeout: 5000 });

        // If detail panel opened, close it
        const detailClose = page.getByTestId("detail-close");
        if (await detailClose.isVisible()) {
          await detailClose.click();
        }

        // Ensure we're on the Features tab
        await qaDrawer.switchToTab("feature");

        // Wait for the item to appear in the list
        await expect(qaDrawer.getCardByTitle(uniqueFeature.name!)).toBeVisible({ timeout: 15000 });

        // Store ID for cleanup
        const response = await qaItemsClient.getQAItems({ origin: "feature" });
        const data: { id: string; title: string }[] = await response.json();
        const created = data.find((item) => item.title === uniqueFeature.name);
        if (created) {
          createdItemId = created.id;
        }
      }
    );
  }

  for (const missingTitle of featuresMissingTitle) {
    uiTest(
      `Should show a validation error when title is empty [${missingTitle.id}]`,
      async ({ newFormPage, goToQADrawer }) => {
        await goToQADrawer();
        await newFormPage.addFeature(missingTitle);

        // Verify validation error appears
        await expect(newFormPage.getValidationBannerByTitle("title")).toBeVisible();

        // Verify form is still open (submission failed)
        await expect(newFormPage.submitButton).toBeVisible();
      }
    );
  }
});
