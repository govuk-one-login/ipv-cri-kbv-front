const { Before, BeforeAll, AfterAll, After } = require("@cucumber/cucumber");
const { chromium, firefox, webkit } = require("playwright");
const axios = require("axios");

const browserTypes = {
  chromium,
  firefox,
  webkit,
  edge: {
    launch: (options) => chromium.launch({ ...options, channel: "msedge" }),
  },
};

BeforeAll(async function () {
  // Browsers are expensive in Playwright so only create 1
  const browserName = process.env.BROWSER || "chromium";
  const browserType = browserTypes[browserName];

  if (!browserType) throw new Error(`Unsupported browser: ${browserName}`);

  // eslint-disable-next-line no-console
  console.log(`Running scenarios in browser type: ${browserName}`);
  global.browser = await browserType.launch({
    headless: true,
    slowMo: process.env.GITHUB_ACTIONS ? 0 : 500,
  });
});

AfterAll(async function () {
  await global.browser.close();
});

// Add scenario header
Before(async function ({ pickle } = {}) {
  if (!(process.env.MOCK_API === "true")) {
    return;
  }

  const tags = pickle.tags || [];
  const tag = tags.find((tag) => tag.name.startsWith("@mock-api:"));

  if (!tag) {
    return;
  }

  const header = tag?.name.substring(10);

  this.SCENARIO_ID_HEADER = header;

  try {
    await axios.get(`${process.env.API_BASE_URL}/__reset/${header}`);
  } catch (e) {
    /* eslint-disable no-console */
    console.log("Error resetting mock");
    console.log(`${process.env.API_BASE_URL}/__reset/${header}`);
    console.log(e.message);
    /* eslint-enable no-console */
    throw e;
  }
});

// Create a new test context and page per scenario
Before(async function () {
  this.context = await global.browser.newContext({});

  if (this.SCENARIO_ID_HEADER) {
    await this.context.setExtraHTTPHeaders({
      "x-scenario-id": this.SCENARIO_ID_HEADER,
    });
  }

  this.page = await this.context.newPage();
});

// Cleanup after each scenario
After(async function () {
  await this.page.close();
  await this.context.close();
});
