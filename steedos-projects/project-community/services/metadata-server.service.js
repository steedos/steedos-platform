const MetadataService = require("@steedos/service-metadata-server");

module.exports = {
  name: "metadata-server",
  namespace: "steedos",
  mixins: [MetadataService],
}