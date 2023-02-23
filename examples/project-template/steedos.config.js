/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-25 13:31:57
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2023-02-23 11:49:44
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

	settings: {
		public: {
			phone: {
				showRemindButton: true
			},
			workflow: {
				instance_allow_distribute: true
			}
		}
	}

};
