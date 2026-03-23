const { Before, BeforeAll, AfterAll, After } = require("@cucumber/cucumber");
const { chromium, firefox, webkit } = require("playwright");

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

// Extract client_id from scenario tags for Imposter
Before(async function ({ pickle } = {}) {
  if (!(process.env.MOCK_API === "true")) {
    return;
  }

  const tags = pickle.tags || [];
  const tag = tags.find((tag) => tag.name.startsWith("@mock-api:"));

  if (!tag) {
    return;
  }

  // Extract client_id from @mock-api:scenario-name tag
  this.clientId = tag?.name.substring(10);
});

// Create a new test context and page per scenario
Before(async function () {
  this.context = await global.browser.newContext({});

  this.page = await this.context.newPage();
});

// Cleanup after each scenario
After(async function () {
  if (process.env.MOCK_API === "true" && this.clientId) {
    const mockApiUrl = process.env.MOCK_API_URL || "http://localhost:8080";
    await fetch(`${mockApiUrl}/system/store/${this.clientId}`, {
      method: "DELETE",
    });
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  await this.page.close();
  await this.context.close();
});
