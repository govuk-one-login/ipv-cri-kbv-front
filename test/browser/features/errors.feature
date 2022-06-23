@mock-errors
Feature: Error handling

  API Errors in middle of journey

  Background:
    Given Error Ethem is using the system
    And they have provided their details

  @mock-api:session-error
  Scenario: Session error
    Given they have started the KBV journey
    And there is an immediate error
    Then they should see the unrecoverable error page

  @mock-api:answer-error @wip
  Scenario: Error on answering first question
    Given they have started the KBV journey
    And they have continued to questions
    And they should see the first question
    When they answer the first question
    Then they should be redirected as an error
