const question = require("./controllers/question");
const loadQuestion = require("./controllers/load-question");
const abandon = require("./controllers/abandon");

module.exports = {
  "/": {
    resetJourney: true,
    reset: true,
    entryPoint: true,
    skip: true,
    next: "load-question",
  },
  "/check": {
    next: "load-question",
  },
  "/load-question": {
    controller: loadQuestion,
    skip: true,
    next: loadQuestion.prototype.next,
  },
  "/question": {
    controller: question,
    next: question.prototype.next,
  },
  "/abandon": {
    prereqs: ["/kbv/load-question"],
    controller: abandon,
    fields: ["abandonRadio"],
    next: [
      {
        field: "abandonRadio",
        value: "continue",
        next: "question",
      },
      "/oauth2/callback",
    ],
  },
  "/done": {
    skip: true,
    noPost: true,
    next: "/oauth2/callback",
  },
};
