module.exports = {
  setAPIConfig: ({ app, baseUrl, sessionPath }) => {
    app.set("API.BASE_URL", baseUrl);
    app.set("API.PATHS.SESSION", sessionPath);
  },

  setOAuthPaths: ({ app, entryPointPath }) => {
    app.set("APP.PATHS.ENTRYPOINT", entryPointPath);
  },
};
