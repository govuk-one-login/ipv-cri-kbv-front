const pino = require("pino");
const { PACKAGE_NAME } = require("./config");
const { LOG_LEVEL } = require("./config");

const logger = pino({
  name: PACKAGE_NAME,
  level: LOG_LEVEL ?? "info",
  console: true,
  consoleJSON: true,
  app: false,
});

module.exports = { logger };
