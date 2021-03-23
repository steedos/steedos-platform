"use strict";

"use strict";
import { ActionHandlers } from './actionsHandler';

const apps = require('@steedos/service-metadata-apps');
const objects = require('@steedos/service-metadata-objects');
const permissionsets = require('@steedos/service-metadata-permissionsets');
const translations = require('@steedos/service-metadata-translations');
const triggers = require('@steedos/service-metadata-triggers');

module.exports = {
  name: "metadata",
  namespace: "steedos",
  /**
   * Settings
   */
  settings: {

  },
  
  /**
	 * Actions
	 */
	actions: {
		get: {
			rest: {
				method: "GET",
				path: "/object"
			},
			async handler(ctx) {
				return await ActionHandlers.get(ctx);
			}
		},
		filter: {
			params: {
				key: "string"
			},
			async handler(ctx){
				return await ActionHandlers.filter(ctx);
			}
		},
		add:{
			async handler(ctx){
				return await ActionHandlers.add(ctx);
			}
		},
		delete:{
			async handler(ctx){
				return await ActionHandlers.delete(ctx);
			}
		}
	},

	/**
	 * Service created lifecycle event handler
	 */
	async created() {
    this.broker.createService(apps);
    this.broker.createService(objects);
    this.broker.createService(permissionsets);
    this.broker.createService(translations);
    this.broker.createService(triggers);
	},
}
