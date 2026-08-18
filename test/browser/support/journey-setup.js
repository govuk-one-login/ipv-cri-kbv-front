import aws4 from "aws4";
import { fromNodeProviderChain } from "@aws-sdk/credential-providers";

const resolveCredentials = fromNodeProviderChain({
  timeout: 1000,
  maxRetries: 0,
});

export async function getOauthPath(request, clientId) {
  return `/oauth2/authorize?request=${request}&client_id=${clientId}`;
}

export async function getStartingURL(clientId = "standalone", sharedClaims, requestContext) {
  if (process.env.MOCK_API === "false") {
    return await getStartingURLForStub(sharedClaims, requestContext);
  } else {
    const baseUrl = process.env.WEBSITE_HOST || "http://localhost:5020";
    return new URL(
      `${baseUrl}/oauth2/authorize?request=lorem&client_id=${clientId}`
    );
  }
}

async function getStartingURLForStub(sharedClaims, requestContext) {
  try {
    const baseUrl = process.env.WEBSITE_HOST;
    const startUrl = new URL("start", process.env.RELYING_PARTY_URL);
    const body = JSON.stringify({
      ...(sharedClaims && { shared_claims: sharedClaims }),
      ...(requestContext?.evidenceRequested && {
        evidence_requested: {
          scoringPolicy: "gpg45",
          strengthScore: requestContext.evidenceRequested.strengthScore,
          verificationScore: requestContext.evidenceRequested.verificationScore,
        }
      })
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

    const oauthPath = await getOauthPath(data.request, data.client_id);

    return new URL(oauthPath, baseUrl);
  } catch (error) {
    console.error(error);
  }
}
