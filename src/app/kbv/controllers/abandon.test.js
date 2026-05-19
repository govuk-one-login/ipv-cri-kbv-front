const BaseController = require("hmpo-form-wizard").Controller;
const AbandonController = require("./abandon");
const { API } = require("../../../lib/config");
import { setupDefaultMocks } from "../../../../test/utils/helpers.js";

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
    expect(abandonController).toBeInstanceOf(BaseController);
  });

  describe("#saveValues", () => {
    describe("on journey abandoned", () => {
      it("should call abandon endpoint", async () => {
        req.axios.post = vi.fn().mockResolvedValue(undefined);

        req.form.values.abandonRadio = "stop";

        const headers = {
          "session-id": req.session.tokenId,
          session_id: req.session.tokenId,
          "txma-audit-encoded": "dummy-txma-header",
          "x-forwarded-for": "127.0.0.1",
        };

        await abandonController.saveValues(req, res, next);
        expect(next).toHaveBeenCalledOnce();
        expect(req.axios.post).toHaveBeenCalledWith(
          API.PATHS.ABANDON,
          {},
          { headers }
        );
      });

      it("should not call abandon endpoint", async () => {
        req.axios.post = vi.fn().mockResolvedValue(undefined);

        await abandonController.saveValues(req, res, next);
        expect(next).toHaveBeenCalledOnce();
        expect(req.axios.post).not.toHaveBeenCalled();
      });
    });
  });
});
