import * as presenters from "./index.js";

describe("question-to-hint", () => {
  let translate;
  let question;

  beforeEach(() => {
    question = {
      questionID: "Q00",
      text: "question text",
    };

    translate = vi.fn();
  });

  it("should call translate using questionID", () => {
    presenters.questionToLegend(question, translate);

    expect(translate).toHaveBeenCalledWith("fields.Q00.legend");
  });

  describe("with found key", () => {
    it("should return translated hint", () => {
      translate.mockReturnValue("translated question legend");

      const result = presenters.questionToLegend(question, translate);

      expect(result).toBe("translated question legend");
    });
  });

  describe("with undefined key", () => {
    it("should fallback to using tooltip from question", () => {
      translate.mockReturnValue(undefined);

      const result = presenters.questionToLegend(question, translate);

      expect(result).toBe("question text");
    });
  });

  describe("with fallback to data behaviour", () => {
    it("should fallback to using tooltip from question", () => {
      translate.mockReturnValue("fields.Q00.legend");

      const result = presenters.questionToLegend(question, translate);

      expect(result).toBe("question text");
    });
  });
});
