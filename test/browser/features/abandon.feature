@mock-api:question-abandon @success
Feature: Abandon Knowledge Based Verification Joureny

  Abandoning the Knowledge Based Verification questions successfully

  Background:
    Given Authenticatable Anita is using the system
    And they have provided their details
    And they have started the KBV journey
    And they have continued to questions
    And they should see the first question

    Scenario: Display abandon page
      Given they abandon their journey
      Then they should see the abandon page

    Scenario: Validation on abandon page
      Given they abandon their journey
      When they do not answer the abandon question
      Then they should see abandon validation messages

    Scenario: Return to Questions
      Given they abandon their journey
      When they choose to continue answering questions
      Then they should see the question page

    Scenario: Stop answering questions
      Given they abandon their journey
      When they choose to stop answering questions
      Then they should be redirected
