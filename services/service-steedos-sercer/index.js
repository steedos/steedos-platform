"use strict";

const Future = require('fibers/future');
let MongoDBService = require('@steedos/service-mongodb-server');
let NodeRedService = require('@steedos/service-node-red');
let APIService = require('@steedos/service-api');

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "steedos-server",

	/**
	 * Settings
	 */
	settings: {
		port: process.env.PORT || 3000,
		rootUrl: process.env.ROOT_URL || 'http://localhost:3000',
		mongoUrl: process.env.MONGO_URL,
		mongoOplogUrl: process.env.MONGO_OPLOG_URL,
		storageDir: process.env.STEEDOS_STORAGE_DIR || require('path').resolve(require('os').homedir(), '.steedos', 'storage'),
		mongodbServer: {
			enabled: !process.env.MONGO_URL,
		},
		nodeRedServer: {
			httpAdminRoot:"/flows/",
			httpNodeRoot: "/flows/",
			enabled: false,
		}
	},

	/**
	 * Dependencies
	 */
	dependencies: [
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
		async startSteedos() {

			this.meteor = require('@steedos/meteor-bundle-runner');
			this.steedos = require('@steedos/core');
			
			// const logger = this.logger;
			await Future.task( ()=> {
				try {
					this.meteor.loadServerBundles();
					this.steedos.init();
					this.meteor.callStartupHooks();
					this.meteor.runMain();

				} catch (error) {
					this.logger.error(error)
				}
			}).promise();

			this.httpServer = WebApp.httpServer;
			this.app = WebApp.rawConnectHandlers;
		},

		async startNodeRedService() {

			if (this.settings.nodeRedServer && this.settings.nodeRedServer.enabled) {
				this.settings.nodeRedServer.httpServer = this.httpServer;
				this.settings.nodeRedServer.app = this.app;
				this.nodeRedService = this.broker.createService({
					name: "node-red",
					mixins: [NodeRedService],
					settings: this.settings.nodeRedServer
				});
				this.broker._restartService(this.nodeRedService)
			}
		},

		async startAPIService() {
			if (this.settings.apiServer && this.settings.apiServer.enabled) {
				this.settings.apiServer.server = false;
				this.apiService = this.broker.createService({
					name: "api",
					mixins: [APIService],
					settings: this.settings.apiServer
				});
				this.broker._restartService(this.apiService)
				this.app.use("/", this.apiService.express());
			}

		}
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

		if (this.settings.mongodbServer && this.settings.mongodbServer.enabled) {
			this.mongodbService = this.broker.createService({
				name: "mongodb-server",
				mixins: [MongoDBService],
				settings: this.settings["mongodbServer"]
			});
			this.broker._restartService(this.mongodbService)
			await this.broker.waitForServices(["mongodb-server"]);
			this.settings.mongoUrl = process.env.MONGO_URL;
			this.settings.mongoOplogUrl = process.env.MONGO_OPLOG_URL;
		} else {
			process.env.MONGO_URL = this.settings.mongoUrl;
		}

		await this.startSteedos();

		this.startNodeRedService();
		this.startAPIService();
	  
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
