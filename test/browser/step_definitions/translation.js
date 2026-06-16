import { Given, When, Then } from "@cucumber/cucumber";
import assert from "node:assert/strict";
import { ErrorPage } from "../pages/index.js";

Given("they start with {string}", async function (lang) {
  await setLanguageCookie(lang, this.page.url(), this.context);
  await this.page.reload();
});

When(/they set the language to "(.*)"$/, async function (lang) {
  await setLanguageCookie(lang, this.page.url(), this.context);

  await this.page.reload();
});

When(
  /they set the language to "(.*)" using the toggle$/,
  async function (lang) {
    await setLanguageWithToggle(lang, this.page);
    await this.page.reload();
  }
);

Then(/^they (?:should )?see(?:ed)? the page in "(.*)"$/, async function (lang) {
  const errorPage = new ErrorPage(this.page);

  const errorTitle = await errorPage.getErrorTitle();

  assert.strictEqual(
    errorTitle,
    errorPage.getLocalisedSomethingWentWrongMessage(lang)
  );
});

Then(/^the page's language property should be "(.*)"$/, async function (lang) {
  const code = lang.toLowerCase() === "welsh" ? "cy" : "en";
  const hasLanguageCorrectCode = await this.page
    .locator(`html[lang="${code}"]`)
    .count();
  assert.strictEqual(hasLanguageCorrectCode, 1);
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

async function setLanguageWithToggle(lang, page) {
  const errorPage = new ErrorPage(page);
  const code = lang.toLowerCase() === "welsh" ? "cy" : "en";

  await errorPage.toggleLanguage(code);
}
