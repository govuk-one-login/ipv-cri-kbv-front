import { test } from "@playwright/test";
import { QuestionPage } from "../browser/pages/index.js";
import { getStartingURL } from "../browser/support/journey-setup.js";
import { takeAndCompareScreenshots } from "./helper/screenshot-config.js";
import assert from "node:assert/strict";

test("Question validation error - Welsh", async ({ page }) => {
  const startingUrl = await getStartingURL("question-success");

  startingUrl.searchParams.set("lng", "cy");

  await page.goto(startingUrl.toString());

  const questionPage = new QuestionPage(page);
  assert.ok(questionPage.isCurrentPage());

  await questionPage.submit();

  await takeAndCompareScreenshots(page, "question-error-cy");
});
