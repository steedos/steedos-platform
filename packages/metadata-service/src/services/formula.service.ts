"use strict";

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "formula",
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
				path: "/formula"
			},
			async handler() {
				return "Get formula";
			}
		},
		add:{
			handler(ctx){
				console.log("add formula");
				return true;
			}
		},
		change:{
            handler(ctx){
				console.log("change formula");
				return true;
			}
		},
		delete:{
            handler(ctx){
				console.log("delete formula");
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
