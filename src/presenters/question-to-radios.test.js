const presenters = require("./");

describe("question-to-radios", () => {
  let config;
  let question = {
    questionID: "Q00051",
    text: "In which month and year did you open one of your current accounts",
    toolTip: "Think about when you opened your account",
    answerFormat: {
      identifier: "A00051",
      fieldType: "R ",
      answerList: [
        "01 / 2022",
        "05 / 1999",
        "12 / 2020",
        "07 / 2012",
        "None of the above / does not apply",
      ],
    },
  };

  let translate;

  beforeEach(() => {
    translate = sinon.stub();

    config = presenters.questionToRadios(question, translate);
  });

  it("should set radio name", () => {
    expect(config.name).to.equal("Q00051");
  });

  it("should set radio label", () => {
    expect(config.label).to.equal(
      "In which month and year did you open one of your current accounts"
    );
  });

  it("should set legend label", () => {
    expect(config.legend).to.equal(
      "In which month and year did you open one of your current accounts"
    );
  });

  it("should set fieldset", () => {
    expect(config.fieldset).to.deep.equal({
      legend: {
        isPageHeading: true,
        classes: "govuk-fieldset__legend--l",
      },
    });
  });

  it("should set hint", () => {
    expect(config.hint.html).to.equal(
      "Think about when you opened your account"
    );
  });

  it("should use answers for items", () => {
    translate.returns(
      "None of the above or this question does not apply to me"
    );

    config = presenters.questionToRadios(question, translate);

    expect(translate).to.have.been.calledWith("answers.noneOfTheAbove");
    expect(config.items).to.deep.equal([
      {
        id: "01 / 2022",
        value: "01 / 2022",
        text: "01 / 2022",
        hint: {
          html: " ",
        },
        conditional: {
          html: "",
        },
      },
      {
        id: "05 / 1999",
        value: "05 / 1999",
        text: "05 / 1999",
        hint: {
          html: " ",
        },
        conditional: {
          html: "",
        },
      },
      {
        id: "12 / 2020",
        value: "12 / 2020",
        text: "12 / 2020",
        hint: {
          html: " ",
        },
        conditional: {
          html: "",
        },
      },
      {
        id: "07 / 2012",
        value: "07 / 2012",
        text: "07 / 2012",
        hint: {
          html: " ",
        },
        conditional: {
          html: "",
        },
      },
      {
        id: "None of the above / does not apply",
        value: "None of the above / does not apply",
        text: "None of the above or this question does not apply to me",
        hint: {
          html: " ",
        },
        conditional: {
          html: "",
        },
      },
    ]);
  });

  it("should accept case insensitive noneOfTheAbove radio", () => {
    translate.returns(
      "None of the above or this question does not apply to me"
    );

    question.answerFormat.answerList[4] = "NONE OF THE ABOVE / DOES NOT APPLY";

    config = presenters.questionToRadios(question, translate);

    expect(translate).to.have.been.calledWith("answers.noneOfTheAbove");
    expect(config.items[4].text).to.equal(
      "None of the above or this question does not apply to me"
    );
  });
});
