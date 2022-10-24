const answerConfig = require("../lib/answer-config");

module.exports = function (answer, translate) {
  // This is running the equivalent of:
  // match = answer.match(answerConfig.KEY_NAME.regexp);
  // if (match) {
  //   text = translate(answerConfig.KEY_NAME.key, { ...match.groups });
  // }
  // It uses the named matching groups in the regex, to provide arguments for the
  // interpolation in the translation value
  //
  // It defaults to the provided answer

  let text = Object.keys(answerConfig).reduce((previousValue, currentValue) => {
    let match = answer.match(answerConfig[currentValue].regexp);

    if (match) {
      return translate(answerConfig[currentValue].key, { ...match.groups });
    }

    return previousValue;
  }, answer);

  return {
    id: answer,
    value: answer,
    text: text,
  };
};
