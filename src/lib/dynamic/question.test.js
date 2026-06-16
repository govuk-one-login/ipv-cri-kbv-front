import * as dynamicQuestion from "./question.js";

describe("question", () => {
  let question;

  beforeEach(() => {
    question = {
      questionID: "Q1",
      text: "text",
      toolTip: "tooltip",
      answerFormat: {
        answerList: ["ABC", "DEF", "GHI", "JKL", "none of the above"],
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

      expect(legend).toBe(`${question.text}`);
    });

    it("should use question.text for label", () => {
      const {
        fields: {
          Q1: { label },
        },
      } = dynamicQuestion.questionToTranslations(question);

      expect(label).toBe(`${question.text}`);
    });

    it("should use question.toolTip for hint", () => {
      const {
        fields: {
          Q1: { hint },
        },
      } = dynamicQuestion.questionToTranslations(question);

      expect(hint).toBe(`${question.toolTip}`);
    });

    it("should contain items", () => {
      const {
        fields: {
          Q1: { items },
        },
      } = dynamicQuestion.questionToTranslations(question);

      expect(Object.keys(items)).toEqual(
        expect.arrayContaining([
          "ABC",
          "DEF",
          "GHI",
          "JKL",
          "none of the above",
        ])
      );
      expect(Object.keys(items)).toHaveLength(5);
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
      expect(Object.keys(items)).toHaveLength(5);
    });

    it("should use answer for value", () => {
      expect(items.ABC.value).toBe("ABC");
      expect(items.DEF.value).toBe("DEF");
    });

    it("should use capitalised answer for label", () => {
      expect(items.ABC.label).toBe("Abc");
      expect(items.DEF.label).toBe("Def");
    });
  });

  describe("with missing question data", () => {
    it.todo("should do something");
  });

  describe("#questionsToFieldsConfig", () => {
    it("should return config based on questions", () => {
      const config = dynamicQuestion.questionToFieldsConfig(question);

      expect(config).toEqual({
        type: "radios",
        validate: ["required"],
        items: [
          "ABC",
          "DEF",
          "GHI",
          "JKL",
          { divider: true, key: "answers.divider" },
          "none of the above",
        ],
      });
    });

    it("should verify the divider is at the 5th radio element", () => {
      const config = dynamicQuestion.questionToFieldsConfig(question);
      expect(config.items[4]).toEqual({
        divider: true,
        key: "answers.divider",
      });
    });
  });

  describe("#answerListToFieldItems", () => {
    it("should return config based on answerList", () => {
      const config = dynamicQuestion.answerListToFieldItems(
        question.answerFormat.answerList
      );

      expect(config).toEqual([
        "ABC",
        "DEF",
        "GHI",
        "JKL",
        { divider: true, key: "answers.divider" },
        "none of the above",
      ]);
    });
  });
});
