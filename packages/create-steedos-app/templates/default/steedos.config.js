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
	},

};
