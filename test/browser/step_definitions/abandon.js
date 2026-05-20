const { When, Then } = require("@cucumber/cucumber");
const assert = require("node:assert/strict");

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
  assert.ok(abandonPage.isCurrentPage());
});

Then(/^they should see abandon validation messages$/, async function () {
  const abandonPage = new AbandonPage(this.page);
  const errorSummary = await abandonPage.getErrorSummary();
  assert.ok(errorSummary.includes("choose an option"));
});

When(/^they choose to continue answering questions$/, async function () {
  const abandonPage = new AbandonPage(this.page);
  await abandonPage.answerContinue();
  await abandonPage.submit();
});

Then(/^they should see the question page$/, function () {
  const questionPage = new QuestionPage(this.page);
  assert.ok(questionPage.isCurrentPage());
});

When(/^they choose to stop answering questions$/, async function () {
  const abandonPage = new AbandonPage(this.page);
  await abandonPage.answerAbandon();
  await abandonPage.submit();
});

Then("they should be redirected", function () {
  const rpPage = new RelyingPartyPage(this.page);
  assert.ok(rpPage.isRelyingPartyServer());
});
