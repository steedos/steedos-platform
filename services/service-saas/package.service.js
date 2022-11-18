/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 1985-10-26 16:15:00
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-18 18:04:46
 * @Description: 
 */
"use strict";
const project = require('./package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-package-loader');
const validator = require('validator');
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
module.exports = {
	name: packageName,
	namespace: "steedos",
	mixins: [packageLoader],
	/**
	 * Settings
	 */
	settings: {
		packageInfo: {
			path: __dirname,
			name: packageName
		},
		jwt: {
			enable: validator.toBoolean(process.env.STEEDOS_IDENTITY_JWT_ENABLED || 'false', true),
		},
		unpkg:{
			enable: validator.toBoolean(process.env.STEEDOS_UNPKG_ENABLE_LOCAL || 'false', true)
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
	created() {
		//ApiGateway
		this.broker.createService(require('@steedos/service-api'));
						
		this.broker.createService(require("@steedos/webapp-public"));

		this.broker.createService(require("@steedos/service-accounts"));

		this.broker.createService(require("@steedos/service-charts"));

		this.broker.createService(require("@steedos/service-pages"));

		this.broker.createService(require("@steedos/service-cloud-init"));

		this.broker.createService(require("@steedos/service-workflow"));

		this.broker.createService(require("@steedos/service-plugin-amis"));

		this.broker.createService(require("@steedos/service-files"));

		// 故障报告服务
		this.broker.createService(require("@steedos/service-sentry"));

		// 启动 元数据服务
		this.broker.createService(require("@steedos/service-metadata-server"));

		// 启动 加载软件包服务
		this.broker.createService(require("@steedos/service-package-registry"));

		if(this.settings.jwt.enable){
			this.broker.createService(require("@steedos/service-identity-jwt"));
		}

		// 国际化
		this.broker.createService(require("@steedos/service-i18n"));

		// 启动 steedos-server 服务
		this.broker.createService(require("@steedos/service-steedos-server"));
		// 启动 本地 CDN
		if (this.settings.unpkg.enable) {
			this.broker.createService(require("@steedos/ee_unpkg-local"));
		}
		else{
			this.broker.createService(require("@steedos/unpkg"));
		}

		// 启动 登录页面
		this.broker.createService(require("@steedos/webapp-accounts"));

		// 产品分析
		this.broker.createService(require("@steedos/service-analytics"));
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
