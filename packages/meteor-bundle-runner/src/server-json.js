var fs = require("fs");
var path = require("path");
var serverJsonPath = path.resolve(__steedos_bootstrap__.serverDir, "program.json");
module.exports = JSON.parse(
  fs.readFileSync(serverJsonPath, 'utf8').normalize('NFC')
);
