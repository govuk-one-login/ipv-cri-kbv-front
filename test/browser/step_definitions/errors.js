const { When, Then } = require("@cucumber/cucumber");

const { expect } = require("chai");

const { ErrorPage } = require("../pages");

When("there is an immediate error", () => {});

Then("they should see the unrecoverable error page", async function () {
  const errorPage = new ErrorPage(this.page);

  const errorTitle = await errorPage.getErrorTitle();

  expect(errorTitle).to.equal(errorPage.getSomethingWentWrongMessage());
});

When("they go to an unknown page", async function () {
  const errorPage = new ErrorPage(this.page);
  await errorPage.goToPage("not-going-to-be-found");
});

Then("they should see the Page not found error page", async function () {
  const errorPage = new ErrorPage(this.page);
  const errorPageHeader = await errorPage.getPageHeader();
  expect(errorPageHeader).to.contain("Page not found");
});
