@mock-api:question-success @success
Feature: Happy path

  Viewing the Knowledge Based Verification questions successfully

  Background:
    Given Authenticatable Anita is using the system
    And they have provided their details

    @passthrough
    Scenario: Display and answer first question
      Given they have started the KBV journey
      And they should see the first question
      When they answer the first question
      Then they should see the second question
      And the second question should be different to the first

    @passthrough
    Scenario: Display and answer multiple questions
      Given they have started the KBV journey
      And they should see the first question
      When they have answered all the questions successfully
      Then they should be redirected
