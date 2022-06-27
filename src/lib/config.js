require("dotenv").config();

module.exports = {
  API: {
    BASE_URL: process.env.API_BASE_URL || "http://localhost:5007",
    PATHS: {
      SESSION: "/session",
      QUESTION: "/question",
      ANSWER: "/answer",
      AUTHORIZATION: "/authorization",
    },
  },
  APP: {
    BASE_URL: process.env.EXTERNAL_WEBSITE_HOST || "http://localhost:5020",
    PATHS: {
      KBV: "/kbv",
    },
    ANALYTICS: {
      ID: process.env.ANALYTICS_ID,
      COOKIE_DOMAIN: process.env.ANALYTICS_COOKIE_DOMAIN || "localhost",
    },
  },
  PORT: process.env.PORT || 5020,
  SESSION_SECRET: process.env.SESSION_SECRET,
  REDIS: {
    SESSION_URL: process.env.REDIS_SESSION_URL,
    PORT: process.env.REDIS_PORT || 6379,
  },
};
