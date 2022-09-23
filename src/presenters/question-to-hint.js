module.exports = function (question, translate) {
  const key = `fields.${question.questionID}.hint`;
  const hint = translate(key);

  if (hint && hint !== key) {
    return hint;
  }

  return question?.toolTip;
};
