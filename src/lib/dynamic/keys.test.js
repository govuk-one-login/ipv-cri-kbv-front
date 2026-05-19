const keys = require("./keys");

describe("keys", () => {
  describe("#singleKeysNotDynamic", () => {
    describe("with string key that does not start with `fields.Q`", () => {
      it("should return false", () => {
        expect(keys.singleKeyNotDynamic("fields.idNumber")).toBe(true);
      });
    });

    describe("with string key that does start with `fields.Q`", () => {
      it("should return false", () => {
        expect(keys.singleKeyNotDynamic("fields.Q100")).toBe(false);
      });
    });
  });

  describe("#multpleKeysNotDynamic", () => {
    describe("with Array keys and no key starts with `fields.Q`", () => {
      it("should return false", () => {
        expect(
          keys.multipleKeysNotDynamic(["fields.idNumber", "fields.a100"])
        ).toBe(true);
      });
    });

    describe("with Array keys and at least one key starts with `fields.Q`", () => {
      it("should return false", () => {
        expect(
          keys.multipleKeysNotDynamic(["fields.idNumber", "fields.Q100"])
        ).toBe(false);
      });
    });
  });
});
