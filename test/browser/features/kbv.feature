@mock-api:question-success @success
Feature: Happy path

  Viewing the Knowledge Based Verification questions successfully

  Background:
    Given Authenticatable Anita is using the system
    And they have provided their details

  Scenario: Display check page and first question
    Given they have started the KBV journey
#    And they can see the check page
    When they continue to questions
    Then they should see the first question

    Scenario: Display and answer first question
      Given they have started the KBV journey
      And they have continued to questions
      And they should see the first question
      When they answer the first question
      Then they should see the second question
      And the second question should be different to the first

    Scenario: Display and answer first question
      Given they have started the KBV journey
      And they have continued to questions
      And they should see the first question
      Then the di-device-intelligence cookie has been set

    Scenario: Display and answer multiple questions
      Given they have started the KBV journey
      And they have continued to questions
      And they should see the first question
      When they have answered all the questions successfully
      Then they should be redirected as a success
