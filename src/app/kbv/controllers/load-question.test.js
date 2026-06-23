import wizard from "hmpo-form-wizard";
import LoadQuestionController from "./load-question.js";
import { API } from "../../../lib/config.js";
import { setupDefaultMocks } from "../../../../test/utils/helpers.js";

const BaseController = wizard.Controller;

describe("Load Question controller", () => {
  let loadQuestionController;

  let req;
  let res;
  let next;

  beforeEach(() => {
    const setup = setupDefaultMocks();
    req = setup.req;
    res = setup.res;
    next = setup.next;
    req.session.tokenId = "dummy-session-id";
    loadQuestionController = new LoadQuestionController({ route: "/test" });
  });

  it("should be an instance of BaseController", () => {
    expect(loadQuestionController).toBeInstanceOf(BaseController);
  });

  describe("#saveValues", () => {
    let prototypeSpy;

    beforeEach(() => {
      prototypeSpy = vi.spyOn(BaseController.prototype, "saveValues");
    });

    afterEach(() => {
      prototypeSpy.mockRestore();
    });

    it("should call super.saveValues first with callback", () => {
      loadQuestionController.saveValues(req, res, next);

      expect(prototypeSpy).toHaveBeenCalled();
    });

    it("should get next question", async () => {
      await loadQuestionController.saveValues(req, res, next);

      const headers = {
        "session-id": req.session.tokenId,
        session_id: req.session.tokenId,
        "txma-audit-encoded": "dummy-txma-header",
        "x-forwarded-for": "127.0.0.1",
      };

      expect(req.customFetch).toHaveBeenCalledExactlyOnceWith(
        API.PATHS.QUESTION,
        {
          method: "GET",
          headers,
        }
      );
    });

    it("should set question", async () => {
      req.customFetch = vi
        .fn()
        .mockResolvedValue(new Response(JSON.stringify({ questionId: 1 })));

      await loadQuestionController.saveValues(req, res, next);
      await vi.waitFor(() => expect(next).toHaveBeenCalled());

      expect(req.session.question).toEqual({ questionId: 1 });
    });

    it.todo("should use callback");

    describe("on get question error", () => {
      let error;
      beforeEach(async () => {
        error = new Error("Random error");
        req.customFetch = vi.fn().mockRejectedValue(error);

        await loadQuestionController.saveValues(req, res, next);
      });

      it("should not set req.session.question", () => {
        expect(req.session.question).toBeUndefined();
      });
      it("should call next with error", () => {
        expect(next).toHaveBeenCalledWith(error);
      });
    });
  });

  describe("#next", () => {
    describe("with current session question", () => {
      it.todo("should return question");
    });
    describe("with no current session question", () => {
      it.todo("should return done");
    });
  });
});
