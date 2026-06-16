import { Then } from "@cucumber/cucumber";
import assert from "node:assert/strict";

Then("the {word} cookie has been set", async function (cookieName) {
  const cookies = await this.page.context().cookies();
  const expectedCookie = cookies.find((cookie) => cookie.name === cookieName);
  assert.ok(expectedCookie != null);
});
