import wizard from "hmpo-form-wizard";
import { createPersonalDataHeaders } from "@govuk-one-login/frontend-passthrough-headers";
import * as dynamicQuestion from "../../../lib/dynamic/question.js";
import * as presenters from "../../../presenters/index.js";
import { API } from "../../../lib/config.js";

const BaseController = wizard.Controller;

class QuestionController extends BaseController {
  configure(req, res, next) {
    if (!req.session.question) {
      return next(new Error("Current session has no Question to configure."));
    }
    const fallbackTranslations = dynamicQuestion.questionToTranslations(
      req.session.question
    );

    req.form.options.fields[req.session.question.questionID] =
      dynamicQuestion.questionToFieldsConfig(
        req.session.question,
        fallbackTranslations
      );

    super.configure(req, res, next);
  }

  locals(req, res, callback) {
    super.locals(req, res, (err, locals) => {
      if (err) {
        return callback(err, locals);
      }

      locals.question = presenters.questionToRadios(
        req.session.question,
        req.translate
      );

      callback(err, locals);
    });
  }

  async saveValues(req, res, callback) {
    super.saveValues(req, res, async (err, next) => {
      if (err) {
        next(err);
      }
      if (!req.session.question) {
        callback(new Error("Current session has no Question to save."));
      }

      const answerHeaders = {
        "session-id": req.session.tokenId,
        session_id: req.session.tokenId,
        ...createPersonalDataHeaders(`${API.BASE_URL}${API.PATHS.ANSWER}`, req),
      };

      const questionHeaders = {
        "session-id": req.session.tokenId,
        session_id: req.session.tokenId,
        ...createPersonalDataHeaders(
          `${API.BASE_URL}${API.PATHS.QUESTION}`,
          req
        ),
      };

      try {
        await req.customFetch(API.PATHS.ANSWER, {
          method: "POST",
          jsonBody: {
            questionId: req.session.question.questionID,
            answer: req.sessionModel.get(req.session.question.questionID),
          },
          headers: answerHeaders,
        });

        req.session.question = undefined;

        const nextQuestion = await req.customFetch(API.PATHS.QUESTION, {
          method: "GET",
          headers: questionHeaders,
        });

        // A 204 (no body) means there are no questions, which json() can't parse.
        const body =
          nextQuestion.status === 204 ? undefined : await nextQuestion.json();

        if (body) {
          req.session.question = body;
        }
      } catch (e) {
        return callback(e);
      }

      callback();
    });
  }

  next(req) {
    if (req.session.question) {
      return "question";
    }

    return "done";
  }
}

export default QuestionController;
