/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-12 10:43:06
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-03-28 15:43:01
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
		broker.createService(require("@steedos/service-community"));
	},

};
