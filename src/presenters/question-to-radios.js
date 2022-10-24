const questionToHint = require("./question-to-hint");
const questionToLegend = require("./question-to-legend");
const answerToRadioItem = require("./answer-to-radio-item");

module.exports = function (question, translate) {
  return {
    id: question?.questionID,
    name: question?.questionID,
    label: questionToLegend(question, translate),
    legend: questionToLegend(question, translate),
    fieldset: {
      legend: {
        isPageHeading: true,
        classes: "govuk-fieldset__legend--l",
      },
    },
    hint: {
      html: questionToHint(question, translate),
    },
    items: question?.answerFormat?.answerList?.map((answer) =>
      answerToRadioItem(answer, translate)
    ),
  };
};
