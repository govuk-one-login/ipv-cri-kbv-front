const BaseController = require("hmpo-form-wizard").Controller;
const DetailsController = require("./personal-details");

describe("details controller", () => {
  const address = new DetailsController({ route: "/test" });

  it("should be an instance of BaseController", () => {
    expect(address).to.be.an.instanceOf(BaseController);
  });
});
