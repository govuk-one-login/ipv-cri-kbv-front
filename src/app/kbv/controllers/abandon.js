const BaseController = require("hmpo-form-wizard").Controller;
const {
  createPersonalDataHeaders,
} = require("@govuk-one-login/frontend-passthrough-headers");
const {
  API: {
    BASE_URL,
    PATHS: { ABANDON },
  },
} = require("../../../lib/config");

class AbandonController extends BaseController {
  async saveValues(req, res, next) {
    try {
      const choice = req.form.values.abandonRadio;
      if (choice === "stop") {
        await this.abandonJourney(req);
      }
      super.saveValues(req, res, () => next());
    } catch (err) {
      if (err) {
        next(err);
      }
    }
  }

  abandonJourney(req) {
    return req.axios.post(
      ABANDON,
      {},
      {
        headers: {
          "session-id": req.session.tokenId,
          session_id: req.session.tokenId,
          ...createPersonalDataHeaders(`${BASE_URL}${ABANDON}`, req),
        },
      }
    );
  }
}

module.exports = AbandonController;
