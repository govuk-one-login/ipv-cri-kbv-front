import wizard from "hmpo-form-wizard";
import QuestionController from "./question.js";
import * as dynamicQuestion from "../../../lib/dynamic/question.js";
import * as presenters from "../../../presenters/index.js";
import { API } from "../../../lib/config.js";
import { setupDefaultMocks } from "../../../../test/utils/helpers.js";

const BaseController = wizard.Controller;

describe("Question controller", () => {
  let questionController;

  let req;
  let res;
  let next;

  beforeEach(() => {
    const setup = setupDefaultMocks();
    req = setup.req;
    res = setup.res;
    next = setup.next;

    questionController = new QuestionController({ route: "/test" });
  });

  it("should be an instance of BaseController", () => {
    expect(questionController).toBeInstanceOf(BaseController);
  });

  describe("#configure", () => {
    let prototypeSpy;
    let questionToTranslationsSpy;

    beforeEach(() => {
      req.form.options = {
        fields: {},
      };

      req.session.question = {
        questionID: "Q1",
        legend: "l",
        text: "t",
        t: "t",
        answerFormat: {
          identifier: "A9",
          fieldType: "G",
          answerList: ["V1", "V2", "V3"],
        },
      };

      prototypeSpy = vi.spyOn(BaseController.prototype, "configure");
      questionToTranslationsSpy = vi
        .spyOn(dynamicQuestion, "questionToTranslations")
        .mockReturnValue(undefined);

      questionController = new QuestionController({ route: "/test" });

      questionController.configure(req, res, next);
    });

    afterEach(() => {
      prototypeSpy.mockRestore();
      questionToTranslationsSpy.mockRestore();
    });

    it("should build fallback translations", () => {
      expect(questionToTranslationsSpy).toHaveBeenCalled();
    });

    it("should add question as req.form.options", () => {
      expect(req.form.options.fields.Q1).toEqual({
        type: "radios",
        validate: ["required"],
        items: ["V1", "V2", "V3", { divider: true, key: "answers.divider" }],
      });
    });

    it("should call super.configure", () => {
      expect(prototypeSpy).toHaveBeenCalledWith(req, res, next);
    });
  });

  describe("configured question undefined", () => {
    let prototypeSpy;
    let questionToTranslationsSpy;

    beforeEach(() => {
      req.form.options = {
        fields: {},
      };

      req.session.question = undefined;

      prototypeSpy = vi.spyOn(BaseController.prototype, "configure");
      questionToTranslationsSpy = vi
        .spyOn(dynamicQuestion, "questionToTranslations")
        .mockReturnValue(undefined);

      questionController = new QuestionController({ route: "/test" });

      questionController.configure(req, res, next);
    });

    afterEach(() => {
      prototypeSpy.mockRestore();
      questionToTranslationsSpy.mockRestore();
    });

    it("should not build fallback translations", () => {
      expect(questionToTranslationsSpy).not.toHaveBeenCalled();
    });

    it("should not add question as req.form.options", () => {
      expect(req.form.options.fields.Q1).not.toEqual({
        type: "radios",
        validate: ["required"],
        items: ["V1", "V2", "V3"],
      });
    });

    it("should not call super.configure", () => {
      expect(prototypeSpy).not.toHaveBeenCalledWith(req, res, next);
    });

    it("should call next with an error", () => {
      const [callErr] = next.mock.calls[0];
      expect(callErr).toBeInstanceOf(Error);
      expect(callErr.message).toBe(
        "Current session has no Question to configure."
      );
    });
  });

  describe("#locals", () => {
    let prototypeSpy;
    let translate;
    let questionToRadiosSpy;

    beforeEach(() => {
      prototypeSpy = vi.spyOn(BaseController.prototype, "locals");

      questionToRadiosSpy = vi
        .spyOn(presenters, "questionToRadios")
        .mockReturnValue({ name: "Q1" });

      translate = vi.fn();
      req.translate = translate;
    });

    afterEach(() => {
      prototypeSpy.mockRestore();
      questionToRadiosSpy.mockRestore();
    });

    it("should call locals first with a callback", () => {
      questionController.locals(req, res, next);

      expect(prototypeSpy).toHaveBeenCalledBefore(next);
    });

    it("should add question from session into locals", () => {
      req.session.question = "question";
      questionController.locals(req, res, next);

      expect(next).toHaveBeenCalledWith(null, { question: { name: "Q1" } });
    });

    describe("with error on callback", () => {
      let error;
      let locals;
      let superLocals;

      beforeEach(async () => {
        error = new Error("Random error");
        superLocals = {
          superKey: "superValue",
        };

        locals = {
          key: "value",
        };
        res.locals = locals;
        prototypeSpy.mockImplementation((_req, _res, cb) =>
          cb(error, superLocals)
        );

        await questionController.locals(req, res, next);
      });

      it("should call callback with error and existing locals", () => {
        expect(next).toHaveBeenCalledWith(error, superLocals);
      });
    });
  });

  describe("#saveValues", () => {
    let prototypeSpy;

    beforeEach(() => {
      prototypeSpy = vi.spyOn(BaseController.prototype, "saveValues");

      req.session.question = { questionID: "Q1" };
      req.session.tokenId = "abcdef";
      req.sessionModel.set("Q1", "A1");
    });

    afterEach(() => {
      prototypeSpy.mockRestore();
    });

    it("should call super.saveValues first with callback", async () => {
      await questionController.saveValues(req, res, next);

      expect(prototypeSpy).toHaveBeenCalled();
    });

    it("should call next with error when super.saveValues has an error", async () => {
      const error = new Error("Random error");
      prototypeSpy.mockImplementation((_req, _res, cb) => cb(error, next));

      await questionController.saveValues(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it("should post to answer", async () => {
      await questionController.saveValues(req, res, next);

      const headers = {
        "session-id": "abcdef",
        session_id: "abcdef",
        "txma-audit-encoded": "dummy-txma-header",
        "x-forwarded-for": "127.0.0.1",
      };

      expect(req.customFetch).toHaveBeenCalledWith(API.PATHS.ANSWER, {
        method: "POST",
        jsonBody: { questionId: "Q1", answer: "A1" },
        headers,
      });
    });

    it("should get next question", async () => {
      req.customFetch = vi
        .fn()
        .mockResolvedValueOnce(new Response())
        .mockResolvedValueOnce(new Response(JSON.stringify({ questionId: 1 })));

      const headers = {
        "session-id": "abcdef",
        session_id: "abcdef",
        "txma-audit-encoded": "dummy-txma-header",
        "x-forwarded-for": "127.0.0.1",
      };

      await questionController.saveValues(req, res, next);

      expect(req.customFetch).toHaveBeenCalledWith(API.PATHS.ANSWER, {
        method: "POST",
        jsonBody: { questionId: "Q1", answer: "A1" },
        headers,
      });
      expect(req.customFetch).toHaveBeenCalledWith(API.PATHS.QUESTION, {
        method: "GET",
        headers,
      });
    });

    describe("with no current session question", () => {
      beforeEach(async () => {
        req.customFetch = vi.fn().mockResolvedValue(new Response());
        req.session.question = undefined;
      });

      it("should call next with an error", async () => {
        await questionController.saveValues(req, res, next);

        const [callErr] = next.mock.calls[0];
        expect(callErr).toBeInstanceOf(Error);
        expect(callErr.message).toBe(
          "Current session has no Question to save."
        );
      });
    });

    describe("on post answer error", () => {
      let error;

      beforeEach(async () => {
        error = new Error("Random error");
        req.customFetch = vi.fn().mockRejectedValue(error);

        await questionController.saveValues(req, res, next);
      });

      it("should call callback with error", () => {
        expect(next).toHaveBeenCalledWith(error);
      });
      it("should call callback once", () => {
        expect(next).toHaveBeenCalledOnce();
      });
    });

    describe("on get question error", () => {
      let error;

      beforeEach(async () => {
        error = new Error("Random error");

        req.customFetch = vi
          .fn()
          .mockResolvedValueOnce(new Response())
          .mockRejectedValueOnce(error);

        await questionController.saveValues(req, res, next);
      });

      it("should call callback with error", () => {
        expect(next).toHaveBeenCalledWith(error);
      });
      it("should call callback once", () => {
        expect(next).toHaveBeenCalledOnce();
      });
    });
    describe("on get question complete", () => {
      beforeEach(async () => {
        req.customFetch = vi
          .fn()
          .mockResolvedValueOnce(new Response())
          .mockResolvedValueOnce(new Response(JSON.stringify({})));

        await questionController.saveValues(req, res, next);
      });

      it("should call callback", () => {
        expect(next).toHaveBeenCalledWith();
      });
      it("should call callback once", () => {
        expect(next).toHaveBeenCalledOnce();
      });
    });
  });

  describe("#next", () => {
    describe("with current session question", () => {
      it("should return question", () => {
        req.session.question = "question";

        const path = questionController.next(req, res, next);

        expect(path).toBe("question");
      });
    });
    describe("with no current session question", () => {
      it("should return done", () => {
        req.session.question = undefined;

        const path = questionController.next(req, res, next);

        expect(path).toBe("done");
      });
    });
  });
});
