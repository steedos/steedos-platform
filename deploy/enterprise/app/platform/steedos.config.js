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
		// 获取环境变量
		const edition = process.env.STEEDOS_EDITION || 'ce';

		switch (edition) {
			case "ce":
				console.log("🎉 欢迎使用 Steedos 社区版！");
				break;
			case "ee":
				console.log("🚀 欢迎使用 Steedos 企业版！");
				break;
			case "cloud":
				console.log("☁️ 欢迎使用 Steedos Cloud 版！");
				break;
			default:
				console.log("🤔 我们未能识别您启动的版本。");
		}

		if(edition == 'ee' || edition == 'cloud'){
			broker.createService(require("@steedos/service-license"));
		}

		broker.createService(require("@steedos/service-community"));
		
		if(edition == 'ee' || edition == 'cloud'){
			broker.createService(require("@steedos/service-enterprise"));
		}
	},

};