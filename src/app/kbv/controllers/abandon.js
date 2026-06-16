import wizard from "hmpo-form-wizard";
import { createPersonalDataHeaders } from "@govuk-one-login/frontend-passthrough-headers";
import { API } from "../../../lib/config.js";

const BaseController = wizard.Controller;

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

export default AbandonController;
