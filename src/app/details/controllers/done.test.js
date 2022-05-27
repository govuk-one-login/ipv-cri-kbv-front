const BaseController = require("hmpo-form-wizard").Controller;
const proxquire = require("proxyquire");

describe("Done controller", () => {
  let axiosStub;
  let DoneController;
  let doneController;

  let req;
  let res;
  let next;

  beforeEach(() => {
    const setup = setupDefaultMocks();
    req = setup.req;
    res = setup.res;
    next = setup.next;

    axiosStub = {
      get: sinon.stub(),
    };

    DoneController = proxquire("./done", {
      axios: axiosStub,
      "../../../lib/config": {
        API: {
          BASE_URL: "http://example.com",
          PATHS: { AUTHORIZE: "/authorize" },
        },
      },
    });

    doneController = new DoneController({ route: "/test" });
  });

  it("should be an instance of BaseController", () => {
    expect(doneController).to.be.an.instanceOf(BaseController);
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
      doneController.saveValues(req, res, next);

      expect(prototypeSpy).to.have.been.calledBefore(next);
    });

    it("should call session endpoint", () => {});
    it("should add session_id to session");
    it("should use callback");
    context("on session error", () => {});
  });
});
