"use strict";

"use strict";
import { ActionHandlers } from './actionsHandler';

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
			async handler(ctx) {
				return await ActionHandlers.get(ctx);
			}
		},
		filter: {
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

}
