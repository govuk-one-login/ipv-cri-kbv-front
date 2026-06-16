export function singleKeyNotDynamic(key) {
  return typeof key === "string" && !key.startsWith("fields.Q");
}

export function multipleKeysNotDynamic(key) {
  return (
    Array.isArray(key) && !key.some((entry) => entry.startsWith("fields.Q"))
  );
}
