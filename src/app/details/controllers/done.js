const axios = require("axios");
const BaseController = require("hmpo-form-wizard").Controller;

const {
  API: {
    BASE_URL,
    PATHS: { AUTHORIZE },
  },
} = require("../../../lib/config");

class DoneController extends BaseController {
  async saveValues(req, res, next) {
    super.saveValues(req, res, async () => {
      try {
        const apiResponse = await axios.get(`${BASE_URL}${AUTHORIZE}`, {
          ...req.modelOptions(),
        });

        req.session.tokenId = apiResponse?.data?.sessionId;
      } catch (e) {
        return next(e);
      }

      next();
    });
  }
}
module.exports = DoneController;
