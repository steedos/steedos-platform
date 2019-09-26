const { execSync } = require('child_process');
const path = require("path");

console.log("Running build-after.js");

execSync('rm -rf .dist/node_modules');
execSync('rm -rf .dist/cfs');
execSync('rm -rf .dist/bundle/programs/server/npm');
execSync('rm -rf .dist/bundle/programs/server/*.js');

execSync('cp -r .dist/bundle/* ../object-server/server/bundle/');
