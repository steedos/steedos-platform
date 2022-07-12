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
		// 启动 steedos-server 服务
        this.broker.createService({
            name: "steedos-server",
            namespace: "steedos",
            mixins: [require("@steedos/service-steedos-server")],
            settings: {
                plugins: [
                    "@steedos/ee_unpkg-local",
                    "@steedos/webapp-accounts",
                    "@steedos/plugin-dingtalk",
                    "@steedos/plugin-qywx"
                ]
            }
        });

		// if (process.env.NODE_ENV === 'development' && process.env.STEEDOS_TRACING_ENABLED) {
			this.broker.createService(require("@steedos/service-sentry"));
		// }
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {
		
	}
};
