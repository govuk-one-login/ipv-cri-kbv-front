const presenters = require("./");

describe("answer-to-radio-item", () => {
  let translate;
  let result;
  let answer;

  beforeEach(() => {
    translate = sinon.stub().returnsArg(0);
  });

  context("'NONE OF THE ABOVE / DOES NOT APPLY'", () => {
    beforeEach(() => {
      answer = "NONE OF THE ABOVE / DOES NOT APPLY";

      result = presenters.answerToRadioItem(answer, translate);
    });

    it("should return radio item structure", () => {
      expect(result).to.deep.equal({
        id: answer,
        value: answer,
        text: "NONE OF THE ABOVE / DOES NOT APPLY",
      });
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
        text: "OVER £9,500 UP TO £10,000",
      });
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
        text: "UP TO £8,500",
      });
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
        text: "OVER £9,500 UP TO £10,000",
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
        text: "UP TO 6 MONTHS",
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
        text: "OVER 12 MONTHS UP TO 19 MONTHS",
      });
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
      });
    });
  });
});
