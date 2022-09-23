module.exports = function (question, translate) {
  const key = `fields.${question.questionID}.legend`;
  const legend = translate(key);

  if (legend && legend !== key) {
    return legend;
  }

  return question?.text;
};
