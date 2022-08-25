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

  describe("#buildFallbackTranslations", () => {
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
    it("should use i18n for default validation error", () => {
      const {
        fields: {
          Q1: {
            validation: { default: defaultValidation },
          },
        },
      } = dynamicQuestion.questionToTranslations(question);

      expect(defaultValidation).to.equal("You need to answer the question");
    });

    describe("items", () => {
      let items;

      beforeEach(() => {
        const fields = dynamicQuestion.questionToTranslations(question);
        items = fields?.fields?.Q1?.items;
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
  });

  describe("#questionsToFieldsConfig", () => {
    it("should return config based on questions", () => {
      const config = dynamicQuestion.questionToFieldsConfig(question);

      expect(config).to.deep.equal({
        label: "text",
        type: "radios",
        validate: ["required"],
        fieldset: {
          legend: {
            text: `fields.questionX.legend`,
          },
        },
        items: ["ABC", "DEF"],
      });
    });

    it("should return config based on questions and translations", () => {
      let translations = {
        fields: {
          question: {
            legend: "legend property",
          },
        },
      };

      const config = dynamicQuestion.questionToFieldsConfig(
        question,
        translations
      );

      expect(config).to.deep.equal({
        label: "legend property",
        type: "radios",
        validate: ["required"],
        fieldset: {
          legend: {
            text: `fields.questionX.legend`,
          },
        },
        items: ["ABC", "DEF"],
      });
    });
  });
});
