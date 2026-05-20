const BaseController = require("hmpo-form-wizard").Controller;
const LoadQuestionController = require("./load-question");
const { API } = require("../../../lib/config");
import { setupDefaultMocks } from "../../../../test/utils/helpers.js";

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

      expect(req.axios.get).toHaveBeenCalledExactlyOnceWith(
        API.PATHS.QUESTION,
        {
          headers,
        }
      );
    });

    it("should set question", async () => {
      req.axios.get = vi.fn().mockReturnValue({
        data: { questionId: 1 },
      });

      await loadQuestionController.saveValues(req, res, next);

      expect(req.session.question).toEqual({ questionId: 1 });
    });

    it.todo("should use callback");

    describe("on get question error", () => {
      let error;
      beforeEach(async () => {
        error = new Error("Random error");
        req.axios.get = vi.fn().mockRejectedValue(error);

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
