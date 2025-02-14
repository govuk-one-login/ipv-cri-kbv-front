const capitalize = (string) => {
  return string
    ? string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
    : "";
};

function answerListToTranslatedItems(answerList) {
  return answerList.reduce((acc, answer) => {
    acc[answer] = {
      label: `${capitalize(answer)}`,
      value: answer,
    };

    return acc;
  }, {});
}

function answerListToFieldItems(answerList) {
  let fieldItems = answerList.map((answer) => answer);
  fieldItems.splice(4, 0, { divider: true, key: "answers.divider" });
  return fieldItems;
}

function questionToTranslations(question) {
  return {
    fields: {
      [question.questionID]: {
        legend: question.text,
        label: question.text,
        hint: question.toolTip,
        items: answerListToTranslatedItems(question.answerFormat.answerList),
      },
    },
  };
}

function questionToFieldsConfig(question) {
  return {
    type: "radios",
    validate: ["required"],
    items: answerListToFieldItems(question.answerFormat.answerList),
  };
}

module.exports = {
  answerListToTranslatedItems,
  answerListToFieldItems,
  questionToFieldsConfig,
  questionToTranslations,
};
