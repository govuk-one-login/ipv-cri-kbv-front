const keys = require("./keys");

describe("keys", () => {
  describe("#singleKeysNotDynamic", () => {
    context("with non-string key", () => {
      it.skip("should return false", () => {
        expect(keys.singleKeyNotDynamic(0)).to.be.true;
      });
    });

    context("with string key that does not start with `fields.Q`", () => {
      it("should return false", () => {
        expect(keys.singleKeyNotDynamic("fields.idNumber")).to.be.true;
      });
    });

    context("with string key that does start with `fields.Q`", () => {
      it("should return false", () => {
        expect(keys.singleKeyNotDynamic("fields.Q100")).to.be.false;
      });
    });
  });

  describe("#multpleKeysNotDynamic", () => {
    context("with non-Array keys", () => {
      it.skip("should return false", () => {
        expect(keys.multipleKeysNotDynamic(0)).to.be.true;
      });
    });

    context("with Array keys and no key starts with `fields.Q`", () => {
      it("should return false", () => {
        expect(keys.multipleKeysNotDynamic(["fields.idNumber", "fields.a100"]))
          .to.be.true;
      });
    });

    context(
      "with Array keys and at least one key starts with `fields.Q`",
      () => {
        it("should return true", () => {
          it("should return false", () => {
            expect(
              keys.multipleKeysNotDynamic(["fields.idNumber", "fields.Q100"])
            ).to.be.false;
          });
        });
      }
    );
  });
});
