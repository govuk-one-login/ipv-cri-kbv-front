module.exports = {
  passportNumber: {
    type: "text",
    validate: ["numeric", { type: "exactlength", arguments: [9] }],
  },
  surname: {
    type: "text",
    validate: [],
    journeyKey: "surname",
  },
  givenNames: {
    type: "text",
    validate: [],
    journeyKey: "givenNames",
  },
  dateOfBirth: {
    type: "date",
    journeyKey: "dateOfBirth",
    validate: [
      "date",
      { type: "before", arguments: [new Date().toISOString().split("T")[0]] },
    ],
  },
  houseNameNumber: {
    type: "text",
  },
  streetName: {
    type: "text",
  },
  townCity: {
    type: "text",
  },
  postCode: {
    type: "text",
  },
  formType: {
    type: "radios",
    items: ["input", "dropDown"],
    validate: ["required"],
  },
  preConfiguredValues: {
    type: "select",
    items: ["arkilAlbert", "duffLinda", "decerqueiraKenneth"],
  },
};
