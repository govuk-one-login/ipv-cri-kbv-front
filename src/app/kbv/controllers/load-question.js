const axios = require("axios");

const BaseController = require("hmpo-form-wizard").Controller;

const {
  API: {
    BASE_URL,
    PATHS: { QUESTION },
  },
} = require("../../../lib/config");

class LoadQuestionController extends BaseController {
  async saveValues(req, res, next) {
    super.saveValues(req, res, async () => {
      try {
        const apiResponse = await axios.get(`${BASE_URL}${QUESTION}`, {
          headers: {
            sessionId: req.session.tokenId,
          },
        });

        req.session.question = apiResponse.data;
      } catch (e) {
        return next(e);
      }

      next();
    });
  }
}
module.exports = LoadQuestionController;
