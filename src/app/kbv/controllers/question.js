const dynamicQuestion = require("../../../lib/dynamic/question");
const BaseController = require("hmpo-form-wizard").Controller;
const {
  createPersonalDataHeaders,
} = require("@govuk-one-login/frontend-passthrough-headers");
const presenters = require("../../../presenters");
const {
  API: {
    BASE_URL,
    PATHS: { QUESTION, ANSWER },
  },
} = require("../../../lib/config");

class QuestionController extends BaseController {
  configure(req, res, next) {
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

      try {
        await req.axios.post(
          ANSWER,
          {
            questionId: req.session.question.questionID,
            answer: req.sessionModel.get(req.session.question.questionID),
          },
          {
            headers: {
              "session-id": req.session.tokenId,
              session_id: req.session.tokenId,
              ...createPersonalDataHeaders(`${BASE_URL}${ANSWER}`, req),
            },
          }
        );

        req.session.question = undefined;

        const nextQuestion = await req.axios.get(QUESTION, {
          headers: {
            "session-id": req.session.tokenId,
            session_id: req.session.tokenId,
            ...createPersonalDataHeaders(`${BASE_URL}${QUESTION}`, req),
          },
        });

        if (nextQuestion.data) {
          req.session.question = nextQuestion.data;
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
module.exports = QuestionController;
