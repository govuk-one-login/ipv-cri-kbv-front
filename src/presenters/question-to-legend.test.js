const presenters = require("./");

describe("question-to-hint", () => {
  let translate;
  let question;

  beforeEach(() => {
    question = {
      questionID: "Q00",
      text: "question text",
    };

    translate = sinon.stub();
  });

  it("should call translate using questionID", () => {
    presenters.questionToLegend(question, translate);

    expect(translate).to.have.been.calledWithExactly("fields.Q00.legend");
  });

  context("with found key", () => {
    it("should return translated hint", () => {
      translate.returns("translated question legend");

      const result = presenters.questionToLegend(question, translate);

      expect(result).to.equal("translated question legend");
    });
  });

  context("with undefined key", () => {
    it("should fallback to using tooltip from question", () => {
      translate.returns(undefined);

      const result = presenters.questionToLegend(question, translate);

      expect(result).to.equal("question text");
    });
  });

  context("with fallback translation key behaviour", () => {
    it("should fallback to using tooltip from question", () => {
      translate.returns("fields.Q00.legend");

      const result = presenters.questionToLegend(question, translate);

      expect(result).to.equal("question text");
    });
  });
});
