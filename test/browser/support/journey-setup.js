import aws4 from "aws4";
import { fromNodeProviderChain } from "@aws-sdk/credential-providers";

const resolveCredentials = fromNodeProviderChain({
  timeout: 1000,
  maxRetries: 0,
});

export async function getOauthPath(request, clientId) {
  return `/oauth2/authorize?request=${request}&client_id=${clientId}`;
}

export async function getStartingURL(clientId = "standalone", sharedClaims) {
  if (process.env.MOCK_API === "false") {
    await getStartingURLForStub(sharedClaims);
  } else {
    const baseUrl = process.env.WEBSITE_HOST || "http://localhost:5020";
    return new URL(
      `${baseUrl}/oauth2/authorize?request=lorem&client_id=${clientId}`
    );
  }
  // await this.page.goto(this.startingURL.toString());
}

async function getStartingURLForStub(sharedClaims) {
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
