"use strict";

const triggerLoader = require('./lib');

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
		let settings = this.settings;
		triggerLoader.load(this.broker, settings.packagePath, settings.packageServiceName);
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
