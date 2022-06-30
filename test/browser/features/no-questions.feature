@mock-api:no-questions
Feature: No Questions

  No Questions are available to be answered

  Background:
    Given No Question Neil is using the system
    And they have provided their details

  Scenario: Display check page and first question
    Given they have started the KBV journey
    When they continue to questions
    Then they should be redirected as a success
