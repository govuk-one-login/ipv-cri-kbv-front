const { Given, When, Then } = require("@cucumber/cucumber");

const { RelyingPartyPage } = require("../pages");
const { expect } = require("chai");

Given(/^([A-Za-z ])+is using the system$/, async function (name) {
  this.user = this.allUsers[name];
  const rpPage = new RelyingPartyPage(this.page);

  await rpPage.goto();
});

Given(
  "they have provided their details",
  { timeout: 10 * 1000 },
  async function () {}
);

Then("they should be redirected as a success", async function () {
  const rpPage = new RelyingPartyPage(this.page);

  expect(await rpPage.isRelyingPartyServer()).to.be.true;

  expect(rpPage.hasSuccessQueryParams()).to.be.true;
});
