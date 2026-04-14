import { test, expect } from "@playwright/test";
import POManager from "./pageobjects/POManager";

test("@QAFloatingButton QA Button and Neko are Visible", async ({ page, request }) => {
  const poManager = new POManager(page, request);
  const qaCenterButton = poManager.getQAFloatingButtonPage();
  await qaCenterButton.goToDevServer();
  const qaFloatingButton = qaCenterButton.getQAFloatingButton;
  const response = await qaCenterButton.getResponseNeko();
  expect(response.ok()).toBeTruthy();
  expect(qaFloatingButton).toBeTruthy();
});

test("@CreateFunctions @AddIssue Can Add Issue", async ({ page }) => {
  const linkedPlaywrightTest = "QA Button and Neko are Visible";
  const issueTitle = "Test 3 - POManager";
  const issueDescription = "Test Add Issue Desc";
  const issueSeverity = "Info";
  const issueAreaModule = "Area Module Test";
  const issueReproSteps = "1. Test ReproSteps";
  const issueExpected = "Test Playwright";
  const issueActual = "Test 1";

  const poManager = new POManager(page);
  const qaDrawer = poManager.getQADrawerPage();
  const newFormPage = poManager.getNewFormPage();
  await qaDrawer.goToQADrawer();
  await newFormPage.addIssue(
    linkedPlaywrightTest,
    issueTitle,
    issueDescription,
    issueSeverity,
    issueAreaModule,
    issueReproSteps,
    issueExpected,
    issueActual
  );
});

test("@CreateFunctions @AddFeature Can Add Feature", async ({ page }) => {
  const featureName = "Feature Test - POManager";
  const description = "Feature Description - POManager";
  const priority = "low";
  const areaModule = "display";
  const acceptanceCriteria = "Test 2";

  const poManager = new POManager(page);
  const qaDrawer = poManager.getQADrawerPage();
  const newFormPage = poManager.getNewFormPage();
  await qaDrawer.goToQADrawer();
  await newFormPage.addFeature(featureName, description, priority, areaModule, acceptanceCriteria);
});

test("@CreateFunctions @AddNote Can Add Note", async ({ page }) => {
  const title = "Note - POManager";
  const content = "Note Content - POManager";
  const tagArea = "meeting";

  const poManager = new POManager(page);
  const qaDrawer = poManager.getQADrawerPage();
  const newFormPage = poManager.getNewFormPage();
  await qaDrawer.goToQADrawer();
  await newFormPage.addNote(title, content, tagArea);
});
