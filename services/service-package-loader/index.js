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
		path: '', // 扫描加载trigger.js的路径
		name: '' // service name
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
		let path = settings.path;
		let name = settings.name;
		if (!path || !name) {
			console.error(`Please config standardObjectsPackageLoader in your settings.`);
			return;
		}
		await triggerLoader.load(this.broker, path, name);
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
