import "express";
import "express-async-errors";

import path from "node:path";
import { fileURLToPath } from "node:url";
import session from "express-session";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import connectDynamoDB from "connect-dynamodb";
import addLanguageParam from "@govuk-one-login/frontend-language-toggle/build/cjs/language-param-setter.cjs";
import { frontendUiMiddlewareIdentityBypass } from "@govuk-one-login/frontend-ui";
import { frontendVitalSignsInitFromApp } from "@govuk-one-login/frontend-vital-signs";
import commonExpress from "@govuk-one-login/di-ipv-cri-common-express";

import {
  API,
  APP,
  LOG_LEVEL,
  PORT,
  SESSION_SECRET,
  SESSION_TABLE_NAME,
  SESSION_TTL,
  OVERLOAD_PROTECTION,
} from "./lib/config.js";
import { setAPIConfig, setOAuthPaths } from "./lib/settings.js";
import kbvRouter from "./app/kbv/index.js";

const DynamoDBStore = connectDynamoDB(session);

const { setup } = commonExpress.bootstrap;
const setHeaders = commonExpress.lib.headers;
const setScenarioHeaders = commonExpress.lib.scenarioHeaders;
const { customFetchMiddleware } = commonExpress.lib.customFetch;
const { setGTM, setLanguageToggle, setDeviceIntelligence } =
  commonExpress.lib.settings;
const { getGTM, getLanguageToggle, getDeviceIntelligence } =
  commonExpress.lib.locals;
const { setI18n } = commonExpress.lib.i18n;
const helmetConfig = commonExpress.lib.helmet;

const loggerConfig = {
  console: true,
  consoleJSON: true,
  consoleLevel: LOG_LEVEL,
  appLevel: LOG_LEVEL,
  app: false,
};

const dynamodb = new DynamoDB({
  region: "eu-west-2",
});

const dynamoDBSessionStore = new DynamoDBStore({
  client: dynamodb,
  table: SESSION_TABLE_NAME,
});

const sessionConfig = {
  cookieName: "service_session",
  secret: SESSION_SECRET,
  cookieOptions: { maxAge: SESSION_TTL },
  ...(SESSION_TABLE_NAME && { sessionStore: dynamoDBSessionStore }),
};

const { app, router } = setup({
  config: { APP_ROOT: import.meta.dirname },
  port: false, /// Disabling the bootstrap starting the server.
  logs: loggerConfig,
  session: sessionConfig,
  helmet: helmetConfig,
  redis: SESSION_TABLE_NAME ? false : commonExpress.lib.redis(),
  urls: {
    public: "/public",
  },
  publicDirs: ["../dist/public"],
  views: [
    path.resolve(
      path.dirname(
        fileURLToPath(
          import.meta.resolve("@govuk-one-login/di-ipv-cri-common-express")
        )
      ),
      "components"
    ),
    path.resolve("node_modules/@govuk-one-login/"),
    "views",
  ],
  translation: {
    allowedLangs: ["en", "cy"],
    fallbackLang: ["en"],
  },
  middlewareSetupFn: (app) => {
    frontendVitalSignsInitFromApp(app, {
      interval: 60000,
      logLevel: "info",
      metrics: [
        "requestsPerSecond",
        "avgResponseTime",
        "maxConcurrentConnections",
        "eventLoopDelay",
        "eventLoopUtilization",
      ],
      staticPaths: [
        /^\/assets\/.*/,
        "/ga4-assets",
        "/javascript",
        "/javascripts",
        "/images",
        "/stylesheets",
      ],
    });
    app.use(setHeaders);
  },
  overloadProtection: OVERLOAD_PROTECTION,
  dev: true,
});

app.set("view engine", "njk");

setI18n({
  router,
  config: {
    secure: true,
    cookieDomain: APP.FRONTEND_DOMAIN,
  },
});
// Common express relies on 0/1 strings
setLanguageToggle({ app, showLanguageToggle: "1" });
app.get("nunjucks").addGlobal("addLanguageParam", addLanguageParam);

setDeviceIntelligence({
  app,
  deviceIntelligenceEnabled: "true",
  deviceIntelligenceDomain: APP.DEVICE_INTELLIGENCE_DOMAIN,
});

setAPIConfig({
  app,
  baseUrl: API.BASE_URL,
  sessionPath: API.PATHS.SESSION,
  authorizationPath: API.PATHS.AUTHORIZATION,
});

setOAuthPaths({ app, entryPointPath: APP.PATHS.KBV });

setGTM({
  app,
  analyticsCookieDomain: APP.FRONTEND_DOMAIN,
  uaEnabled: false,
  uaContainerId: "",
  ga4Enabled: true,
  ga4ContainerId: APP.GTM.GA4_CONTAINER_ID,
  analyticsDataSensitive: false,
  ga4PageViewEnabled: true,
  ga4FormResponseEnabled: true,
  ga4FormErrorEnabled: true,
  ga4FormChangeEnabled: true,
  ga4NavigationEnabled: true,
  ga4SelectContentEnabled: true,
});

router.use(getGTM);
router.use(getLanguageToggle);
router.use(frontendUiMiddlewareIdentityBypass);
router.use(getDeviceIntelligence);
router.use(setScenarioHeaders);
router.use(customFetchMiddleware);

router.use("/oauth2", commonExpress.routes.oauth2);

router.use("/kbv", kbvRouter);

router.use("^/$", (req, res) => {
  res.render("index");
});

router.use(commonExpress.lib.errorHandling.redirectAsErrorToCallback);

/* Server configuration */
const server = app.listen(PORT);

// AWS recommends the keep-alive duration of the target is longer than the idle timeout value of the load balancer (default 60s)
// to prevent possible 502 errors where the target connection has already been closed
// https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-troubleshooting.html#http-502-issues
server.keepAliveTimeout = 65000;

// Handles graceful shutdown of the NODE service, so that if the container is killed by a SIGTERM, it finishes processing existing connections before the server shuts down.
process.on("SIGTERM", () => {
  // eslint-disable-next-line no-console
  console.log("SIGTERM signal received: closing HTTP server");
  server.close((err) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.log(
        `Error while calling server.close() occurred: ${err.message}`
      );
    } else {
      // eslint-disable-next-line no-console
      console.log("HTTP server closed");
    }

    process.exit(0);
  });
});
