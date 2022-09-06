// Steps for any background tasks we need to do pre tests
const { Given, When, Then } = require("@cucumber/cucumber");
const { ErrorPage } = require("../pages");
const { expect } = require("chai");

Given("they start with {string}", async function (lang) {
  await setLanguageCookie(lang, this.page.url(), this.context);
  await this.page.reload();
});

When(/they set the language to "(.*)"$/, async function (lang) {
  await setLanguageCookie(lang, this.page.url(), this.context);

  await this.page.reload();
});

Then(/^they (?:should )?see(?:ed)? the page in "(.*)"$/, async function (lang) {
  const errorPage = new ErrorPage(this.page);

  const errorTitle = await errorPage.getErrorTitle();

  expect(errorTitle).to.equal(
    errorPage.getLocalisedSomethingWentWrongMessage(lang)
  );
});

async function setLanguageCookie(lang, url, context) {
  const code = lang.toLowerCase() === "welsh" ? "cy" : "en";

  const cookie = {
    name: "lng",
    value: code,
    url,
  };

  await context.addCookies([cookie]);
}
