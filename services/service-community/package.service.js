"use strict";
const project = require('./package.json');
const serviceName = project.name;
const validator = require('validator');
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
		},
		jwt: {
			enable: validator.toBoolean(process.env.STEEDOS_IDENTITY_JWT_ENABLED || 'false', true),
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

		if(this.settings.jwt.enable){
			this.broker.createService(require("@steedos/service-identity-jwt"));
		}

		// 启动 steedos-server 服务
        this.broker.createService(require("@steedos/service-steedos-server"));

        // 启动 本地 CDN
        this.broker.createService(require("@steedos/ee_unpkg-local"));

        // 启动 登录页面
        this.broker.createService(require("@steedos/webapp-accounts"));

        // 故障报告服务
		this.broker.createService(require("@steedos/service-sentry"));
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {
		
	}
};
