import { uiTest, expect } from "../utils/fixtures/ui.fixture";
import { notes, notesMissingContent } from "../utils/testdata/notesTestData";

uiTest.describe("@CreateFunctions @AddNote Create Note", () => {
  let createdItemId: string | null = null;

  uiTest.afterEach(async ({ qaItemsClient }) => {
    if (createdItemId) {
      await qaItemsClient.deleteItemById(createdItemId);
      createdItemId = null;
    }
  });

  for (const note of notes) {
    uiTest(
      `Should appear under Notes tab when ${note.title} is added`,
      async ({ newFormPage, goToQADrawer, qaDrawer, qaItemsClient, page }) => {
        await goToQADrawer();

        const uniqueNote = {
          ...note,
          title: `${note.title} ${Date.now()}-${Math.random().toString(36).substring(7)}`,
        };

        await newFormPage.addNote(uniqueNote);

        // Wait for form to close (indicates successful submission)
        await expect(newFormPage.submitButton).not.toBeVisible({ timeout: 5000 });

        // If detail panel opened, close it
        const detailClose = page.getByTestId("detail-close");
        if (await detailClose.isVisible()) {
          await detailClose.click();
        }

        // Ensure we're on the Notes tab
        await qaDrawer.switchToTab("note");

        // Wait for the item to appear in the list
        await expect(qaDrawer.getCardByTitle(uniqueNote.title!)).toBeVisible({ timeout: 15000 });

        // Store ID for cleanup
        const response = await qaItemsClient.getQAItems({ origin: "note" });
        const data: { id: string; title: string }[] = await response.json();
        const created = data.find((item) => item.title === uniqueNote.title);
        if (created) {
          createdItemId = created.id;
        }
      }
    );
  }

  for (const missingContent of notesMissingContent) {
    uiTest(
      `Should show a validation error when content is empty [${missingContent.id}]`,
      async ({ newFormPage, goToQADrawer }) => {
        await goToQADrawer();
        await newFormPage.addNote(missingContent);

        // Verify validation error appears
        await expect(newFormPage.getValidationBannerByTitle("content")).toBeVisible();

        // Verify form is still open (submission failed)
        await expect(newFormPage.submitButton).toBeVisible();
      }
    );
  }
});
