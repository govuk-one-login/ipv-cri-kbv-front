import wizard from "hmpo-form-wizard";
import { createPersonalDataHeaders } from "@govuk-one-login/frontend-passthrough-headers";
import { API } from "../../../lib/config.js";

const BaseController = wizard.Controller;

class LoadQuestionController extends BaseController {
  async saveValues(req, res, next) {
    const headers = {
      "session-id": req.session.tokenId,
      session_id: req.session.tokenId,
      ...createPersonalDataHeaders(`${API.BASE_URL}${API.PATHS.QUESTION}`, req),
    };

    super.saveValues(req, res, async () => {
      try {
        const apiResponse = await req.customFetch(API.PATHS.QUESTION, {
          method: "GET",
          headers,
        });

        // A 204 (no body) means there are no questions, which json() can't parse.
        req.session.question =
          apiResponse.status === 204 ? undefined : await apiResponse.json();
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

export default LoadQuestionController;
