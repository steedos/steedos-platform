/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-26 11:15:13
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-29 12:01:01
 * @Description: 
 */
module.exports = {
	// Namespace of nodes to segment your nodes on the same network.
	namespace: "steedos",
	// Default log level for built-in console logger. It can be overwritten in logger options above.
	// Available values: trace, debug, info, warn, error, fatal
	logLevel: "warn",

	// Called after broker started.
	started(broker) {
		broker.createService(require("@steedos/service-enterprise"));
		// 启动 本地 CDN
        broker.createService(require("@steedos/ee_unpkg-local"));
	},

};
