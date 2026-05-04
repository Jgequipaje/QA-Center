/**
 * Smoke tests — fast checks that prove the app is alive.
 * Full feature tests live in tests/ui/
 */
import { test, expect } from "@playwright/test";
import POManager from "./pageobjects/POManager";

test("@Smoke app loads and QA button is visible", async ({ page }) => {
  const poManager = new POManager(page);
  const floatingBtn = poManager.getQAFloatingButtonPage();
  await floatingBtn.goToDevServer();
  await expect(floatingBtn.qaCenter).toBeVisible();
});

test("@Smoke drawer opens on button click", async ({ page }) => {
  const poManager = new POManager(page);
  const qaDrawer = poManager.getQADrawerPage();
  await qaDrawer.goToQADrawer();
  await expect(page.getByTestId("qa-drawer")).toBeVisible();
});
