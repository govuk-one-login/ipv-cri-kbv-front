require("dotenv").config();

module.exports = {
  API: {
    BASE_URL: process.env.API_BASE_URL || "http://localhost:5007",
    PATHS: {
      AUTHORIZE: "/authorize",
      QUESTION: "/question",
      ANSWER: "/answer",
    },
  },
  APP: {
    BASE_URL: process.env.EXTERNAL_WEBSITE_HOST || "http://localhost:5020",
  },
  PORT: process.env.PORT || 5020,
  SESSION_SECRET: process.env.SESSION_SECRET,
  REDIS: {
    SESSION_URL: process.env.REDIS_SESSION_URL,
    PORT: process.env.REDIS_PORT || 6379,
  },
};
