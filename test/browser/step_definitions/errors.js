import { When, Then } from "@cucumber/cucumber";
import assert from "node:assert/strict";
import { ErrorPage } from "../pages/index.js";

When("there is an immediate error", () => {});

Then("they should see the unrecoverable error page", async function () {
  const errorPage = new ErrorPage(this.page);

  const errorTitle = await errorPage.getErrorTitle();

  assert.strictEqual(errorTitle, errorPage.getSomethingWentWrongMessage());
});

When("they go to an unknown page", async function () {
  const errorPage = new ErrorPage(this.page);
  await errorPage.goToPage("not-going-to-be-found");
});

Then("they should see the Page not found error page", async function () {
  const errorPage = new ErrorPage(this.page);
  const errorPageHeader = await errorPage.getPageHeader();
  assert.ok(errorPageHeader.includes("Page not found"));
});
