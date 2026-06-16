import _ from "lodash";
import createDebug from "debug";
import * as dynamicKeys from "./dynamic/keys.js";

const debug = createDebug("app:lib:dynamic-i18n");

function arrayify(value) {
  return [value || []].flat();
}

export const getFallbackTranslationFromFields = function (key, fields) {
  const keys = arrayify(key);

  return keys.reduce((acc, value) => {
    return acc || _.get(fields, value);
  }, undefined);
};

export const dynamicKeyTranslation = function ({
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

export const translateWrapper = function (
  originalTranslate,
  dynamicTranslate,
  fallbackTranslation
) {
  debug(fallbackTranslation);
  return function (key, options) {
    debug(key);
    debug(options);

    if (
      dynamicKeys.singleKeyNotDynamic(key) ||
      dynamicKeys.multipleKeysNotDynamic(key)
    ) {
      return originalTranslate(key, options);
    }

    return dynamicTranslate({
      key,
      options,
      translate: originalTranslate,
      fallbackTranslations: fallbackTranslation,
    });
  };
};
