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
		// 启动 元数据 服务
		this.broker.createService(require("@steedos/service-metadata-server"));
		// 启动 软件包 服务
		this.broker.createService(require("@steedos/service-package-registry"));

        // 启动 OIDC SSO 服务
        this.broker.createService(require("@steedos/ee_sso-oidc"));

        // 启动 报表服务
        this.broker.createService(require("@steedos/ee_stimulsoft-reports"));

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
                    "@steedos/plugin-qywx",
                ]
            }
        });
        // 启动 企业版许可证服务
        this.broker.createService(require("@steedos/ee_service-plugin-license"));
        // 启动 sidecar服务: steedos services 跨语言访问
        // broker.createService(require("@steedos/service-sidecar"));
        // 字段级加密服务
        // broker.createService(require("@steedos/ee_plugin-field-encryption"));
        // 附件病毒扫描
        // broker.createService(require("@steedos/ee_virus-scan"));
        // 记录审计日志
        this.broker.createService(require("@steedos/ee_audit-records"));
        // 自定义品牌
        this.broker.createService(require("@steedos/ee_branding"));
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {
		
	}
};
