module.exports = function () {
  return {
    files: ["!src/**/*.test.js", "src/**/*.js", "test/utils/**/*.js"],

    tests: ["src/**/*.test.js"],

    env: {
      type: "node",
    },

    testFramework: "vitest",
  };
};
