"use strict";
const path = require('path');
const project = require('../steedos-app/package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-package-loader');
const serviceName = `$packages-${packageName}`;
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * 软件包服务启动后也需要抛出事件。
 */
module.exports = {
	name: serviceName,
	namespace: "steedos",
	mixins: [packageLoader],
  dependencies: ['metadata-server'],
	/**
	 * Settings
	 */
	settings: {
		packageInfo: {
			path: path.join(__dirname, '../steedos-app'),
			name: serviceName
		}
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
	async created() {

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
