const presenters = require("./");

describe("question-to-hint", () => {
  let translate;
  let question;

  beforeEach(() => {
    question = {
      questionID: "Q00",
      toolTip: "question toolTip",
    };

    translate = sinon.stub();
  });

  it("should call translate using questionID", () => {
    presenters.questionToHint(question, translate);

    expect(translate).to.have.been.calledWithExactly("fields.Q00.hint");
  });

  context("with found key", () => {
    it("should return translated hint when found", () => {
      translate.returns("translated question hint");

      const result = presenters.questionToHint(question, translate);

      expect(result).to.equal("translated question hint");
    });
  });

  context("with undefined key", () => {
    it("should use question tooltip", () => {
      translate.returns(undefined);

      const result = presenters.questionToHint(question, translate);

      expect(result).to.equal("question toolTip");
    });
  });

  context("with fallback to data behaviour", () => {
    it("should fallback to using tooltip", () => {
      translate.returns("fields.Q00.hint");

      const result = presenters.questionToHint(question, translate);

      expect(result).to.equal("question toolTip");
    });
  });

  context("with missing key and data behaviour", () => {
    it("should fallback to using tooltip", () => {
      translate.returns("fields.Q00.hint");
      question.toolTip = "";

      const result = presenters.questionToHint(question, translate);

      expect(result).to.equal(" ");
    });
  });
});
