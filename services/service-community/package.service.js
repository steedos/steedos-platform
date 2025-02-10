/*
 * @Author: yinlianghui@steedos.com
 * @Date: 2022-07-20 21:31:37
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-01-15 17:43:55
 * @Description: 
 */
"use strict";
const project = require('./package.json');
const serviceName = project.name;
const validator = require('validator');
const objectql = require('@steedos/objectql');
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

        "steedos-server.started": {
            async handler() {
                if (process.env.B6_OIDC_ENABLED) {
                    objectql.getSteedosConfig().setTenant({
                        disabled_account_register: true,
                        sso_providers: {
                            oidc: {
                                name: process.env.B6_OIDC_NAME,
                                label: process.env.B6_OIDC_LABEL,
                                logo: process.env.B6_OIDC_LOGO,
                                url: process.env.B6_OIDC_URL || '/api/v6/oidc/default/login'
                            }
                        }
                    });
                }

            }
        },
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
		this.broker.createService(require("@steedos/service-objectql"));

		// rest api
		this.broker.createService(require("@steedos/service-rest"));

		//ApiGateway
		this.broker.createService(require('@steedos/service-api'));
		

		this.broker.createService(require("@steedos/service-accounts"));
		
		this.broker.createService(require("@steedos/service-pages"));

		this.broker.createService(require("@steedos/service-workflow"));

		this.broker.createService(require("@steedos/service-plugin-amis"));

		this.broker.createService(require("@steedos/service-files"));

		this.broker.createService(require("@steedos/service-ancillary"));

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
        this.broker.createService(require("@steedos/unpkg"));


        this.broker.createService(require("@steedos-builder/amis-editor"));


		if (this.settings.saas.enable) {
			this.broker.createService(require('@steedos/service-saas'));
		}

		// 启动时间触发器服务
		this.broker.createService(require("@steedos/workflow_time_trigger"));


		await this.broker.waitForServices(["@steedos/service-project"]);
		
		// console.log(require('chalk').blue('pm-'.repeat(10)));
		await this.broker.call('@steedos/service-project.addPackages', {
			packages: [
				{
					name: '@steedos/service-charts',
					enable: true
				},
				{
					name: '@steedos/steedos-plugin-schema-builder',
					enable: false
				},
			]
		});
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {
		
	}
};
