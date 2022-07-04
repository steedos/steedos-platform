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
		// 启动 meteor服务
		broker.createService(require("@steedos/service-steedos-server"));
        // 许可证服务
        broker.createService(require("@steedos/ee_service-plugin-license"));
        // 启动 sidecar服务: steedos services 跨语言访问
        // broker.createService(require("@steedos/service-sidecar"));
        // 字段级加密服务
        // broker.createService(require("@steedos/ee_plugin-field-encryption"));
	},

};
