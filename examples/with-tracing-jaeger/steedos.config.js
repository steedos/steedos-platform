module.exports = {
	// Namespace of nodes to segment your nodes on the same network.
	namespace: "steedos",
	// Default log level for built-in console logger. It can be overwritten in logger options above.
	// Available values: trace, debug, info, warn, error, fatal
	logLevel: "warn",

    tracing: {
        enabled: true,
        events: true,
        sampling: {
            rate: 1.0
        },
        exporter: {
            type: "Jaeger",
            options: {
                // HTTP Reporter endpoint. If set, HTTP Reporter will be used.
                endpoint: null,
                // UDP Sender host option.
                host: "127.0.0.1",
                // UDP Sender port option.
                port: 6832,
                // Jaeger Sampler configuration.
                sampler: {
                    // Sampler type. More info: https://www.jaegertracing.io/docs/1.14/sampling/#client-sampling-configuration
                    type: "Const",
                    // Sampler specific options.
                    options: {}
                },
                // Additional options for `Jaeger.Tracer`
                tracerOptions: {},
                // Default tags. They will be added into all span tags.
                defaultTags: null
            }
        }
    },
	
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
