const express = require("express");

const router = express.Router();

const {
  addAuthParamsToSession,
  initSessionWithJWT,
  redirectToCallback,
  redirectToKBV,
  retrieveAuthorizationCode,
} = require("./middleware");

router.get(
  "/authorize",
  addAuthParamsToSession,
  initSessionWithJWT,
  redirectToKBV
);
router.post("/authorize", retrieveAuthorizationCode, redirectToCallback);

module.exports = router;
