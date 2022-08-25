const dynamicI18n = require("./dynamic-i18n");

describe("dynamic-i18n", () => {
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
