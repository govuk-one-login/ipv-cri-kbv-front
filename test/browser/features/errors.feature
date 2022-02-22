@mock-errors
Feature: Error handling

  API Errors in middle of journey

  Background:
    Given Error Ethem is using the system
    And they have provided their details

  @mock-api:question-error
  Scenario: API error
    Given they have started the KBV journey
    Then they should see an error page
