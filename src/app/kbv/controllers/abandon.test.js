const BaseController = require("hmpo-form-wizard").Controller;
const { expect } = require("chai");
const AbandonController = require("./abandon");
const { API } = require("../../../lib/config");

describe("Abandon controller", () => {
  let abandonController;

  let req;
  let res;
  let next;

  beforeEach(() => {
    const setup = setupDefaultMocks();
    req = setup.req;
    res = setup.res;
    next = setup.next;
    abandonController = new AbandonController({ route: "/test" });
  });

  it("should be an instance of BaseController", () => {
    expect(abandonController).to.be.an.instanceOf(BaseController);
  });

  describe("#saveValues", () => {
    context("on journey abandoned", () => {
      it("should call abandon endpoint", async () => {
        req.axios.post = sinon.fake.resolves();

        req.form.values.abandonRadio = "stop";

        const headers = {
          "session-id": req.session.tokenId,
          session_id: req.session.tokenId,
          "txma-audit-encoded": "dummy-txma-header",
          "x-forwarded-for": "127.0.0.1",
        };

        await abandonController.saveValues(req, res, next);
        expect(next).to.have.been.calledOnce;
        expect(req.axios.post).to.have.been.calledWithExactly(
          API.PATHS.ABANDON,
          {},
          {
            headers,
          }
        );
      });

      it("should not call abandon endpoint", async () => {
        req.axios.post = sinon.fake.resolves();

        await abandonController.saveValues(req, res, next);
        expect(next).to.have.been.calledOnce;
        expect(req.axios.post).to.not.have.been.calledOnce;
      });
    });
  });
});
