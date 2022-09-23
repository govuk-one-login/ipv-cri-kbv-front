const presenters = require("./");

describe("answer-to-radio-item", () => {
  it("should transform answers", () => {
    const result = presenters.answerToRadioItem(
      "NONE OF THE ABOVE / DOES NOT APPLY"
    );

    expect(result).to.deep.equal({
      id: "NONE OF THE ABOVE / DOES NOT APPLY",
      value: "NONE OF THE ABOVE / DOES NOT APPLY",
      text: "NONE OF THE ABOVE / DOES NOT APPLY",
    });
  });
});
