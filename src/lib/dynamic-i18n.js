const _ = require("lodash");

const debug = require("debug")("app:lib:dynamic-i18n");

function arrayify(value) {
  return [].concat(value || []);
}

const singleKeyNotDynamic = function (key) {
  return typeof key === "string" && !key.startsWith("fields.Q");
};

const multipleKeysNotDynamic = function (key) {
  return (
    Array.isArray(key) && !key.some((entry) => entry.startsWith("fields.Q"))
  );
};

const getFallbackTranslationFromFields = function (key, fields) {
  const keys = arrayify(key);

  return keys.reduce((acc, value) => {
    return acc || _.get(fields, value);
  }, undefined);
};

const dynamicKeyTranslation = function ({
  key,
  options,
  translate,
  fallbackTranslations,
}) {
  const fallbackTranslation = getFallbackTranslationFromFields(
    key,
    fallbackTranslations
  );

  return translate(key, {
    default: fallbackTranslation,
    ...options,
  });
};

const translateWrapper = function (originalTranslate, fallbackTranslation) {
  debug(fallbackTranslation);
  return function (key, options) {
    debug(key);
    debug(options);

    if (singleKeyNotDynamic(key) || multipleKeysNotDynamic(key)) {
      return originalTranslate(key, options);
    }

    return dynamicKeyTranslation({
      key,
      options,
      translate: originalTranslate,
      fallbackTranslations: fallbackTranslation,
    });
  };
};

const buildFallbackTranslations = function (question) {
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
};

module.exports = {
  buildFallbackTranslations,
  dynamicKeyTranslation,
  getFallbackTranslationFromFields,
  multipleKeysNotDynamic,
  singleKeyNotDynamic,
  translateWrapper,
};
