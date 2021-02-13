"use strict";

let MongoDBService = require('@steedos/service-mongodb');
let APIService = require('@steedos/service-api');

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "steedos",

	/**
	 * Settings
	 */
	settings: {
		port: process.env.PORT || 3000,
		rootUrl: process.env.ROOT_URL || 'http://localhost:3000',
		mongoUrl: process.env.MONGO_URL,
		mongoOplogUrl: process.env.MONGO_OPLOG_URL,
		storageDir: process.env.STEEDOS_STORAGE_DIR || require('path').resolve(require('os').homedir(), '.steedos', 'storage'),
	},

	/**
	 * Dependencies
	 */
	dependencies: [
		'mongodb',
	],

	/**
	 * Actions
	 */
	actions: {
		
	},

	/**
	 * Events
	 */
	events: {

	},

	/**
	 * Methods
	 */
	methods: {

	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {

	  
	},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {

		process.env.PORT = this.settings.port;
		process.env.ROOT_URL = this.settings.rootUrl;

		if (!this.settings.mongoUrl) {

			await this.broker.createService(MongoDBService);
			await this.broker.waitForServices(["mongodb"]);
			this.settings.mongoUrl = process.env.MONGO_URL;
			this.settings.mongoOplogUrl = process.env.MONGO_OPLOG_URL;
		} else {
			process.env.MONGO_URL = this.settings.mongoUrl;
		}


		const server = require('@steedos/meteor-bundle-runner');
		const steedos = require('@steedos/core');
		
		const logger = this.logger;
		server.Fiber(function () {
			try {
				server.loadServerBundles();
				steedos.init();
				server.callStartupHooks();
				server.runMain();
			} catch (error) {
				logger.error(error)
			}
		}).run();
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
