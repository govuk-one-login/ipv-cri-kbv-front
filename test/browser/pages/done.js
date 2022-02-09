module.exports = class PlaywrightDevPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.url = "http://localhost:5020/kbv/done";
  }

  isCurrentPage() {
    return this.page.url() === this.url;
  }
};
