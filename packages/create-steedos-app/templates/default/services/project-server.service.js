const packageService = require("@steedos/service-package-registry");

module.exports = {
  name: "project-server",
  namespace: "steedos",
  mixins: [packageService],
}