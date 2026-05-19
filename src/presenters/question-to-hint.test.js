const presenters = require("./");

describe("question-to-hint", () => {
  let translate;
  let question;

  beforeEach(() => {
    question = {
      questionID: "Q00",
      toolTip: "question toolTip",
    };

    translate = vi.fn();
  });

  it("should call translate using questionID", () => {
    presenters.questionToHint(question, translate);

    expect(translate).toHaveBeenCalledWith("fields.Q00.hint");
  });

  describe("with found key", () => {
    it("should return translated hint when found", () => {
      translate.mockReturnValue("translated question hint");

      const result = presenters.questionToHint(question, translate);

      expect(result).toBe("translated question hint");
    });
  });

  describe("with undefined key", () => {
    it("should use question tooltip", () => {
      translate.mockReturnValue(undefined);

      const result = presenters.questionToHint(question, translate);

      expect(result).toBe("question toolTip");
    });
  });

  describe("with fallback to data behaviour", () => {
    it("should fallback to using tooltip", () => {
      translate.mockReturnValue("fields.Q00.hint");

      const result = presenters.questionToHint(question, translate);

      expect(result).toBe("question toolTip");
    });
  });

  describe("with missing key and data behaviour", () => {
    it("should fallback to using tooltip", () => {
      translate.mockReturnValue("fields.Q00.hint");
      question.toolTip = "";

      const result = presenters.questionToHint(question, translate);

      expect(result).toBe(" ");
    });
  });
});
