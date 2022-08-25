const _ = require("lodash");
module.exports = {
  questionToTranslations: function (question) {
    return {
      fields: {
        [question.questionID]: {
          legend: question.text,
          label: question.text,
          hint: question.toolTip,
          validation: {
            default: "You need to answer the question",
          },
          items: question.answerFormat.answerList.reduce((acc, answer) => {
            acc[answer] = {
              label: `${_.capitalize(answer)}`,
              value: answer,
            };

            return acc;
          }, {}),
        },
      },
    };
  },
  questionToFieldsConfig: function (question, fallbackTranslations) {
    return {
      label: fallbackTranslations?.fields?.question?.legend || question.text,
      type: "radios",
      validate: ["required"],
      fieldset: {
        legend: {
          text: `fields.questionX.legend`,
        },
      },
      items: question.answerFormat.answerList.map((answer) => answer),
    };
  },
};
