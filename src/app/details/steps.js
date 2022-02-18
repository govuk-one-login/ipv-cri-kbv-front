const done = require("./controllers/done");
const personalDetails = require("./controllers/personal-details");
const address = require("./controllers/address");
const personSelector = require("./controllers/person-selector");

module.exports = {
  "/": {
    resetJourney: true,
    reset: true,
    entryPoint: true,
    skip: true,
    next: "select",
  },
  "/select": {
    fields: ["formType"],
    next: [
      { field: "formType", value: "input", next: "details" },
      { field: "formType", value: "dropDown", next: "personSelector" },
    ],
  },
  "/personSelector": {
    controller: personSelector,
    fields: ["preConfiguredValues"],
    next: "done",
  },
  "/personal-details": {
    fields: ["surname", "givenNames", "dateOfBirth"],
    controller: personalDetails,
    next: "address",
  },
  "/address": {
    fields: ["houseNameNumber", "streetName", "townCity", "postCode"],
    controller: address,
    next: "done",
  },
  "/done": {
    controller: done,
    skip: true,
    next: "/kbv",
  },
};
