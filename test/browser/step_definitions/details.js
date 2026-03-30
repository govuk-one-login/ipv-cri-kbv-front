const { Given, Then } = require("@cucumber/cucumber");

const { RelyingPartyPage } = require("../pages");
const { expect } = require("chai");

Given(/^([A-Za-z ]+)is using the system$/, async function (name) {
  this.user = this.allUsers[name];
  const rpPage = new RelyingPartyPage(this.page);

  const clientId = this.clientId || "standalone";
  await rpPage.goto(clientId);
  await this.page.waitForLoadState("load");
});

Given(
  "they have provided their details",
  { timeout: 10 * 1000 },
  async function () {}
);

Then("they should be redirected as a success", async function () {
  await this.page.waitForURL(/\/return/);
  const rpPage = new RelyingPartyPage(this.page);

  expect(rpPage.isRelyingPartyServer()).to.be.true;

  const clientId = this.clientId || "standalone";
  expect(rpPage.hasSuccessQueryParams(clientId)).to.be.true;
});

Then("they should be redirected as an error", async function () {
  await this.page.waitForURL(/\/return/);
  const rpPage = new RelyingPartyPage(this.page);

  expect(rpPage.isRelyingPartyServer()).to.be.true;

  expect(rpPage.hasErrorQueryParams("general error")).to.be.true;
});
