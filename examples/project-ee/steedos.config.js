module.exports = {
	// Namespace of nodes to segment your nodes on the same network.
	namespace: "steedos",
	// Default log level for built-in console logger. It can be overwritten in logger options above.
	// Available values: trace, debug, info, warn, error, fatal
	logLevel: "warn",

	// Called after broker started.
	started(broker) {
		// 启动 元数据 服务
		broker.createService(require("@steedos/service-metadata-server"));
		// 启动 软件包 服务
		broker.createService(require("@steedos/service-package-registry"));

        // 启动 oidc sso 服务
        // broker.createService(require("@steedos/ee_sso-oidc"));

        // 启动 报表服务
        broker.createService(require("@steedos/ee_stimulsoft-reports"));

        // 启动 steedos-server 服务
        broker.createService({
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
        broker.createService(require("@steedos/ee_service-plugin-license"));
        // 启动 sidecar服务: steedos services 跨语言访问
        // broker.createService(require("@steedos/service-sidecar"));
        // 字段级加密服务
        // broker.createService(require("@steedos/ee_plugin-field-encryption"));
        // 附件病毒扫描
        // broker.createService(require("@steedos/ee_virus-scan"));
        // 记录审计日志
        broker.createService(require("@steedos/ee_audit-records"));
        // 自定义品牌
        broker.createService(require("@steedos/ee_branding"));
	},

};
