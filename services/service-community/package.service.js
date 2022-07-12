"use strict";
const project = require('./package.json');
const serviceName = project.name;

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * 软件包服务启动后也需要抛出事件。
 */
module.exports = {
	name: serviceName,
	namespace: "steedos",
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

	},

	/**
	 * Service created lifecycle event handler
	 */
	async created() {

	},

	/**
	 * Service started lifecycle event handler
	 */
	async started(ctx) {
		// 启动 元数据服务
		this.broker.createService(require("@steedos/service-metadata-server"));
		// 启动 加载软件包服务
		this.broker.createService(require("@steedos/service-package-registry"));
		// 启动 meteor服务
		this.broker.createService(require("@steedos/service-steedos-server"));
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {
		
	}
};
