const SteedosService = require("@steedos/service-steedos-server");
module.exports = {
	// Namespace of nodes to segment your nodes on the same network.
	namespace: "steedos",
	// Default log level for built-in console logger. It can be overwritten in logger options above.
	// Available values: trace, debug, info, warn, error, fatal
	logLevel: "warn",

	// Called after broker started.
	started(broker) {
		// 启动 元数据服务
        broker.createService(require("@steedos/service-metadata-server"));
        // 启动 加载软件包服务
        broker.createService(require("@steedos/service-package-registry"));
        // 许可证服务
        broker.createService(require("@steedos/ee_service-plugin-license"));

        // 启动 oidc sso 服务
        broker.createService(require("@steedos/ee_sso-oidc"));

        // 启动 报表服务
        broker.createService(require("@steedos/ee_stimulsoft-reports"));
        
        // 启动 meteor服务
        broker.createService({
            name: "steedos-server",
            namespace: "steedos",
            mixins: [SteedosService],
            settings: {
                plugins: [
                    '@steedos/ee_unpkg-local',
                    "@steedos/webapp-accounts",
                    "@steedos/plugin-dingtalk",
                    "@steedos/plugin-qywx",
                ]
            }
        });
	},

};
