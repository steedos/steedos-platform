/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-25 13:31:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-13 16:57:57
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

		const svc = broker.createService(require("@steedos/server-amis"));

		const app = express();

		app.use("/", svc.express());
		
		app.use("/", express.static(svc.static(), { maxAge: svc.cacheTime() }));

		app.listen(3333, err => {
			if (err)
				return console.error(err);
		
			console.log("Open http://localhost:3333");
		});

	},

};
