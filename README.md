# Digital Identity Credential Issuer

# di-ipv-cri-kbv-front

Frontend for the Knowledge Based Verification Credential Issuer

This is the home for the front end user interface for a credential issuer as a part of the Identity Proofing and Verification (IPV) system within the GDS digital identity platform. Other repositories are used for core services or other credential issuers.

# Installation

Clone this repository and then run

```bash
npm install
```

## Precommit Hooks

Install `pre-commit` from [here](https://pre-commit.com/)

Run `pre-commit install` to install pre-commit hooks locally.

If you get the error:

```
[ERROR] Cowardly refusing to install hooks with `core.hooksPath` set.
```

Run `git config --unset-all core.hooksPath` to reset your git hook settings.

## Environment Variables

- 'API_BASE_URL': Externally accessible base url of the webserver. Used to generate the callback url as part of credential issuer oauth flows
- `PORT` - Default port to run webserver on. (Default to `5020`)
- `GA4_ENABLED` - Feature flag to disable GA4, defaulted to `false`
- `UA_ENABLED` - Feature flag to disable UA, defaulted to `false`
- `UA_CONTAINER_ID` - Container ID for Universal Analytics, required for UA to work correctly. Default value is `GTM-TK92W68`
- `GA4_CONTAINER_ID` - Container ID for GA4, required for analytics to work correctly. Default value is `GTM-KD86CMZ`
- `FRONTEND_DOMAIN` - Cookie domain to persist values throughout the different sections of the OneLogin journey. Default value is `localhost`
- `LANGUAGE_TOGGLE_DISABLED` - Feature flag to disable Language Toggle, defaulted to `false`
- `DEVICE_INTELLIGENCE_ENABLED` - Feature flag to enable device intelligence, defaulted to `false`
- `DEVICE_INTELLIGENCE_DOMAIN` - Domain to apply to the device intelligence cookie if device intelligence is enabled. Defaults to `account.gov.uk`.
- `MAY_2025_REBRAND_ENABLED` - Feature flag to enable the May 2025 GOV.UK branding change, defaults to `false`
- `BROWSER` - Run browser test via different browser types i.e. `firefox`

# Imposter

[Imposter](https://www.imposter.sh/) is a mocking solution for APIs.

## Running

Imposter can be [run locally](https://docs.imposter.sh/getting_started/) using the [Imposter CLI](https://docs.imposter.sh/run_imposter_cli/). Alternatively, it can also be run using [Docker](https://docs.imposter.sh/run_imposter_docker/) or a [JAR](https://docs.imposter.sh/run_imposter_jar/) file.

The Imposter server can be started using Docker:

```bash
docker run --rm -p 8080:8080 -v $(pwd):/opt/imposter/config outofcoffee/imposter:3.25.1
```

Imposter runs on port `8080` by default.

## Endpoints

To test that the system is running as expected hit the following endpoint:

```bash
curl http://localhost:8080/system/status
```

Test the session endpoint:

```bash
curl -X POST http://localhost:8080/session \
  -H "Content-Type: application/json" \
  -d '{"client_id": "question-success", "request": "test"}'
```

### Docker Compose (recommended for testing)

For browser testing with the full application stack:

```bash
cd ../docker
docker-compose up mocks
```

This starts Imposter as part of the complete testing environment.

# Mock Data

This can be run by using:

`imposter up`

The frontend can be configured to use this mock server through two environment variables:

- `NODE_ENV = development` - this enables a middleware that passes the `x-scenario-id` header from web requests through to the API
- `API_BASE_URL = http://localhost:8080` - this points the frontend at the Imposter instance

A browser extension, such as [Mod Header](https://modheader.com/), can be used to set the value of this header in a web browser.

# Browser tests

Browser based tests can be run against the mock server, and should be able to be run against an instance of the API.

These tests are written using [Cucumber](https://cucumber.io/docs/installation/javascript/) as the test runner and [Playwright](https://playwright.dev/) as the automation tool. They also follow the [Page Object Model](https://playwright.dev/docs/test-pom) for separation of concerns.

They can be run by using:

`npm run start:ci"` in the main repository

`npm run test:browser` in the test repository

# Running browser tests locally on different browser types

The following browserType are: `firefox`, `chromium` and `edge`.

If you would like to see the web pages, change `headless: true` to `headless: false` in the setup.js file.

`BROWSER=firefox npm run test:browser`

## Using mocked scenario data

Any cucumber feature or scenario with a tag prefixed with `@mock-api:`

e.g.

```
  @mock-api:question-error
  Scenario: API error
...
```

This scenario will be configured to send a `scenario-id` header of `question-error` on every web browser request.

## Running Experian KBV frontend with a deployed stack

You can run the Experian KBV frontend with a deployed Experian KBV CRI stack in AWS. This is useful for backend API testing.

### Prerequisites

1. The required repositories need to be cloned into the same parent directory, this is a one-time setup:
   - This repository (`ipv-cri-kbv-front`)
   - [ipv-stubs](https://github.com/govuk-one-login/ipv-stubs)
   - [ipv-config](https://github.com/govuk-one-login/ipv-config)

   The `npm run ipv-core-stub` command uses relative paths in the [docker-compose](test/docker/compose.yml) file to locate the needed `.env` and `config` files from these repositories.

2. Once deployed, note the stack outputs containing the `public-api` and `private-api` IDs

### Configuration

1. Create a `.env` file if you don't already have in the project root and add the `private-api` ID as the `API_BASE_URL`:

```bash
API_BASE_URL=https://xxxxx.execute-api.eu-west-2.amazonaws.com/localdev
```

Replace `xxxxx` with your actual private API ID.

**Example:** If your private API ID is `3m775hw97b`, the URL would be:

```bash
API_BASE_URL=https://3m775hw97b.execute-api.eu-west-2.amazonaws.com/localdev
```

2. Update the [config file](test/browser/di-ipv-config.yaml) with your deployed stack's public API ID:

```yaml
- id: kbv-cri-dev
  name: Experian KBV Local
  jwksEndpoint: https://api.review-k.dev.account.gov.uk/.well-known/jwks.json
  useKeyRotation: true
  authorizeUrl: http://localhost:5020/oauth2/authorize
  tokenUrl: https://xxxxx.execute-api.eu-west-2.amazonaws.com/localdev/token
  credentialUrl: https://xxxxx.execute-api.eu-west-2.amazonaws.com/localdev/credential/issue
  audience: https://review-k.dev.account.gov.uk
  sendIdentityClaims: true
  publicEncryptionJwkBase64: "..."
  publicVCSigningVerificationJwkBase64: ".."
  apiKeyEnvVar: API_KEY_CRI_DEV
```

3. Replace `xxxxx` with your actual public API ID in both `tokenUrl` and `credentialUrl`

   **Example:** If your public API ID is `u42xwihcwf`, update the URLs to:

   ```yaml
   tokenUrl: https://u42xwihcwf.execute-api.eu-west-2.amazonaws.com/localdev/token
   credentialUrl: https://u42xwihcwf.execute-api.eu-west-2.amazonaws.com/localdev/credential/issue
   ```

### Running the services

1. Start the IPV core stub:

   ```bash
   npm run ipv-core-stub
   ```

2. In a new terminal, build and start the address front-end:

   ```bash
   npm run build && npm run dev
   ```

3. Access the core stub at: http://localhost:8085

### Code Owners

This repo has a `CODEOWNERS` file in the root and is configured to require PRs to reviewed by Code Owners.
