const assert = require("node:assert/strict");
const test = require("node:test");

test("accounts package can resolve @steedos/router", () => {
  assert.match(require.resolve("@steedos/router"), /packages\/router\/lib\/index\.js$/);
});
