const SidecarService = require("@steedos/service-sidecar/package.service");

module.exports = {
  name: "$sidecar",
  namespace: "steedos",
  mixins: [SidecarService],
}