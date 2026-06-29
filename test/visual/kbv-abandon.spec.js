import { test } from "@playwright/test";
import { QuestionPage } from "../browser/pages/index.js";
import { getStartingURL } from "../browser/support/journey-setup.js";
import { takeAndCompareScreenshots } from "./helper/screenshot-config.js";
import assert from "node:assert/strict";

test("Abandon the question user journey", async ({ page }) => {
  const startingUrl = await getStartingURL("question-abandon");
  await page.goto(startingUrl.toString());

  const questionPage = new QuestionPage(page);
  assert.ok(questionPage.isCurrentPage());

  await questionPage.abandon();
  await takeAndCompareScreenshots(page, "abandon");
});
