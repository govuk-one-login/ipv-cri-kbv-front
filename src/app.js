require("express");
require("express-async-errors");

const path = require("path");
const session = require("express-session");
const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const DynamoDBStore = require("connect-dynamodb")(session);
const commonExpress = require("@govuk-one-login/di-ipv-cri-common-express");

const setHeaders = commonExpress.lib.headers;
const setScenarioHeaders = commonExpress.lib.scenarioHeaders;
const setAxiosDefaults = commonExpress.lib.axios;

const { setAPIConfig, setOAuthPaths } = require("./lib/settings");
const { setGTM, setLanguageToggle, setDeviceIntelligence } =
  commonExpress.lib.settings;
const { getGTM, getLanguageToggle, getDeviceIntelligence } =
  commonExpress.lib.locals;

const {
  setI18n,
} = require("@govuk-one-login/di-ipv-cri-common-express/src/lib/i18next");

const addLanguageParam = require("@govuk-one-login/frontend-language-toggle/build/cjs/language-param-setter.cjs");

const {
  frontendUiMiddlewareIdentityBypass,
} = require("@govuk-one-login/frontend-ui");

const {
  API,
  APP,
  LOG_LEVEL,
  PORT,
  SESSION_SECRET,
  SESSION_TABLE_NAME,
  SESSION_TTL,
  OVERLOAD_PROTECTION,
} = require("./lib/config");

const { setup } =
  require("@govuk-one-login/di-ipv-cri-common-express").bootstrap;

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

const helmetConfig = require("@govuk-one-login/di-ipv-cri-common-express/src/lib/helmet");

const {
  frontendVitalSignsInitFromApp,
} = require("@govuk-one-login/frontend-vital-signs");

const { app, router } = setup({
  config: { APP_ROOT: __dirname },
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
        require.resolve("@govuk-one-login/di-ipv-cri-common-express")
      ),
      "components"
    ),
    path.resolve("node_modules/@govuk-one-login/"),
    "views",
  ],
  translation: {
    allowedLangs: ["en", "cy"],
    fallbackLang: ["en"],
    cookie: { name: "lng" },
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
const showLanguageToggle = APP.LANGUAGE_TOGGLE_DISABLED === "true" ? "0" : "1";
setLanguageToggle({ app, showLanguageToggle });
app.get("nunjucks").addGlobal("addLanguageParam", addLanguageParam);

setDeviceIntelligence({
  app,
  deviceIntelligenceEnabled: APP.DEVICE_INTELLIGENCE_ENABLED,
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
  uaEnabled: APP.GTM.UA_ENABLED,
  uaContainerId: APP.GTM.UA_CONTAINER_ID,
  ga4Enabled: APP.GTM.GA4_ENABLED,
  ga4ContainerId: APP.GTM.GA4_CONTAINER_ID,
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
router.use(setAxiosDefaults);

router.use("/oauth2", commonExpress.routes.oauth2);

router.use("/kbv", require("./app/kbv"));

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
