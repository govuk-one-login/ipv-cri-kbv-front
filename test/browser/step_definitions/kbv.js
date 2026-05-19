const { Given, When, Then } = require("@cucumber/cucumber");
const assert = require("node:assert/strict");

const { CheckPage, QuestionPage, DonePage } = require("../pages");

When(/^they (?:have )?start(?:ed)? the KBV journey$/, async function () {});

Given(/they (?:can )?see? the check page$/, async function () {
  const checkPage = new CheckPage(this.page);

  assert.ok(checkPage.isCurrentPage());
});

Given(/^they (?:have )?continue(?:d)? to questions$/, async function () {
  // const checkPage = new CheckPage(this.page);
  //
  // assert.ok(checkPage.isCurrentPage());
  //
  // await checkPage.continue();
});

Then("they should see the first question", async function () {
  const questionPage = new QuestionPage(this.page);

  assert.ok(questionPage.isCurrentPage());

  this.questionTitle = await questionPage.getPageTitle();
  assert.ok(this.questionTitle);

  const divider = await questionPage.orDivider();
  assert.ok(divider);
});

When(/^they answer the first question$/, async function () {
  const questionPage = new QuestionPage(this.page);

  await questionPage.answer();
  await questionPage.submit();
});

When(/^they answer the first question correctly$/, async function () {
  const questionPage = new QuestionPage(this.page);

  await questionPage.answerCorrectly(this.user.answers[0]);
  await questionPage.submit();
});

When(/^they answer the first question incorrectly$/, async function () {
  const questionPage = new QuestionPage(this.page);

  await questionPage.answerIncorrectly(this.user.answers[0]);
  await questionPage.submit();
});

Then("they should see the second question", async function () {
  const questionPage = new QuestionPage(this.page);
  assert.ok(questionPage.isCurrentPage());

  const divider = await questionPage.orDivider();
  assert.ok(divider);
});

Then(
  /^the second question should be different to the first$/,
  async function () {
    const questionPage = new QuestionPage(this.page);
    assert.ok(questionPage.isCurrentPage());

    const secondQuestionTitle = await questionPage.getPageTitle();
    assert.ok(secondQuestionTitle);

    assert.notStrictEqual(this.questionTitle, secondQuestionTitle);
  }
);

When(/^they do not answer the first question$/, async function () {
  const questionPage = new QuestionPage(this.page);

  await questionPage.submit();
});

Then(/^they should see validation messages$/, async function () {
  const questionPage = new QuestionPage(this.page);

  const errorSummary = await questionPage.getErrorSummary();

  assert.ok(errorSummary.includes(questionPage.getNotAnsweredErrorMessage()));
});

When(/^they have answered all the questions successfully$/, async function () {
  const questionPage = new QuestionPage(this.page);

  await questionPage.answer();
  await questionPage.submit();

  await questionPage.answer();
  await questionPage.submit();

  await questionPage.answer();
  await questionPage.submit();
});

Then(/^they should see the done page$/, function () {
  const donePage = new DonePage(this.page);

  assert.ok(donePage.isCurrentPage());
});
