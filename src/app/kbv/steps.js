import question from "./controllers/question.js";
import loadQuestion from "./controllers/load-question.js";
import abandon from "./controllers/abandon.js";

export default {
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
