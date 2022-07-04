module.exports = class PlaywrightDevPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.url = "http://localhost:5020/kbv/abandon";
    this.questionTitle = page.locator(".govuk-fieldset__heading");
    this.answerRadios = page.locator('input[name="question"]');
  }

  async goto() {
    await this.page.goto(this.url);
  }

  getPageTitle() {
    return this.page.textContent(".govuk-fieldset__heading");
  }

  getErrorSummary() {
    return this.page.textContent(".govuk-error-summary");
  }

  getNotAnsweredErrorMessage() {
    return "You need to answer the question";
  }

  isCurrentPage() {
    return this.page.url() === this.url;
  }

  async submit() {
    await this.page.click("button");
  }

  async answer() {
    await this.page.locator(`input[type="radio"]`).first().check();
  }

  async answerCorrectly(value) {
    await this.page
      .locator(`input[type="radio"][value="${value}"]`)
      .first()
      .check();
  }

  async answerContinue() {
    await this.page
      .locator(`input[type="radio"][value="continue"]`)
      .first()
      .check();
  }

  async answerAbandon() {
    await this.page
      .locator(`input[type="radio"][value="stop"]`)
      .first()
      .check();
  }
};
