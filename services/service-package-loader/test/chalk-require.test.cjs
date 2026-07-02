const assert = require("node:assert/strict");
const test = require("node:test");

test("service-package-loader can call chalk.green from CommonJS", () => {
  const chalk = require("chalk");
  const green =
    typeof chalk.green === "function"
      ? chalk.green
      : chalk.default && chalk.default.green;

  assert.equal(typeof green, "function");
  assert.equal(typeof green("service started"), "string");
});
