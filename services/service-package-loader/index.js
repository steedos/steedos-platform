"use strict";

const triggerLoader = require('./lib').triggerLoader;

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "service-package-loader",

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
		loadTriggers: async function () {
			let settings = this.settings;
			await triggerLoader.load(this.broker, settings.packagePath, settings.packageServiceName);
		}
	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {
		console.log('service package loader created!!!');
	},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {
		// await this.loadTriggers();
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
