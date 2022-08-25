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
};
