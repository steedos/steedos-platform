/*
 * @Author: yinlianghui@steedos.com
 * @Date: 2022-07-20 21:31:37
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-05 16:17:01
 * @Description: 
 */
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
	async created() {
	},

	/**
	 * Service started lifecycle event handler
	 */
	async started(ctx) {

        // // 故障报告服务
		// this.broker.createService(require("@steedos/service-sentry"));

		// 启动 元数据服务
		this.broker.createService(require("@steedos/service-metadata-server"));

		// 启动 加载软件包服务
		this.broker.createService(require("@steedos/service-package-registry"));

		if(this.settings.jwt.enable){
			this.broker.createService(require("@steedos/service-identity-jwt"));
		}


        // 国际化
        this.broker.createService(require("@steedos/service-i18n"));
		
		require('@steedos/objectql').getSteedosSchema(this.broker);

		// 启动 steedos-server 服务
        // this.broker.createService(require("@steedos/service-steedos-server"));
		// 启动 本地 CDN
        // if (this.settings.unpkg.enable) {
		// 	this.broker.createService(require("@steedos/ee_unpkg-local"));
		// }
		// else{
		// 	this.broker.createService(require("@steedos/unpkg"));
		// }

        // 启动 登录页面
        this.broker.createService(require("@steedos/webapp-accounts"));

        // 产品分析
        this.broker.createService(require("@steedos/service-analytics"));
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {
		
	}
};
