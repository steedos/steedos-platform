
const metadata = require('@steedos/service-metadata');
const packages = require('@steedos/service-packages');
const apps = require('@steedos/service-metadata-apps');
const objects = require('@steedos/service-metadata-objects');
const layouts = require('@steedos/service-metadata-layouts');
const permissionsets = require('@steedos/service-metadata-permissionsets');
const tabs = require('@steedos/service-metadata-tabs');
const translations = require('@steedos/service-metadata-translations');
const triggers = require('@steedos/service-metadata-triggers');

const queriesService = require('./lib/queriesService');
const chartsService = require('./lib/chartsService');
const pagesService = require('./lib/pagesService');
const shareRulesService = require('./lib/shareRulesService');
const restrictionRulesService = require('./lib/restrictionRulesService');

module.exports = {
	name: "metadata-server",

  /**
   * Service created lifecycle event handler
   */
  async created() {
    this.broker.createService(metadata);
    this.broker.createService(packages);
    this.broker.createService(apps);
    this.broker.createService(objects);
    this.broker.createService(layouts);
    this.broker.createService(permissionsets);
    this.broker.createService(tabs);
    this.broker.createService(translations);
    this.broker.createService(triggers);
    this.broker.createService(queriesService);
    this.broker.createService(chartsService);
    this.broker.createService(pagesService);
    this.broker.createService(shareRulesService);
    this.broker.createService(restrictionRulesService);
  },

  async started() {
    await this.broker.waitForServices(['metadata','apps','objects','permissionsets','translations','triggers']);
  }
}