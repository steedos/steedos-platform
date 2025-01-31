'use strict';
import _ from 'lodash';

import { pinoConfig } from '@builder6/core';
/**
 * Steedos ServiceBroker configuration file
 *
 * More info about options:
 * https://moleculer.services/docs/0.14/configuration.html
 */

export default {
  namespace: 'steedos',
  nodeID: null,
  metadata: {},

  logger: {
    type: 'pino',
    options: {
      level: process.env.B6_LOG_LEVEL || 'info',
      pino: {
        options: pinoConfig.pinoHttp,
      },
    },
  },

  // logger: {
  //   type: 'Console',
  //   options: {
  //     // Logging level
  //     level: 'info',
  //     // Using colors on the output
  //     colors: true,
  //     // Print module names with different colors (like docker-compose for containers)
  //     moduleColors: false,
  //     // Line formatter. It can be "json", "short", "simple", "full", a `Function` or a template string like "{timestamp} {level} {nodeID}/{mod}: {msg}"
  //     formatter: '[MO] {timestamp} {level} [{mod}] {msg}',
  //     // Custom object printer. If not defined, it uses the `util.inspect` method.
  //     objectPrinter: null,
  //     // Auto-padding the module name in order to messages begin at the same column.
  //     autoPadding: false,
  //   },
  // },


  transporter: process.env.B6_TRANSPORTER,

  cacher: process.env.B6_CACHER,

  serializer: 'JSON',

  requestTimeout: 0,

  retryPolicy: {
    enabled: false,
  },

  maxCallLevel: 100,

  heartbeatInterval: 10,
  heartbeatTimeout: 30,

  contextParamsCloning: false,

  tracking: {
    enabled: false,
  },

  disableBalancer: false,

  registry: {
    strategy: 'RoundRobin',
    preferLocal: true,
  },

  circuitBreaker: {
    enabled: false,
    threshold: 0.5,
    minRequestCount: 20,
    windowTime: 60,
    halfOpenTime: 10000,
    check: (err: any) => err && err.code >= 500,
  },

  bulkhead: {
    enabled: false,
    concurrency: 10,
    maxQueueSize: 100,
  },

  validator: true,

  errorHandler: null,

  metrics: {
    enabled: false,
  },

  tracing: {
    enabled: false,
  },

  middlewares: [],

  replCommands: null,

  skipProcessEventRegistration: true,

  created(broker: any) {
    global.SteedosBroker = broker;
    	// Clear all cache entries
		broker.logger.warn('Clear all cache entries on startup.')
		// broker.cacher.clean();
		console.log(`Clear all cache entries on startup===1>`)
		const objectql = require('@steedos/objectql');
		console.log(`Clear all cache entries on startup===2>`)
		objectql.broker.init(this.broker);
		console.log(`Clear all cache entries on startup===init>`)
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

  started(broker: any) {
    // Custom logic after broker starts
  },

  stopped(broker: any) {
    // Custom logic after broker stops
  },
};
