@mock-api:session-error @focus
Feature: Error handling

  API Errors in middle of journey

  Background:
    Given Error Ethem is using the system
    And they have provided their details
    And they have started the KBV journey
    And there is an immediate error
    And they should see the unrecoverable error page

  Scenario: English to Welsh
    Given they set the language to "English"
    And they see the page in "English"
    When they set the language to "Welsh"
    Then they should see the page in "Welsh"

  Scenario: Welsh to English
    Given they set the language to "Welsh"
    And they see the page in "Welsh"
    When they set the language to "English"
    Then they should see the page in "English"
