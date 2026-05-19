const { Given, Then } = require("@cucumber/cucumber");
const assert = require("node:assert/strict");

const { RelyingPartyPage } = require("../pages");

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

  assert.ok(rpPage.isRelyingPartyServer());

  const clientId = this.clientId || "standalone";
  assert.ok(rpPage.hasSuccessQueryParams(clientId));
});

Then("they should be redirected as an error", async function () {
  await this.page.waitForURL(/\/return/);
  const rpPage = new RelyingPartyPage(this.page);

  assert.ok(rpPage.isRelyingPartyServer());

  assert.ok(rpPage.hasErrorQueryParams("general error"));
});
