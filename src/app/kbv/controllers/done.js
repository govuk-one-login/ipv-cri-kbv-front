const BaseController = require("hmpo-form-wizard").Controller;

const {
  API: {
    PATHS: { AUTHORIZATION_CODE },
  },
} = require("../../../lib/config");

class DoneController extends BaseController {
  async saveValues(req, res, callback) {
    const authCode = await req.axios.get(AUTHORIZATION_CODE, {
      headers: {
        session_id: req.session.tokenId,
      },
    });

    req.session.authParams.authorization_code =
      authCode.data?.authorization_code;

    return super.saveValues(req, res, callback);
  }
}

module.exports = DoneController;
