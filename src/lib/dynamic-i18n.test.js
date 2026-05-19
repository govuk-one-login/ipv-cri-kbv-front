const dynamicI18n = require("./dynamic-i18n");

describe("dynamic-i18n", () => {
  describe("#translateWrapper", () => {
    let wrapper;
    let translate;
    let dynamicTranslate;

    beforeEach(() => {
      translate = vi.fn();
      dynamicTranslate = vi.fn();

      wrapper = dynamicI18n.translateWrapper(translate, dynamicTranslate, {
        fields: {
          Q1: {
            label: "label",
          },
        },
      });
    });

    it("should return a function", () => {
      expect(wrapper).toBeInstanceOf(Function);
    });

    describe("on execution", () => {
      describe("singular key is not fields.question", () => {
        it("should use original translate", () => {
          wrapper("pages.Q1.title", ["en-GB", "en"]);

          expect(translate).toHaveBeenCalledWith("pages.Q1.title", [
            "en-GB",
            "en",
          ]);
        });
      });
      describe("array of keys does not include question", () => {
        it("should use original translate", () => {
          wrapper(["pages.Q1.h1", "pages.Q1.title"], ["en-GB", "en"]);

          expect(translate).toHaveBeenCalledWith(
            ["pages.Q1.h1", "pages.Q1.title"],
            ["en-GB", "en"]
          );
        });
      });

      describe("with a single fields.question key", () => {
        let value;

        beforeEach(() => {
          dynamicTranslate.mockReturnValue("label");
          value = wrapper("fields.Q1.label", ["en-GB", "en"]);
        });

        it("should use dynamicTranslate before original translate", () => {
          expect(dynamicTranslate).toHaveBeenCalled();
        });

        it("should call dynamicTranslate with key, options, and fallback translations", () => {
          expect(dynamicTranslate).toHaveBeenCalledWith({
            key: "fields.Q1.label",
            options: ["en-GB", "en"],
            translate: expect.any(Function),
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
          expect(value).toBe("label");
        });
      });

      describe("with an array containing a single fields.question key", () => {
        let value;

        beforeEach(() => {
          dynamicTranslate.mockReturnValue("label");
          value = wrapper(["fields.Q1.label"], ["en-GB", "en"]);
        });

        it("should use dynamicTranslate before original translate", () => {
          expect(dynamicTranslate).toHaveBeenCalled();
        });

        it("should call dynamicTranslate with key, options, and fallback translations", () => {
          expect(dynamicTranslate).toHaveBeenCalledWith({
            key: ["fields.Q1.label"],
            options: ["en-GB", "en"],
            translate: expect.any(Function),
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
          expect(value).toBe("label");
        });
      });

      describe("with an array containing multiple fields.question keys", () => {
        let value;

        beforeEach(() => {
          dynamicTranslate.mockReturnValue("label");
          value = wrapper(
            ["fields.Q1.label", "fields.Q1.legend"],
            ["en-GB", "en"]
          );
        });

        it("should use dynamicTranslate before original translate", () => {
          expect(dynamicTranslate).toHaveBeenCalled();
        });

        it("should call dynamicTranslate with key, options, and fallback translations", () => {
          expect(dynamicTranslate).toHaveBeenCalledWith({
            key: ["fields.Q1.label", "fields.Q1.legend"],
            options: ["en-GB", "en"],
            translate: expect.any(Function),
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
          expect(value).toBe("label");
        });
      });
    });
  });
});
