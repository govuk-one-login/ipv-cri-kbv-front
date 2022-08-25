module.exports = {
  singleKeyNotDynamic: function (key) {
    return typeof key === "string" && !key.startsWith("fields.Q");
  },
  multipleKeysNotDynamic: function (key) {
    return (
      Array.isArray(key) && !key.some((entry) => entry.startsWith("fields.Q"))
    );
  },
};
