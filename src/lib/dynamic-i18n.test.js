const dynamicTranslate = require("./dynamic-i18n");

describe("dynamic-i18n", () => {
  describe("#buildOverrideTranslations", () => {
    let question;
    beforeEach(() => {
      question = {
        text: "text",
        toolTip: "tooltip",
        answerFormat: {
          answerList: ["ABC", "DEF"],
        },
      };
    });
    it("should use question.text for context", () => {
      const {
        fields: {
          question: { content },
        },
      } = dynamicTranslate.buildOverrideTranslations(question);

      expect(content).to.equal(`${question.text} #question`);
    });

    it("should use question.text for legend", () => {
      const {
        fields: {
          question: { legend },
        },
      } = dynamicTranslate.buildOverrideTranslations(question);

      expect(legend).to.equal(`${question.text} #legend`);
    });

    it("should use question.text for label", () => {
      const {
        fields: {
          question: { label },
        },
      } = dynamicTranslate.buildOverrideTranslations(question);

      expect(label).to.equal(`${question.text} #label`);
    });
    it("should use question.toolTip for hint", () => {
      const {
        fields: {
          question: { hint },
        },
      } = dynamicTranslate.buildOverrideTranslations(question);

      expect(hint).to.equal(`${question.toolTip} #hint`);
    });
    it("should use i18n for default validation error", () => {
      const {
        fields: {
          question: {
            validation: { default: defaultValidation },
          },
        },
      } = dynamicTranslate.buildOverrideTranslations(question);

      expect(defaultValidation).to.equal("You need to answer the question");
    });

    describe("items", () => {
      let items;

      beforeEach(() => {
        const fields = dynamicTranslate.buildOverrideTranslations(question);
        items = fields?.fields?.question?.items;
      });
      it("should contain all answers", () => {
        expect(Object.keys(items).length).to.equal(2);
      });
      it("should use answer for value", () => {
        expect(items.ABC.value).to.equal("ABC");
        expect(items.DEF.value).to.equal("DEF");
      });
      it("should use capitalised answer for label", () => {
        expect(items.ABC.label).to.equal("Abc #answer");
        expect(items.DEF.label).to.equal("Def #answer");
      });
    });

    describe("with missing question data", () => {
      it("should do something");
    });
  });

  describe("#translateWrapper", () => {
    let wrapper;
    let translate;

    beforeEach(() => {
      translate = sinon.fake();

      wrapper = dynamicTranslate.translateWrapper(translate, {
        fields: {
          question: {
            label: "label",
          },
        },
      });
    });
    it("should return a function", () => {
      expect(wrapper).to.be.an.instanceOf(Function);
    });

    context("on execution", () => {
      describe("singular key is not fields.question", () => {
        it("should use original translate", () => {
          wrapper("pages.question.title", ["en-GB", "en"]);

          expect(translate).to.have.been.calledWith("pages.question.title", [
            "en-GB",
            "en",
          ]);
        });
      });
      describe("array of keys does not include question", () => {
        it("should use original translate", () => {
          wrapper(
            ["pages.question.h1", "pages.question.title"],
            ["en-GB", "en"]
          );

          expect(translate).to.have.been.calledWith(
            ["pages.question.h1", "pages.question.title"],
            ["en-GB", "en"]
          );
        });
      });
      describe("with a single fields.question key", () => {
        it("should not use the original translate", () => {
          wrapper("fields.question.label", ["en-GB", "en"]);

          expect(translate).not.to.have.been.called;
        });
        it("should return overridden value", () => {
          const value = wrapper("fields.question.label", ["en-GB", "en"]);

          expect(value).to.equal("label");
        });
      });
      describe("with an array containing question key", () => {
        it("should return overridden value", () => {
          const value = wrapper(["fields.question.label"], ["en-GB", "en"]);

          expect(value).to.equal("label");
        });
      });
    });
  });
});
