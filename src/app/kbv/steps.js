const question = require("./controllers/question");
const loadQuestion = require("./controllers/load-question");

module.exports = {
  "/": {
    resetJourney: true,
    reset: true,
    entryPoint: true,
    skip: true,
    next: "load-question",
  },
  "/load-question": {
    controller: loadQuestion,
    skip: true,
    next: "question",
  },
  "/question": {
    controller: question,
    next: question.prototype.next,
  },
  "/done": {
    skip: true,
    noPost: true,
    next: "/oauth2/callback",
  },
};
