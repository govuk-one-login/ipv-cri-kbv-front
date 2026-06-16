import express from "express";
import wizard from "hmpo-form-wizard";
import steps from "./steps.js";
import fields from "./fields.js";

const router = express.Router();

router.use(
  wizard(steps, fields, {
    name: "kbv",
    journeyName: "kbv",
    templatePath: "kbv",
  })
);

export default router;
