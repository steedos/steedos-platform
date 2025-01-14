// env PORT is reserved for nginx, reset port for meteor
// 企业版 PORT 环境变量用于 nginx，此处重置 metor 端口为 3000
process.env.PORT = 3000;

module.exports = {
	// Namespace of nodes to segment your nodes on the same network.
	namespace: "steedos",
	// Default log level for built-in console logger. It can be overwritten in logger options above.
	// Available values: trace, debug, info, warn, error, fatal
	logLevel: process.env.STEEDOS_LOG_LEVEL || "warn",

	// Called after broker started.
	started(broker) {
		if(process.env.STEEDOS_EDITION == 'ee' || process.env.STEEDOS_EDITION == 'cloud'){
			broker.createService(require("@steedos/service-license"));
		}

		broker.createService(require("@steedos/service-community"));
		
		if(process.env.STEEDOS_EDITION == 'ee' || process.env.STEEDOS_EDITION == 'cloud'){
			broker.createService(require("@steedos/service-enterprise"));
		}
	},

};