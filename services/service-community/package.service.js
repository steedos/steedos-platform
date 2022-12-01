/*
 * @Author: yinlianghui@steedos.com
 * @Date: 2022-07-20 21:31:37
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-18 17:58:40
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
		},
		saas: {
			enable: validator.toBoolean(process.env.STEEDOS_TENANT_ENABLE_SAAS || 'false', true)
		},
        oidc: {
            enable: validator.toBoolean(process.env.STEEDOS_IDENTITY_OIDC_ENABLED || 'false', true),
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

		// 启动 软件包安装、卸载、重载等操作
		this.broker.createService(require("@steedos/service-package-tool"));

		if(this.settings.jwt.enable){
			this.broker.createService(require("@steedos/service-identity-jwt"));
		}

        // 启动 OIDC SSO 服务
        if (this.settings.oidc.enable) {
            this.broker.createService(require("@steedos/ee_sso-oidc"));
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


		if (this.settings.saas.enable) {
			this.broker.createService(require('@steedos/service-saas'));
		}
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {
		
	}
};
