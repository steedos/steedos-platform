"use strict";
const _ = require("lodash")

global.__startDate = new Date();

require('dotenv-flow').config(
	{
		path: process.cwd(),
		silent: true
	});

if(_.isEmpty(process.env.STEEDOS_TENANT_ENABLE_PASSWORD_LOGIN)) {
	process.env.STEEDOS_TENANT_ENABLE_PASSWORD_LOGIN = 'true';
}

if(_.isEmpty(process.env.STEEDOS_UNPKG_URL)) {
	process.env.STEEDOS_UNPKG_URL = 'https://unpkg.steedos.cn';
}
process.env.STEEDOS_UNPKG_URL =  process.env.STEEDOS_UNPKG_URL.replace(/\/+$/, "");


if(_.isEmpty(process.env.STEEDOS_AMIS_VERSION)) {
	process.env.STEEDOS_AMIS_VERSION = '3.2.0';
}

if(_.isEmpty(process.env.STEEDOS_AMIS_URL)) {
	process.env.STEEDOS_AMIS_URL = process.env.STEEDOS_UNPKG_URL + '/amis@' + process.env.STEEDOS_AMIS_VERSION;
}
process.env.STEEDOS_AMIS_URL =  process.env.STEEDOS_AMIS_URL.replace(/\/+$/, "");

if(_.isEmpty(process.env.STEEDOS_PUBLIC_PAGE_ASSETURLS)) {
	process.env.STEEDOS_PUBLIC_PAGE_ASSETURLS = process.env.STEEDOS_UNPKG_URL + "/@steedos-widgets/amis-object@1.3.4-beta.4/dist/assets.json";
}

if(_.isEmpty(process.env.SERIALIZER)){
	process.env.SERIALIZER = 'JSON'
}

process.env.ROOT_URL =  process.env.ROOT_URL.replace(/\/+$/, "");
/**
 * Steedos ServiceBroker configuration file
 *
 * More info about options:
 *     https://moleculer.services/docs/0.14/configuration.html
 *
 *
 * Overwriting options in production:
 * ================================
 * 	You can overwrite any option with environment variables.
 * 	For example to overwrite the "logLevel" value, use `LOGLEVEL=warn` env var.
 * 	To overwrite a nested parameter, e.g. retryPolicy.retries, use `RETRYPOLICY_RETRIES=10` env var.
 *
 * 	To overwrite broker’s deeply nested default options, which are not presented in "steedos.config.js",
 * 	use the `MOL_` prefix and double underscore `__` for nested properties in .env file.
 * 	For example, to set the cacher prefix to `MYCACHE`, you should declare an env var as `MOL_CACHER__OPTIONS__PREFIX=mycache`.
 *  It will set this:
 *  {
 *    cacher: {
 *      options: {
 *        prefix: "mycache"
 *      }
 *    }
 *  }
 */
module.exports = {
	// Namespace of nodes to segment your nodes on the same network.
	namespace: "steedos",
	// Unique node identifier. Must be unique in a namespace.
	nodeID: process.env.STEEDOS_NODEID,
	// Custom metadata store. Store here what you want. Accessing: `this.broker.metadata`
	metadata: {},

	// Enable/disable logging or use custom logger. More info: https://moleculer.services/docs/0.14/logging.html
	// Available logger types: "Console", "File", "Pino", "Winston", "Bunyan", "debug", "Log4js", "Datadog"
	logger: [{
		type: "Console",
		options: {
			// level: "warn",
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
	},
	{
		type: "File",
		options: {
			// Logging level
			// level: "warn",
			// Folder path to save files. You can use {nodeID} & {namespace} variables.
			folder: "./logs",
			// Filename template. You can use {date}, {nodeID} & {namespace} variables.
			filename: "{nodeID}-{date}.log",
			// Line formatter. It can be "json", "short", "simple", "full", a `Function` or a template string like "{timestamp} {level} {nodeID}/{mod}: {msg}"
			formatter: "json",
			// Custom object printer. If not defined, it uses the `util.inspect` method.
			objectPrinter: null,
			// End of line. Default values comes from the OS settings.
			eol: "\n",
			// File appending interval in milliseconds.
			interval: 1 * 1000
		},
	},
	],

	// Default log level for built-in console logger. It can be overwritten in logger options above.
	// Available values: trace, debug, info, warn, error, fatal
	logLevel: "warn",

	// Define transporter.
	// More info: https://moleculer.services/docs/0.14/networking.html
	// Note: During the development, you don't need to define it because all services will be loaded locally.
	// In production you can set it via `TRANSPORTER=nats://localhost:4222` environment variable.
	transporter: function () {
		try {
			return JSON.parse(process.env.STEEDOS_TRANSPORTER);
		} catch (error) {
			return process.env.STEEDOS_TRANSPORTER;
		}
	}(), //process.env.STEEDOS_TRANSPORTER,

	// Define a cacher.
	// More info: https://moleculer.services/docs/0.14/caching.html
	cacher: function () {
		try {
			return JSON.parse(process.env.STEEDOS_CACHER);
		} catch (error) {
			return process.env.STEEDOS_CACHER;
		}
	}(),

	// Define a serializer.
	// Available values: "JSON", "Avro", "ProtoBuf", "MsgPack", "Notepack", "Thrift".
	// More info: https://moleculer.services/docs/0.14/networking.html#Serialization
	serializer: process.env.SERIALIZER || "JSON",

	// Number of milliseconds to wait before reject a request with a RequestTimeout error. Disabled: 0
	requestTimeout: 0,

	// Retry policy settings. More info: https://moleculer.services/docs/0.14/fault-tolerance.html#Retry
	retryPolicy: {
		// Enable feature
		enabled: false,
		// Count of retries
		retries: 5,
		// First delay in milliseconds.
		delay: 100,
		// Maximum delay in milliseconds.
		maxDelay: 1000,
		// Backoff factor for delay. 2 means exponential backoff.
		factor: 2,
		// A function to check failed requests.
		check: err => err && !!err.retryable
	},

	// Limit of calling level. If it reaches the limit, broker will throw an MaxCallLevelError error. (Infinite loop protection)
	maxCallLevel: 100,

	// Number of seconds to send heartbeat packet to other nodes.
	heartbeatInterval: 10,
	// Number of seconds to wait before setting node to unavailable status.
	heartbeatTimeout: 30,

	// Cloning the params of context if enabled. High performance impact, use it with caution!
	contextParamsCloning: false,

	// Tracking requests and waiting for running requests before shuting down. More info: https://moleculer.services/docs/0.14/context.html#Context-tracking
	tracking: {
		// Enable feature
		enabled: false,
		// Number of milliseconds to wait before shuting down the process.
		shutdownTimeout: 5000,
	},

	// Disable built-in request & emit balancer. (Transporter must support it, as well.). More info: https://moleculer.services/docs/0.14/networking.html#Disabled-balancer
	disableBalancer: false,

	// Settings of Service Registry. More info: https://moleculer.services/docs/0.14/registry.html
	registry: {
		// Define balancing strategy. More info: https://moleculer.services/docs/0.14/balancing.html
		// Available values: "RoundRobin", "Random", "CpuUsage", "Latency", "Shard"
		strategy: "RoundRobin",
		// Enable local action call preferring. Always call the local action instance if available.
		preferLocal: true
	},

	// Settings of Circuit Breaker. More info: https://moleculer.services/docs/0.14/fault-tolerance.html#Circuit-Breaker
	circuitBreaker: {
		// Enable feature
		enabled: false,
		// Threshold value. 0.5 means that 50% should be failed for tripping.
		threshold: 0.5,
		// Minimum request count. Below it, CB does not trip.
		minRequestCount: 20,
		// Number of seconds for time window.
		windowTime: 60,
		// Number of milliseconds to switch from open to half-open state
		halfOpenTime: 10 * 1000,
		// A function to check failed requests.
		check: err => err && err.code >= 500
	},

	// Settings of bulkhead feature. More info: https://moleculer.services/docs/0.14/fault-tolerance.html#Bulkhead
	bulkhead: {
		// Enable feature.
		enabled: false,
		// Maximum concurrent executions.
		concurrency: 10,
		// Maximum size of queue
		maxQueueSize: 100,
	},

	// Enable action & event parameter validation. More info: https://moleculer.services/docs/0.14/validating.html
	validator: true,

	errorHandler: null,

	// Enable/disable built-in metrics function. More info: https://moleculer.services/docs/0.14/metrics.html
	metrics: {
		enabled: false,
		// Available built-in reporters: "Console", "CSV", "Event", "Prometheus", "Datadog", "StatsD"
		reporter: [
			{
				type: "Prometheus",
				options: {
					// HTTP port
					port: 3030,
					// HTTP URL path
					path: "/metrics",
					// Default labels which are appended to all metrics labels
					defaultLabels: registry => ({
						namespace: registry.broker.namespace,
						nodeID: registry.broker.nodeID
					})
				}
			}
		]
	},


	tracing: {
		enabled: true,
		tags: {
			action: {
				// Add `user.userId` value from `ctx.meta`
				meta: ["user.userId", "user.spaceId"],
			},
		},
		exporter: {
			type: "Event",
			options: {
				// Name of event
				eventName: "$tracing.spans",
				// Send event when a span started
				sendStartSpan: false,
				// Send event when a span finished
				sendFinishSpan: true,
				// Broadcast or emit event
				broadcast: false,
				// Event groups
				groups: null,
				// Sending time interval in seconds
				interval: 5,
				// Custom span object converter before sending
				spanConverter: null,
				// Default tags. They will be added into all span tags.
				defaultTags: null
			}
		}
	},

	// Register custom middlewares
	middlewares: [],

	// Register custom REPL commands.
	replCommands: null,

	skipProcessEventRegistration: true,

	// Called after broker created.
	created(broker) {
		// Clear all cache entries
		broker.logger.warn('Clear all cache entries on startup.')
		broker.cacher.clean();

		const objectql = require(require.resolve('@steedos/objectql', {paths: [process.cwd()]}));
		objectql.broker.init(broker);

		//TODO 此处不考虑多个node服务模式.
		process.on('SIGTERM', close.bind(broker, 'SIGTERM'));
		process.on('SIGINT', close.bind(broker, 'SIGINT'));
		async function close(signal) {
			try {
				await this.cacher.clean(); //TODO 此clean 有问题，如果在启动过程中就停止服务，则会清理不干净。尝试试用reids client 原生clean（flushdb）。
				await this.cacher.close();
			} catch (error) {
				// console.log(`error`, error)
			}
			console.log(`[${signal}]服务已停止: namespace: ${this.namespace}, nodeID: ${this.nodeID}`);
			process.exit(0);
		}
	},

	// Called after broker started.
	started(broker) {

	},

	// Called after broker stopped.
	stopped(broker) {

	}
};
