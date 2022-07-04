const { When, Then } = require("@cucumber/cucumber");

const { expect } = require("chai");

const { AbandonPage, QuestionPage, RelyingPartyPage } = require("../pages");

When(/^they abandon their journey/, async function () {
  const questionPage = new QuestionPage(this.page);

  await questionPage.abandon();
});

When(/^they do not answer the abandon question$/, async function () {
  const abandonPage = new AbandonPage(this.page);

  await abandonPage.submit();
});

Then(/^they should see the abandon page$/, async function () {
  const abandonPage = new AbandonPage(this.page);
  expect(abandonPage.isCurrentPage()).to.be.true;
});

Then(/^they should see abandon validation messages$/, async function () {
  const abandonPage = new AbandonPage(this.page);
  const errorSummary = await abandonPage.getErrorSummary();
  expect(errorSummary).to.include("choose an option");
});

When(/^they choose to continue answering questions$/, async function () {
  const abandonPage = new AbandonPage(this.page);
  await abandonPage.answerContinue();
  await abandonPage.submit();
});

Then(/^they should see the question page$/, function () {
  const questionPage = new QuestionPage(this.page);
  expect(questionPage.isCurrentPage()).to.be.true;
});

When(/^they choose to stop answering questions$/, async function () {
  const abandonPage = new AbandonPage(this.page);
  await abandonPage.answerAbandon();
  await abandonPage.submit();
});

Then("they should be redirected", function () {
  const rpPage = new RelyingPartyPage(this.page);
  expect(rpPage.isRelyingPartyServer()).to.be.true;
});
