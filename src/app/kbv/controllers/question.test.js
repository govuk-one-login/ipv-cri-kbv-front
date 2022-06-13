const proxyquire = require("proxyquire").noCallThru();
const BaseController = require("hmpo-form-wizard").Controller;
const QuestionController = require("./question");

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
    expect(questionController).to.be.an.instanceOf(BaseController);
  });

  describe("#configure", () => {
    let buildFallbackTranslationsStub;
    let translateWrapperStub;
    let ProxiedQuestionController;
    let prototypeSpy;

    beforeEach(() => {
      buildFallbackTranslationsStub = sinon.fake();
      translateWrapperStub = sinon.fake();

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

      prototypeSpy = sinon.stub(BaseController.prototype, "configure");
      BaseController.prototype.configure.callThrough();

      ProxiedQuestionController = proxyquire("./question", {
        "../../../lib/dynamic-i18n": {
          buildFallbackTranslations: buildFallbackTranslationsStub,
          translateWrapper: translateWrapperStub,
        },
      });

      questionController = new ProxiedQuestionController({ route: "/test" });

      questionController.configure(req, res, next);
    });

    afterEach(() => {
      prototypeSpy.restore();
    });

    it("should build fallback translations", () => {
      expect(buildFallbackTranslationsStub).to.have.been.called;
    });
    it("should add question as req.form.options", () => {
      expect(req.form.options.fields.Q1).to.deep.equal({
        label: "t",
        type: "radios",
        validate: ["required"],
        fieldset: {
          legend: {
            text: `fields.questionX.legend`,
          },
        },
        items: ["V1", "V2", "V3"],
      });
    });

    it("should call super.configure", () => {
      expect(prototypeSpy).to.have.been.calledWith(req, res, next);
    });
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

      req.session.question = { questionID: "Q1" };
      req.session.tokenId = "abcdef";
      req.sessionModel.set("Q1", "A1");
    });

    afterEach(() => {
      prototypeSpy.restore();
    });

    it("should call super.saveValues first with callback", async () => {
      await questionController.saveValues(req, res, next);

      expect(prototypeSpy).to.have.been.calledBefore(next);
    });

    it("should call next with error when super.saveValues has an error", async () => {
      const error = new Error("Random error");
      BaseController.prototype.saveValues.callsArgWith(2, error, next);

      await questionController.saveValues(req, res, next);

      expect(next).to.have.been.calledWith(error);
    });

    it("should post to answer", async () => {
      await questionController.saveValues(req, res, next);

      expect(req.axios.post).to.have.been.calledWith(
        "/answer",
        { questionId: "Q1", answer: "A1" },
        { headers: { "session-id": "abcdef" } }
      );
    });

    it("should get next question", async () => {
      req.axios.post = sinon.fake.returns({});
      req.axios.get = sinon.fake.returns({
        data: { questionId: 1 },
      });

      await questionController.saveValues(req, res, next);

      expect(req.axios.post).to.have.been.called;
      expect(req.axios.post).to.have.been.called;

      expect(req.axios.get).to.have.been.called;
      expect(req.axios.get).to.have.been.calledWith("/question", {
        headers: { "session-id": "abcdef" },
      });
    });

    context("on post answer error", () => {
      let error;

      beforeEach(async () => {
        error = new Error("Random error");
        req.axios.post = sinon.fake.rejects(error);

        await questionController.saveValues(req, res, next);
      });

      it("should call callback with error", () => {
        expect(next).to.have.been.calledWith(error);
      });
      it("should call callback once", () => {
        expect(next).to.have.been.calledOnce;
      });
    });

    context("on get question error", () => {
      let error;

      beforeEach(async () => {
        error = new Error("Random error");

        req.axios.post = sinon.fake.returns(200);
        req.axios.get = sinon.fake.rejects(error);

        await questionController.saveValues(req, res, next);
      });

      it("should call callback with error", () => {
        expect(next).to.have.been.calledWith(error);
      });
      it("should call callback once", () => {
        expect(next).to.have.been.calledOnce;
      });
    });
    context("on get question complete", () => {
      beforeEach(async () => {
        req.axios.post = sinon.fake.resolves(200);
        req.axios.get = sinon.fake.resolves({ data: {} });

        await questionController.saveValues(req, res, next);
      });

      it("should call callback", () => {
        expect(next).to.have.been.calledWith();
      });
      it("should call callback once", () => {
        expect(next).to.have.been.calledOnce;
      });
    });
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
