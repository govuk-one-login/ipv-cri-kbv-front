const dynamicQuestion = require("./question");

describe("question", () => {
  let question;

  beforeEach(() => {
    question = {
      questionID: "Q1",
      text: "text",
      toolTip: "tooltip",
      answerFormat: {
        answerList: ["ABC", "DEF"],
      },
    };
  });

  describe("#questionToTranslations", () => {
    it("should use question.text for legend", () => {
      const {
        fields: {
          Q1: { legend },
        },
      } = dynamicQuestion.questionToTranslations(question);

      expect(legend).to.equal(`${question.text}`);
    });

    it("should use question.text for label", () => {
      const {
        fields: {
          Q1: { label },
        },
      } = dynamicQuestion.questionToTranslations(question);

      expect(label).to.equal(`${question.text}`);
    });

    it("should use question.toolTip for hint", () => {
      const {
        fields: {
          Q1: { hint },
        },
      } = dynamicQuestion.questionToTranslations(question);

      expect(hint).to.equal(`${question.toolTip}`);
    });

    it("should contain items", () => {
      const {
        fields: {
          Q1: { items },
        },
      } = dynamicQuestion.questionToTranslations(question);

      expect(items).to.have.all.keys("ABC", "DEF");
    });
  });

  describe("#answerListToTranslatedItems", () => {
    let items;

    beforeEach(() => {
      items = dynamicQuestion.answerListToTranslatedItems(
        question.answerFormat.answerList
      );
    });

    it("should contain all answers", () => {
      expect(Object.keys(items).length).to.equal(2);
    });

    it("should use answer for value", () => {
      expect(items.ABC.value).to.equal("ABC");
      expect(items.DEF.value).to.equal("DEF");
    });

    it("should use capitalised answer for label", () => {
      expect(items.ABC.label).to.equal("Abc");
      expect(items.DEF.label).to.equal("Def");
    });
  });

  describe("with missing question data", () => {
    it("should do something");
  });

  describe("#questionsToFieldsConfig", () => {
    it("should return config based on questions", () => {
      const config = dynamicQuestion.questionToFieldsConfig(question);

      expect(config).to.deep.equal({
        type: "radios",
        validate: ["required"],
        items: ["ABC", "DEF", { divider: true, key: "answers.divider" }],
      });
    });
  });

  describe("#answerListToFieldItems", () => {
    it("should return config based on answerList", () => {
      const config = dynamicQuestion.answerListToFieldItems(
        question.answerFormat.answerList
      );

      expect(config).to.deep.equal([
        "ABC",
        "DEF",
        { divider: true, key: "answers.divider" },
      ]);
    });
  });
});
