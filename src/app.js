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
const { setGTM, setLanguageToggle } = commonExpress.lib.settings;
const { getGTM, getLanguageToggle } = commonExpress.lib.locals;

const {
  setI18n,
} = require("@govuk-one-login/di-ipv-cri-common-express/src/lib/i18next");

const addLanguageParam = require("@govuk-one-login/frontend-language-toggle/build/cjs/language-param-setter.cjs");

const {
  API,
  APP,
  LOG_LEVEL,
  PORT,
  SESSION_SECRET,
  SESSION_TABLE_NAME,
  SESSION_TTL,
} = require("./lib/config");

const { setup } = require("hmpo-app");

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

const { app, router } = setup({
  config: { APP_ROOT: __dirname },
  port: PORT,
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
    app.use(setHeaders);
  },
  dev: true,
});

app.set("view engine", "njk");

setI18n({
  router,
  config: {
    secure: true,
    cookieDomain: APP.GTM.ANALYTICS_COOKIE_DOMAIN,
  },
});
// Common express relies on 0/1 strings
const showLanguageToggle = APP.LANGUAGE_TOGGLE_DISABLED === "true" ? "0" : "1";
setLanguageToggle({ app, showLanguageToggle: showLanguageToggle });
app.get("nunjucks").addGlobal("addLanguageParam", addLanguageParam);

setAPIConfig({
  app,
  baseUrl: API.BASE_URL,
  sessionPath: API.PATHS.SESSION,
  authorizationPath: API.PATHS.AUTHORIZATION,
});

setOAuthPaths({ app, entryPointPath: APP.PATHS.KBV });

setGTM({
  app,
  analyticsCookieDomain: APP.GTM.ANALYTICS_COOKIE_DOMAIN,
  uaDisabled: APP.GTM.UA_DISABLED,
  uaContainerId: APP.GTM.UA_CONTAINER_ID,
  ga4Disabled: APP.GTM.GA4_DISABLED,
  ga4ContainerId: APP.GTM.GA4_CONTAINER_ID,
});

router.use(getGTM);
router.use(getLanguageToggle);
router.use(setScenarioHeaders);
router.use(setAxiosDefaults);

router.use("/oauth2", commonExpress.routes.oauth2);

router.use("/kbv", require("./app/kbv"));

router.use("^/$", (req, res) => {
  res.render("index");
});

router.use((err, req, res, next) => {
  if (req.session?.authParams?.redirect_uri) {
    next(err);
    router.use(commonExpress.lib.errorHandling.redirectAsErrorToCallback);
  } else {
    res.render("error");
  }
});
