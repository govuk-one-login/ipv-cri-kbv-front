const BaseController = require("hmpo-form-wizard").Controller;
const QuestionController = require("./question");

describe("Question controller", () => {
  const questionController = new QuestionController({ route: "/test" });

  let req;
  let res;
  let next;

  beforeEach(() => {
    const setup = setupDefaultMocks();
    req = setup.req;
    res = setup.res;
    next = setup.next;
  });

  it("should be an instance of BaseController", () => {
    expect(questionController).to.be.an.instanceOf(BaseController);
  });

  describe("#configure", () => {
    it("should build override translations");
    it("should add question as req.form.options");
    it("should add override translate as req.form.options");
    it("should call super.configure");
  });

  describe("#locals", () => {
    let prototypeSpy;

    beforeEach(() => {
      prototypeSpy = sinon.stub(BaseController.prototype, "locals");
      BaseController.prototype.locals.callThrough();
    });

    afterEach(() => {
      prototypeSpy.restore();
    });

    it("should call locals first with a callback", () => {
      questionController.locals(req, res, next);

      expect(prototypeSpy).to.have.been.calledBefore(next);
    });

    it("should add question from session into locals", () => {
      req.session.question = "question";
      questionController.locals(req, res, next);

      expect(next).to.have.been.calledWith(null, { question: "question" });
    });

    context("with error on callback", () => {
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
        BaseController.prototype.locals.yields(error, superLocals);

        await questionController.locals(req, res, next);
      });

      it("should call callback with error and existing locals", () => {
        expect(next).to.have.been.calledWith(error, superLocals);
      });
    });
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
      questionController.saveValues(req, res, next);

      expect(prototypeSpy).to.have.been.calledBefore(next);
    });
    it("should post to answer");
    it("should get next question");
    it("should use callback");
    context("on post answer error", () => {});
    context("on get question error", () => {});
    context("on get question complete", () => {});
  });

  describe("#next", () => {
    context("with current session question", () => {
      it("should return question", () => {
        req.session.question = "question";

        const path = questionController.next(req, res, next);

        expect(path).to.equal("question");
      });
    });
    context("with no current session question", () => {
      it("should return done", () => {
        req.session.question = undefined;

        const path = questionController.next(req, res, next);

        expect(path).to.equal("done");
      });
    });
  });
});
