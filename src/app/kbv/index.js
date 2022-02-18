const express = require("express");

const steps = require("./steps");
const fields = require("./fields");

const router = express.Router();

router.use(
  require("hmpo-form-wizard")(steps, fields, {
    name: "kbv",
    journeyName: "kbv",
    templatePath: "kbv",
  })
);

module.exports = router;
