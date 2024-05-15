const BaseController = require("hmpo-form-wizard").Controller;

const { API } = require("../../../lib/config");

const {
  createPersonalDataHeaders,
} = require("@govuk-one-login/frontend-passthrough-headers");

class LoadQuestionController extends BaseController {
  async saveValues(req, res, next) {
    const headers = {
      "session-id": req.session.tokenId,
      session_id: req.session.tokenId,
      ...createPersonalDataHeaders(`${API.BASE_URL}${API.PATHS.QUESTION}`, req),
    };

    super.saveValues(req, res, async () => {
      try {
        const apiResponse = await req.axios.get(`${API.PATHS.QUESTION}`, {
          headers,
        });

        req.session.question = apiResponse.data;
      } catch (e) {
        return next(e);
      }

      next();
    });
  }

  next(req) {
    if (req.session.question) {
      return "question";
    }

    return "done";
  }
}
module.exports = LoadQuestionController;
