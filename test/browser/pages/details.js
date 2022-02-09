module.exports = class PlaywrightDevPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  async fillOutDetails() {
    await this.page.check("#formType-dropDown");
    await this.page.click("button");
    await this.page.click("button");
  }

  async goto() {
    await this.page.goto("http://localhost:5020/details");
  }
};
