/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-25 13:31:57
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-11-01 10:49:56
 * @Description: 
 */
let express = require("express");

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
