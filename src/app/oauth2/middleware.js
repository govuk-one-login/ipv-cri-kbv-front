const {
  API: {
    PATHS: { AUTHORIZE, AUTHORIZATION_CODE },
  },
  APP: {
    PATHS: { KBV },
  },
} = require("../../lib/config");

module.exports = {
  addAuthParamsToSession: async (req, res, next) => {
    const authParams = {
      response_type: req.query.response_type,
      client_id: req.query.client_id,
      state: req.query.state,
      redirect_uri: req.query.redirect_uri,
    };

    req.session.authParams = authParams;

    next();
  },

  initSessionWithJWT: async (req, res, next) => {
    const requestJWT = req.query?.request;
    const headers = { client_id: req.query?.client_id };

    try {
      if (requestJWT) {
        const apiResponse = await req.axios.post(AUTHORIZE, requestJWT, {
          headers: headers,
        });

        console.log(apiResponse);

        req.session.tokenId = apiResponse?.data["session-id"];
      }
    } catch (error) {
      next(error);
    }
    next();
  },

  retrieveAuthorizationCode: async (req, res, next) => {
    try {
      const oauthParams = {
        ...req.session.authParams,
        scope: "openid",
      };

      const apiResponse = await req.axios.get(AUTHORIZATION_CODE, {
        params: oauthParams,
        headers: {
          sessionId: req.session.tokenId,
        },
      });

      console.log(apiResponse);
      const code = apiResponse?.data?.code?.value;

      if (!code) {
        res.status(500);
        return res.send("Missing authorization code");
      }

      req.authorization_code = code;

      next();
    } catch (e) {
      next(e);
    }
  },

  redirectToCallback: async (req, res) => {
    const redirectURL = `${req.session.authParams.redirect_uri}?code=${req.authorization_code}&state=${req.session.authParams.state}`;

    res.redirect(redirectURL);
  },

  redirectToKBV: async (req, res) => {
    res.redirect(KBV);
  },
};
