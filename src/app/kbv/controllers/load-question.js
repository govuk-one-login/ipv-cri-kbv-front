const BaseController = require("hmpo-form-wizard").Controller;
const {
  createPersonalDataHeaders,
} = require("@govuk-one-login/frontend-passthrough-headers");
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
        const apiResponse = await req.axios.get(`${QUESTION}`, {
          headers: {
            "session-id": req.session.tokenId,
            session_id: req.session.tokenId,
            ...createPersonalDataHeaders(`${BASE_URL}${QUESTION}`, req),
          },
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
