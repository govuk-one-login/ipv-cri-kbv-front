const dynamicTranslate = require("./dynamic-i18n");

describe("dynamic-i18n", () => {
  describe("#buildFallbackTranslations", () => {
    let question;
    beforeEach(() => {
      question = {
        questionID: "Q1",
        text: "text",
        toolTip: "tooltip",
        answerFormat: {
          answerList: ["ABC", "DEF"],
        },
      };
    });

    it("should use question.text for legend", () => {
      const {
        fields: {
          Q1: { legend },
        },
      } = dynamicTranslate.buildFallbackTranslations(question);

      expect(legend).to.equal(`${question.text}`);
    });

    it("should use question.text for label", () => {
      const {
        fields: {
          Q1: { label },
        },
      } = dynamicTranslate.buildFallbackTranslations(question);

      expect(label).to.equal(`${question.text}`);
    });
    it("should use question.toolTip for hint", () => {
      const {
        fields: {
          Q1: { hint },
        },
      } = dynamicTranslate.buildFallbackTranslations(question);

      expect(hint).to.equal(`${question.toolTip}`);
    });
    it("should use i18n for default validation error", () => {
      const {
        fields: {
          Q1: {
            validation: { default: defaultValidation },
          },
        },
      } = dynamicTranslate.buildFallbackTranslations(question);

      expect(defaultValidation).to.equal("You need to answer the question");
    });

    describe("items", () => {
      let items;

      beforeEach(() => {
        const fields = dynamicTranslate.buildFallbackTranslations(question);
        items = fields?.fields?.Q1?.items;
      });
      it("should contain all answers", () => {
        expect(Object.keys(items).length).to.equal(2);
      });
      it("should use answer for value", () => {
        expect(items.ABC.value).to.equal("ABC");
        expect(items.DEF.value).to.equal("DEF");
      });
      it("should use capitalised answer for label", () => {
        expect(items.ABC.label).to.equal("Abc");
        expect(items.DEF.label).to.equal("Def");
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
          Q1: {
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
          wrapper("pages.Q1.title", ["en-GB", "en"]);

          expect(translate).to.have.been.calledWith("pages.Q1.title", [
            "en-GB",
            "en",
          ]);
        });
      });
      describe("array of keys does not include question", () => {
        it("should use original translate", () => {
          wrapper(["pages.Q1.h1", "pages.Q1.title"], ["en-GB", "en"]);

          expect(translate).to.have.been.calledWith(
            ["pages.Q1.h1", "pages.Q1.title"],
            ["en-GB", "en"]
          );
        });
      });
      describe.skip("with a single fields.question key", () => {
        it("should not use the original translate", () => {
          wrapper("fields.Q1.label", ["en-GB", "en"]);

          expect(translate).not.to.have.been.called;
        });
        it("should return overridden value", () => {
          const value = wrapper("fields.Q1.label", ["en-GB", "en"]);

          expect(value).to.equal("label");
        });
      });
      describe.skip("with an array containing question key", () => {
        it("should return overridden value", () => {
          const value = wrapper(["fields.Q1.label"], ["en-GB", "en"]);

          expect(value).to.equal("label");
        });
      });
    });
  });
});
