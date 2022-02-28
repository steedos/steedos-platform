const SidecarService = require("@steedos/service-sidecar");

module.exports = {
  name: "$sidecar",
  namespace: "steedos",
  mixins: [SidecarService],
}