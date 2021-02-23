"use strict";

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "triggers",
	/**
	 * Settings
	 */
	settings: {

	},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {
		/**
		 * Say a 'Hello' action.
		 *
		 * @returns
		 */
		get: {
			rest: {
				method: "GET",
				path: "/trigger"
			},
			async handler() {
				return "Get trigger";
			}
		},
		add:{
			handler(ctx){
				console.log("add trigger");
				return true;
			}
		},
		change:{
            handler(ctx){
				console.log("change");
				return true;
			}
		},
		delete:{
            handler(ctx){
				console.log("delete");
				return true;
			}
		}
	},

	/**
	 * Events
	 */
	events: {

	},

	/**
	 * Methods
	 */
	methods: {

	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {

	},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {
		
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
