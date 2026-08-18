import { Given, Then } from "@cucumber/cucumber";
import assert from "node:assert/strict";
import { RelyingPartyPage } from "../pages/index.js";

Given(/^([A-Za-z ]+)is using the system$/, async function (name) {
  this.user = this.allUsers[name];
  const rpPage = new RelyingPartyPage(this.page);

  const clientId = this.clientId || "standalone";
  await rpPage.goto(clientId, undefined, this.requestContext);
  await this.page.waitForLoadState("load");
});

Given(
  "they have provided their details",
  { timeout: 10 * 1000 },
  async function () {}
);

Then("they should be redirected as a success", async function () {
  if (process.env.MOCK_API === "true") {
    await this.page.waitForURL(/\/return/);
  } else {
    await this.page.waitForURL(/\/callback/);
  }

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
