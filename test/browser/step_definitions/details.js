const { Given, When, Then } = require("@cucumber/cucumber");

const { DetailsPage } = require("../pages");

Given(/^^([A-Za-z ])+is using the system$/, async function (name) {
  this.user = this.allUsers[name];
});

Given(
  "they have provided their details",
  { timeout: 10 * 1000 },
  async function () {
    const detailsPage = new DetailsPage(this.page);

    await detailsPage.goto();
    await detailsPage.fillOutDetails();
  }
);
