import { vi } from "vitest";
import JourneyModel from "hmpo-form-wizard/lib/journey-model.js";
import WizardModel from "hmpo-form-wizard/lib/wizard-model.js";

export const setupDefaultMocks = () => {
  const req = {
    url: "/",
    body: {},
    form: { values: {} },
    axios: {
      get: vi.fn(),
      post: vi.fn(),
    },
    session: {
      "hmpo-wizard-previous": {},
    },
    headers: {
      "txma-audit-encoded": "dummy-txma-header",
      "x-forwarded-for": "198.51.100.10:46532",
    },
    ip: "127.0.0.1",
  };

  req.journeyModel = new JourneyModel(null, {
    req,
    key: "test",
  });
  req.sessionModel = new WizardModel(null, {
    req,
    key: "test",
    journeyModel: req.journeyModel,
    fields: {},
  });

  const res = {};
  const next = vi.fn();

  return { req, res, next };
};
