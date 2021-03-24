
const metadata = require('@steedos/service-metadata');
const apps = require('@steedos/service-metadata-apps');
const objects = require('@steedos/service-metadata-objects');
const permissionsets = require('@steedos/service-metadata-permissionsets');
const translations = require('@steedos/service-metadata-translations');
const triggers = require('@steedos/service-metadata-triggers');
const { started } = require('../../apps/steedos-project-template/moleculer.config');

module.exports = {
	name: "metadata-server",

  /**
   * Service created lifecycle event handler
   */
  async created() {
    this.broker.createService(metadata);
    this.broker.createService(apps);
    this.broker.createService(objects);
    this.broker.createService(permissionsets);
    this.broker.createService(translations);
    this.broker.createService(triggers);
  },

  async started() {
    await this.broker.waitForServices(['metadata','apps','objects','permissionsets','translations','triggers']);
  }
}