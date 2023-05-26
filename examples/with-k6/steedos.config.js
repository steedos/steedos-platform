/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-12 10:43:06
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-23 15:10:26
 * @Description: 
 */
module.exports = {
	// Namespace of nodes to segment your nodes on the same network.
	namespace: "steedos",
	// Default log level for built-in console logger. It can be overwritten in logger options above.
	// Available values: trace, debug, info, warn, error, fatal
	logLevel: "warn",

	tracing: {
		enabled: false,
		exporter: {
				type: "Datadog",
				options: {
						// Datadog Agent URL
						agentUrl: process.env.DD_AGENT_URL || "http://localhost:8126",
						// Environment variable
						env: process.env.DD_ENVIRONMENT || null,
						// Sampling priority. More info: https://docs.datadoghq.com/tracing/guide/trace_sampling_and_storage/?tab=java#sampling-rules
						samplingPriority: "AUTO_KEEP",
						// Default tags. They will be added into all span tags.
						defaultTags: null,
						// Custom Datadog Tracer options. More info: https://datadog.github.io/dd-trace-js/#tracer-settings
						tracerOptions: null,
				}
		}
	},
	
	metrics: {
		enabled: false,
		reporter: [
				{
						type: "Datadog",
						options: {
								// Hostname
								host: "my-host",
								// Base URL
								baseUrl: "https://api.datadoghq.eu/api/", // Default is https://api.datadoghq.com/api/
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

	// Called after broker started.
	started(broker) {
		broker.createService(require("@steedos/service-community"));
	},

};
