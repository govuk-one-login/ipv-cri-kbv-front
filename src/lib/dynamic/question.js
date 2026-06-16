export const capitalize = (string) => {
  return string
    ? string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
    : "";
};

export function answerListToTranslatedItems(answerList) {
  return answerList.reduce((acc, answer) => {
    acc[answer] = {
      label: `${capitalize(answer)}`,
      value: answer,
    };

    return acc;
  }, {});
}

export function answerListToFieldItems(answerList) {
  let fieldItems = answerList.map((answer) => answer);
  fieldItems.splice(4, 0, { divider: true, key: "answers.divider" });
  return fieldItems;
}

export function questionToTranslations(question) {
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

export function questionToFieldsConfig(question) {
  return {
    type: "radios",
    validate: ["required"],
    items: answerListToFieldItems(question.answerFormat.answerList),
  };
}
