import questionToHint from "./question-to-hint.js";
import questionToLegend from "./question-to-legend.js";
import answerToRadioItem from "./answer-to-radio-item.js";

export default function questionToRadios(question, translate) {
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
      classes: "govuk-hint p",
    },
    items: question?.answerFormat?.answerList?.map((answer) =>
      answerToRadioItem(answer, translate)
    ),
  };
}
