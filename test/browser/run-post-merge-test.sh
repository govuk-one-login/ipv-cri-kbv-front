#!/usr/bin/env bash

ENVIRONMENT="${TEST_ENVIRONMENT:-dev}"
RELYING_PARTY_URL="${RELYING_PARTY_URL:-https://test-resources.review-k.${ENVIRONMENT}.account.gov.uk}"
WEBSITE_HOST="https://review-k.${ENVIRONMENT}.account.gov.uk"

export RELYING_PARTY_URL
export WEBSITE_HOST
export ENVIRONMENT
export GITHUB_ACTIONS=true
export MOCK_API=false

# This script must be copied to the root of the image filesystem in the post-merge dockerfile.
# Therefore, ensure that we cd to the browser tests directory before attempting to run them.
cd /app/test/browser || exit 1

npm run test -- --tags "@post-merge and not @live" --fail-fast
