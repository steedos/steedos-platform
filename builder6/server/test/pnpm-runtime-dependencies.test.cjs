const assert = require("node:assert/strict");

const routerPackagePath = require.resolve("@steedos/router/package.json");
const routerPackage = require(routerPackagePath);
assert.equal(routerPackage.name, "@steedos/router");

const steedosRouter = require("@steedos/router");
assert.equal(typeof steedosRouter.staticRouter, "function");

const router = steedosRouter.staticRouter();
assert.ok(router);
assert.equal(typeof router.use, "function");
assert.equal(Array.isArray(router.stack), true);

console.log("pnpm runtime dependency checks passed");
