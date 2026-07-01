import { test } from "@playwright/test";
import { QuestionPage } from "../browser/pages/index.js";
import { getStartingURL } from "../browser/support/journey-setup.js";
import { takeAndCompareScreenshots } from "./helper/screenshot-config.js";
import assert from "node:assert/strict";

test("Happy path question user journey", async ({ page }) => {
  const startingUrl = await getStartingURL("question-success");
  await page.goto(startingUrl.toString());

  const questionPage = new QuestionPage(page);
  assert.ok(questionPage.isCurrentPage());
  await takeAndCompareScreenshots(page, "question");
});
