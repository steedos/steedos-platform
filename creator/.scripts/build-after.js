const { execSync } = require('child_process');
const path = require("path");

console.log("Running build-after.js");

execSync('rm -rf .dist/node_modules');
execSync('rm -rf .dist/cfs');
execSync('rm -rf .dist/bundle/programs/server/npm');
execSync('rm -rf .dist/bundle/programs/server/*.js');

execSync('rm -rf ../server/bundle/*');

execSync('cp -rf .dist/bundle/* ../server/bundle/');
execSync('cp -rf .scripts/build-fix/* ../server/bundle/');

// /web.browser.legacy 使用和 web.browser一样的代码.
execSync('rm -rf ../server/bundle/programs/web.browser.legacy/*');
execSync('cp -rf ../server/bundle/programs/web.browser/* ../server/bundle/programs/web.browser.legacy/');