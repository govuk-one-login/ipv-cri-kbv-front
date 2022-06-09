const { Given, When, Then } = require("@cucumber/cucumber");

const { expect } = require("chai");

const { CheckPage, QuestionPage, DonePage } = require("../pages");

When(/^they (?:have )?start(?:ed)? the KBV journey$/, async function () {});

Given(/they (?:can )?see? the check page$/, async function () {
  const checkPage = new CheckPage(this.page);

  expect(checkPage.isCurrentPage()).to.be.true;
});

Given(/^they (?:have )?continue(?:d)? to questions$/, async function () {
  // const checkPage = new CheckPage(this.page);
  //
  // expect(checkPage.isCurrentPage()).to.be.true;
  //
  // await checkPage.continue();
});

Then("they should see the first question", async function () {
  const questionPage = new QuestionPage(this.page);

  expect(questionPage.isCurrentPage()).to.be.true;

  this.questionTitle = await questionPage.getPageTitle();
  expect(this.questionTitle).not.to.be.empty;
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
  expect(questionPage.isCurrentPage()).to.be.true;
});

Then(
  /^the second question should be different to the first$/,
  async function () {
    const questionPage = new QuestionPage(this.page);
    expect(questionPage.isCurrentPage()).to.be.true;

    const secondQuestionTitle = await questionPage.getPageTitle();
    expect(secondQuestionTitle).not.to.be.empty;

    expect(this.questionTitle).to.not.equal(secondQuestionTitle);
  }
);

When(/^they do not answer the first question$/, async function () {
  const questionPage = new QuestionPage(this.page);

  await questionPage.submit();
});

Then(/^they should see validation messages$/, async function () {
  const questionPage = new QuestionPage(this.page);

  const errorSummary = await questionPage.getErrorSummary();

  expect(errorSummary).to.include(questionPage.getNotAnsweredErrorMessage());
});

When(/^they have answered all the questions successfully$/, async function () {
  const questionPage = new QuestionPage(this.page);

  await questionPage.answer();
  await questionPage.submit();

  await questionPage.answer();
  await questionPage.submit();
});

Then(/^they should see the done page$/, function () {
  const donePage = new DonePage(this.page);

  expect(donePage.isCurrentPage()).to.be.true;
});
