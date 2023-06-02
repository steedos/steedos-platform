module.exports = {
	// Namespace of nodes to segment your nodes on the same network.
	namespace: "steedos",
	// Default log level for built-in console logger. It can be overwritten in logger options above.
	// Available values: trace, debug, info, warn, error, fatal
	logLevel: {
		"TRACING": "trace",
		"TRANS*": "debug",
		"GREETER": "debug",
		"**": "warn",
  },

	tracing: {
		enabled: true,
		exporter: {
				type: "Datadog",
				options: {
						// Datadog Agent URL
						agentUrl: process.env.DD_TRACE_AGENT_URL || "http://localhost:8126",
						// Environment variable
						env: process.env.DD_ENVIRONMENT || null,
						// Sampling priority. More info: https://docs.datadoghq.com/tracing/guide/trace_sampling_and_storage/?tab=java#sampling-rules
						samplingPriority: "AUTO_KEEP",
						// Default tags. They will be added into all span tags.
						defaultTags: null,
						// Custom Datadog Tracer options. More info: https://datadog.github.io/dd-trace-js/#tracer-settings
						tracerOptions: {
							logInjection: true,
							runtimeMetrics: true,
							profiling: true,
						},
				}
		}
	},
	
	metrics: {
		enabled: true,
		reporter: [
				{
						type: "Datadog",
						options: {
								// Hostname
								host: "my-host",
								// Base URL
								baseUrl: "https://api.datadoghq.com/api/", // Default is https://api.datadoghq.com/api/
								// API version
								apiVersion: "v1",
								// Server URL path
								path: "/series",
								// Datadog API Key
								apiKey: process.env.DATADOG_API_KEY,
								// Default labels which are appended to all metrics labels
								defaultLabels: (registry) => ({
										namespace: registry.broker.namespace,
										nodeID: registry.broker.nodeID
								}),
								// Sending interval in seconds
								interval: 10
						}
				}
		]
	},

	logger: [{
		type: "Console",
		options: {
			// Using colors on the output
			colors: true,
			// Print module names with different colors (like docker-compose for containers)
			moduleColors: false,
			// Line formatter. It can be "json", "short", "simple", "full", a `Function` or a template string like "{timestamp} {level} {nodeID}/{mod}: {msg}"
			formatter: "full",
			// Custom object printer. If not defined, it uses the `util.inspect` method.
			objectPrinter: null,
			// Auto-padding the module name in order to messages begin at the same column.
			autoPadding: false
		}
	},{
		type: "Datadog",
		options: {
				// Logging level
				level: "warn",
				// Datadog server endpoint. https://docs.datadoghq.com/api/?lang=bash#send-logs-over-http
				url: "https://http-intake.logs.datadoghq.com/api/v2/logs",
				// Datadog API key
				apiKey: process.env.DATADOG_API_KEY,
				// Datadog source variable
				ddSource: "moleculer",
				// Datadog env variable
				env: 'dev',
				// Datadog hostname variable
				hostname: '127.0.0.1', //os.hostname(),
				// Custom object printer function for `Object` & `Ąrray`
				objectPrinter: null,
				// Data uploading interval
				interval: 10 * 1000
		}
	}],

	// Called after broker started.
	started(broker) {
		broker.createService(require("@steedos/service-community"));
	},

};
