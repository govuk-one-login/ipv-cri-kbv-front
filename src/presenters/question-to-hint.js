module.exports = function (question, translate) {
  const key = `fields.${question.questionID}.hint`;
  const hint = translate(key);

  if (hint && !hint.includes(question.questionID)) {
    return hint;
  }

  if (question?.toolTip) {
    return question?.toolTip;
  }

  return " ";
};
