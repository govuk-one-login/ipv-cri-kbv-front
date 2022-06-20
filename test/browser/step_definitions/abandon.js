const { When } = require("@cucumber/cucumber");

// const { expect } = require("chai");

const { AbandonPage, QuestionPage } = require("../pages");

When(/^they abandon their journey/, async function () {
  const questionPage = new QuestionPage(this.page);

  await questionPage.abandon();
});

When(/^they do not answer the abandon question$/, async function () {
  const abandonPage = new AbandonPage(this.page);

  await abandonPage.submit();
});
