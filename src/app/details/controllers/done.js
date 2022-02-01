const BaseController = require("hmpo-form-wizard").Controller;

const {
  API: {
    PATHS: { AUTHORIZE },
  },
} = require("../../../lib/config");

class DoneController extends BaseController {
  async saveValues(req, res, next) {
    super.saveValues(req, res, async () => {
      try {
        const apiResponse = await req.axios.get(AUTHORIZE);

        req.session.tokenId = apiResponse?.data?.sessionId;
      } catch (e) {
        return next(e);
      }

      next();
    });
  }
}

module.exports = DoneController;
