"use strict";
const project = require('./package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-meteor-package-loader');
const serviceName = `$packages-${packageName}`;
const init = require('./lib').init;
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * 软件包服务启动后也需要抛出事件。
 */
module.exports = {
	name: serviceName,
	namespace: "steedos",
	mixins: [packageLoader],
	/**
	 * Settings
	 */
	settings: {
		packageInfo: {
			path: __dirname,
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
		init: function (context) {
			console.log(`init`, new Date().getTime())
			init(context);
			console.log(`init end`, new Date().getTime())
		}
	},

	/**
	 * Service created lifecycle event handler
	 */
	async created() {
		console.log(`created`, new Date().getTime())
	},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {
		console.log(`started`, new Date().getTime())
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {
		console.log(`stopped`, new Date().getTime())
	}
};
