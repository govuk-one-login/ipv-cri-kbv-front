import dotenv from "dotenv";

dotenv.config();

export const API = {
  BASE_URL: process.env.API_BASE_URL || "http://localhost:5007",
  PATHS: {
    SESSION: "/session",
    QUESTION: "/question",
    ANSWER: "/answer",
    AUTHORIZATION: "/authorization",
    ABANDON: "/abandon",
  },
};

export const APP = {
  BASE_URL: process.env.EXTERNAL_WEBSITE_HOST || "http://localhost:5020",
  PATHS: {
    KBV: "/kbv/",
  },
  GTM: {
    GA4_CONTAINER_ID: process.env.GA4_CONTAINER_ID,
  },
  DEVICE_INTELLIGENCE_DOMAIN:
    process.env.DEVICE_INTELLIGENCE_DOMAIN || "account.gov.uk",
  FRONTEND_DOMAIN: process.env.FRONTEND_DOMAIN || "localhost",
};

export const LOG_LEVEL = process.env.LOG_LEVEL || "request";

export const PORT = process.env.PORT || 5020;

export const SESSION_SECRET = process.env.SESSION_SECRET;

export const SESSION_TABLE_NAME = process.env.SESSION_TABLE_NAME;

export const SESSION_TTL = process.env.SESSION_TTL || 7200000; // two hours in ms

export const REDIS = {
  SESSION_URL: process.env.REDIS_SESSION_URL,
  PORT: process.env.REDIS_PORT || 6379,
};

export const OVERLOAD_PROTECTION = {
  production: process.env.NODE_ENV === "production",
  clientRetrySecs: 1,
  sampleInterval: 5,
  maxEventLoopDelay: 400,
  maxHeapUsedBytes: 0,
  maxRssBytes: 0,
  errorPropagationMode: false,
  logging: "error",
};
