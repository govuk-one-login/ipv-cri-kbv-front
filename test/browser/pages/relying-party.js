import aws4 from "aws4";
import { fromNodeProviderChain } from "@aws-sdk/credential-providers";

const resolveCredentials = fromNodeProviderChain({
  timeout: 1000,
  maxRetries: 0,
});

export default class PlaywrightDevPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page, clientId) {
    this.page = page;

    const websiteHost = process.env.WEBSITE_HOST || "http://localhost:5020";
    const relyingPartyURL =
      process.env.RELYING_PARTY_URL || "http://localhost:8080";
    this.baseURL = new URL(websiteHost);
    this.relyingPartyURL = new URL(relyingPartyURL);
    this.env = process.env.ENVIRONMENT || "dev";

    if (process.env.MOCK_API !== "false") {
      this.oauthPath = this.getOauthPath("lorem", clientId);
      this.startingURL = new URL(this.oauthPath, this.baseURL);
    }
  }

  async goto(clientId = "standalone", sharedClaims) {
    if (process.env.MOCK_API === "false") {
      this.startingURL = await this.getStartingURLForStub(sharedClaims);
    } else {
      const baseUrl = process.env.WEBSITE_HOST || "http://localhost:5020";
      this.startingUrl = `${baseUrl}/oauth2/authorize?request=lorem&client_id=${clientId}`;
      this.startingURL = new URL(this.startingUrl);
    }

    await this.page.goto(this.startingURL.toString());
  }

  getOauthPath(request, clientId) {
    return `/oauth2/authorize?request=${request}&client_id=${clientId}`;
  }

  async getStartingURLForStub(sharedClaims) {
    try {
      const startUrl = new URL("start", process.env.RELYING_PARTY_URL);
      const body = JSON.stringify({
        aud: process.env.WEBSITE_HOST,
        ...(sharedClaims && { shared_claims: sharedClaims }),
      });

      const credentials = await resolveCredentials();
      const { headers } = aws4.sign(
        {
          host: startUrl.host,
          path: `${startUrl.pathname}${startUrl.search}`,
          method: "POST",
          service: "execute-api",
          region: "eu-west-2",
          headers: { "Content-Type": "application/json" },
          body,
        },
        {
          accessKeyId: credentials.accessKeyId,
          secretAccessKey: credentials.secretAccessKey,
          sessionToken: credentials.sessionToken,
        }
      );

      const response = await fetch(startUrl, {
        method: "POST",
        headers,
        body,
      });
      const data = await response.json();

      this.oauthPath = this.getOauthPath(data.request, data.client_id);

      return new URL(this.oauthPath, this.baseURL);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  async isRedirectPage(clientId = "standalone") {
    const url = this.page.url();
    const mockApiUrl = process.env.MOCK_API_URL || "http://localhost:8080";

    const isCorrectPage =
      url.startsWith(mockApiUrl) &&
      url.endsWith(`client_id=${clientId}&state=sT%40t3&code=FACEFEED`);

    return isCorrectPage;
  }

  isRelyingPartyServer() {
    const origin = new URL(this.page.url()).origin;

    if (process.env.MOCK_API === "false") {
      return origin === this.relyingPartyURL.origin;
    }

    const mockApiUrl = process.env.MOCK_API_URL || "http://localhost:8080";
    return origin === mockApiUrl;
  }

  hasSuccessQueryParams(clientId = "standalone") {
    const params = new URL(this.page.url()).searchParams;

    if (process.env.MOCK_API === "false") {
      return ["client_id", "state", "code"].every((key) => !!params.get(key));
    }

    return (
      params.get("client_id") === clientId &&
      params.get("state") === "sT@t3" &&
      params.get("code") === "FACEFEED"
    );
  }

  hasErrorQueryParams(code) {
    const { searchParams } = new URL(this.page.url());
    return (
      searchParams.get("error") === "server_error" &&
      searchParams.get("error_description") === code
    );
  }
}
