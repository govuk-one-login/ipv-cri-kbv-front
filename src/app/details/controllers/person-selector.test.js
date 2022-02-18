const BaseController = require("hmpo-form-wizard").Controller;
const PersonSelectorController = require("./person-selector");

describe("Person Selector controller", () => {
  let personSelectorController;

  let req;
  let res;
  let next;

  beforeEach(() => {
    const setup = setupDefaultMocks();
    req = setup.req;
    res = setup.res;
    next = setup.next;

    personSelectorController = new PersonSelectorController({ route: "/test" });
  });

  it("should be an instance of BaseController", () => {
    expect(personSelectorController).to.be.an.instanceOf(BaseController);
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
      req.body.preConfiguredValues = "arkilAlbert";

      personSelectorController.saveValues(req, res, next);

      expect(prototypeSpy).to.have.been.calledBefore(next);
    });
  });
});
