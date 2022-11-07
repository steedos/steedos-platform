/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-03 18:04:19
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-05 16:22:56
 * @Description: 
 */
"use strict";
const _ = require("lodash")

require('dotenv-flow').config(
	{
		path: process.cwd(),
		silent: true
	});

module.exports = {
	// Namespace of nodes to segment your nodes on the same network.
	namespace: "steedos",
	// Unique node identifier. Must be unique in a namespace.
	nodeID: 'core',
	

	// Define transporter.
	// More info: https://moleculer.services/docs/0.14/networking.html
	// Note: During the development, you don't need to define it because all services will be loaded locally.
	// In production you can set it via `TRANSPORTER=nats://localhost:4222` environment variable.
	transporter: process.env.STEEDOS_TRANSPORTER,

	cacher: function () {
		try {
			return JSON.parse(process.env.STEEDOS_CACHER);
		} catch (error) {
			return process.env.STEEDOS_CACHER;
		}
	}(),

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
};
