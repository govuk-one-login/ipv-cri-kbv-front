const dynamicI18n = require("./dynamic-i18n");

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
      } = dynamicI18n.buildFallbackTranslations(question);

      expect(legend).to.equal(`${question.text}`);
    });

    it("should use question.text for label", () => {
      const {
        fields: {
          Q1: { label },
        },
      } = dynamicI18n.buildFallbackTranslations(question);

      expect(label).to.equal(`${question.text}`);
    });
    it("should use question.toolTip for hint", () => {
      const {
        fields: {
          Q1: { hint },
        },
      } = dynamicI18n.buildFallbackTranslations(question);

      expect(hint).to.equal(`${question.toolTip}`);
    });
    it("should use i18n for default validation error", () => {
      const {
        fields: {
          Q1: {
            validation: { default: defaultValidation },
          },
        },
      } = dynamicI18n.buildFallbackTranslations(question);

      expect(defaultValidation).to.equal("You need to answer the question");
    });

    describe("items", () => {
      let items;

      beforeEach(() => {
        const fields = dynamicI18n.buildFallbackTranslations(question);
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
    let dynamicTranslate;

    beforeEach(() => {
      translate = sinon.fake();
      dynamicTranslate = sinon.stub();

      wrapper = dynamicI18n.translateWrapper(translate, dynamicTranslate, {
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

      describe("with a single fields.question key", () => {
        let value;

        beforeEach(() => {
          dynamicTranslate.returns("label");
          value = wrapper("fields.Q1.label", ["en-GB", "en"]);
        });

        it("should use dynamicTranslate before original translate", () => {
          expect(dynamicTranslate).to.have.been.calledBefore(translate);
        });

        it("should call dynamicTranslate with key, options, and fallback translations", () => {
          expect(dynamicTranslate).to.have.been.calledWith({
            key: "fields.Q1.label",
            options: ["en-GB", "en"],
            translate: sinon.match.func,
            fallbackTranslations: {
              fields: {
                Q1: {
                  label: "label",
                },
              },
            },
          });
        });

        it("should return overridden value", () => {
          expect(value).to.equal("label");
        });
      });

      describe("with an array containing a single fields.question key", () => {
        let value;

        beforeEach(() => {
          dynamicTranslate.returns("label");
          value = wrapper(["fields.Q1.label"], ["en-GB", "en"]);
        });

        it("should use dynamicTranslate before original translate", () => {
          expect(dynamicTranslate).to.have.been.calledBefore(translate);
        });

        it("should call dynamicTranslate with key, options, and fallback translations", () => {
          expect(dynamicTranslate).to.have.been.calledWith({
            key: ["fields.Q1.label"],
            options: ["en-GB", "en"],
            translate: sinon.match.func,
            fallbackTranslations: {
              fields: {
                Q1: {
                  label: "label",
                },
              },
            },
          });
        });

        it("should return overridden value", () => {
          expect(value).to.equal("label");
        });
      });

      describe("with an array containing multiple fields.question keys", () => {
        let value;

        beforeEach(() => {
          dynamicTranslate.returns("label");
          value = wrapper(
            ["fields.Q1.label", "fields.Q1.legend"],
            ["en-GB", "en"]
          );
        });

        it("should use dynamicTranslate before original translate", () => {
          expect(dynamicTranslate).to.have.been.calledBefore(translate);
        });

        it("should call dynamicTranslate with key, options, and fallback translations", () => {
          expect(dynamicTranslate).to.have.been.calledWith({
            key: ["fields.Q1.label", "fields.Q1.legend"],
            options: ["en-GB", "en"],
            translate: sinon.match.func,
            fallbackTranslations: {
              fields: {
                Q1: {
                  label: "label",
                },
              },
            },
          });
        });

        it("should return overridden value", () => {
          expect(value).to.equal("label");
        });
      });
    });
  });
});
