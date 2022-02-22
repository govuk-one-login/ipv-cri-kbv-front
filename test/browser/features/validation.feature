@mock-api:question-success @success
Feature: Happy path

  KBV question validation

  Background:
    Given Validating Valerie is using the system
    And they have provided their details

  Scenario: KBV question validation
    Given they have started the KBV journey
    Then they should see the first question
    When they do not answer the first question
    Then they should see validation messages

  Scenario: KBV question validation
    Given they have started the KBV journey
    Then they should see the first question
    When they do not answer the first question
    Then they should see validation messages
