const BaseController = require("hmpo-form-wizard").Controller;

const {
  createPersonalDataHeaders,
} = require("@govuk-one-login/frontend-passthrough-headers");

const { API } = require("../../../lib/config");

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
    const headers = {
      "session-id": req.session.tokenId,
      session_id: req.session.tokenId,
      ...createPersonalDataHeaders(`${API.BASE_URL}${API.PATHS.ABANDON}`, req),
    };

    return req.axios.post(
      API.PATHS.ABANDON,
      {},
      {
        headers,
      }
    );
  }
}

module.exports = AbandonController;
