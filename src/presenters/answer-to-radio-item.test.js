const presenters = require("./");

describe("answer-to-radio-item", () => {
  let translate;
  let result;
  let answer;

  beforeEach(() => {
    translate = sinon.stub().returnsArg(0);
  });

  context("'None of the above / does not apply'", () => {
    beforeEach(() => {
      answer = "None of the above / does not apply";

      result = presenters.answerToRadioItem(answer, translate);
    });

    it("should return radio item structure", () => {
      expect(result).to.deep.equal({
        id: answer,
        value: answer,
        text: "answers.noneOfTheAbove",
        hint: {
          html: " ",
        },
        conditional: {
          html: "",
        },
      });
    });

    it("should transform with extracted values", () => {
      expect(translate).to.have.been.calledWithExactly(
        "answers.noneOfTheAbove",
        {}
      );
    });
  });

  context("'OVER £9,500 UP TO £10,000'", () => {
    beforeEach(() => {
      answer = "OVER £9,500 UP TO £10,000";

      result = presenters.answerToRadioItem(answer, translate);
    });

    it("should return radio item structure", () => {
      expect(result).to.deep.equal({
        id: answer,
        value: answer,
        text: "answers.overUpToAmount",
        hint: {
          html: " ",
        },
        conditional: {
          html: "",
        },
      });
    });

    it("should transform 'OVER £9,500 UP TO £10,000'", () => {
      expect(translate).to.have.been.calledWithExactly(
        "answers.overUpToAmount",
        {
          amount_low: "9,500",
          amount_high: "10,000",
        }
      );
    });
  });

  context("'UP TO £8,500'", () => {
    beforeEach(() => {
      answer = "UP TO £8,500";

      result = presenters.answerToRadioItem(answer, translate);
    });

    it("should return radio item structure", () => {
      expect(result).to.deep.equal({
        id: answer,
        value: answer,
        text: "answers.upToAmount",
        hint: {
          html: " ",
        },
        conditional: {
          html: "",
        },
      });
    });

    it("should call translate with extracted values", () => {
      expect(translate).to.have.been.calledWithExactly("answers.upToAmount", {
        amount: "8,500",
      });
    });
  });

  context("'UP TO 6 MONTHS'", () => {
    beforeEach(() => {
      answer = "UP TO 6 MONTHS";

      result = presenters.answerToRadioItem(answer, translate);
    });

    it("should return radio item structure", () => {
      expect(result).to.deep.equal({
        id: answer,
        value: answer,
        text: "answers.upToMonths",
        hint: {
          html: " ",
        },
        conditional: {
          html: "",
        },
      });
    });

    it("should call translate with extracted values", () => {
      expect(translate).to.have.been.calledWithExactly("answers.upToMonths", {
        months: "6",
      });
    });
  });

  context("'OVER 12 MONTHS UP TO 19 MONTHS'", () => {
    beforeEach(() => {
      answer = "OVER 12 MONTHS UP TO 19 MONTHS";

      result = presenters.answerToRadioItem(answer, translate);
    });
    it("should return radio item structure", () => {
      expect(result).to.deep.equal({
        id: answer,
        value: answer,
        text: "answers.overUpToMonths",
        hint: {
          html: " ",
        },
        conditional: {
          html: "",
        },
      });
    });

    it("should call translate with extracted values", () => {
      expect(translate).to.have.been.calledWithExactly(
        "answers.overUpToMonths",
        {
          months_low: "12",
          months_high: "19",
        }
      );
    });
  });

  context("'AN UNMATCHED STRING'", () => {
    beforeEach(() => {
      answer = "AN UNMATCHED STRING";

      result = presenters.answerToRadioItem(answer, translate);
    });

    it("should return radio item structure", () => {
      expect(result).to.deep.equal({
        id: answer,
        value: answer,
        text: "AN UNMATCHED STRING",
        hint: {
          html: " ",
        },
        conditional: {
          html: "",
        },
      });
    });

    it("should transform with extracted values", () => {
      expect(translate).to.not.have.been.called;
    });
  });
});
