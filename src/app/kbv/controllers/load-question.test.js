const BaseController = require("hmpo-form-wizard").Controller;

const proxquire = require("proxyquire");

describe("Load Question controller", () => {
  let LoadQuestionController;
  let loadQuestionController;

  let req;
  let res;
  let next;

  let axiosStub;

  beforeEach(() => {
    axiosStub = {
      get: sinon.stub(),
    };

    LoadQuestionController = proxquire("./load-question", {
      axios: axiosStub,
      "../../../lib/config": {
        API: {
          BASE_URL: "http://example.com",
          PATHS: { QUESTION: "/q" },
        },
      },
    });

    const setup = setupDefaultMocks();
    req = setup.req;
    res = setup.res;
    next = setup.next;

    loadQuestionController = new LoadQuestionController({ route: "/test" });
  });

  it("should be an instance of BaseController", () => {
    expect(loadQuestionController).to.be.an.instanceOf(BaseController);
  });

  describe("#saveValues", () => {
    let prototypeSpy;

    beforeEach(() => {
      prototypeSpy = sinon.stub(BaseController.prototype, "saveValues");
      BaseController.prototype.saveValues.callThrough();
    });

    afterEach(() => {
      prototypeSpy.restore();
    });

    it("should call super.saveValues first with callback", () => {
      // const question = new QuestionController({ route: "/test" });
      loadQuestionController.saveValues(req, res, next);

      expect(prototypeSpy).to.have.been.calledBefore(next);
    });

    it("should get next question", async () => {
      await loadQuestionController.saveValues(req, res, next);

      expect(axiosStub.get).to.have.been.calledOnce;
    });

    it("should set question", async () => {
      axiosStub.get.returns({
        data: { questionId: 1 },
      });

      await loadQuestionController.saveValues(req, res, next);

      expect(req.session.question).to.deep.equal({ questionId: 1 });
    });

    it("should use callback");

    context("on get question error", () => {
      let error;
      beforeEach("should call next with error", async () => {
        error = new Error("Random error");
        axiosStub.get = sinon.fake.rejects(error);

        await loadQuestionController.saveValues(req, res, next);
      });

      it("should not set req.session.question", () => {
        expect(req.session.question).to.be.undefined;
      });
      it("should call next with error", () => {
        expect(next).to.have.been.calledWith(error);
      });
    });
    context("on get question complete", () => {});
  });

  describe("#next", () => {
    context("with current session question", () => {
      it("should return question");
    });
    context("with no current session question", () => {
      it("should return done");
    });
  });
});
