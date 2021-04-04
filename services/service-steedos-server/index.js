"use strict";

const Future = require('fibers/future');
const path = require('path');
const RED = require("node-red");
const MetadataService = require("@steedos/service-metadata-server");
const NodeRedService = require('@steedos/service-node-red');
const APIService = require('@steedos/service-api');
const packageLoader = require('@steedos/service-meteor-package-loader');
const standardObjectsPath = path.dirname(require.resolve("@steedos/standard-objects/package.json"));
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: 'steedos-server',

	/**
	 * Settings
	 */
	settings: {
		port: process.env.PORT || 3000,
		rootUrl: process.env.ROOT_URL || 'http://localhost:3000',
		mongoUrl: process.env.MONGO_URL,
		mongoOplogUrl: process.env.MONGO_OPLOG_URL,
		storageDir: process.env.STEEDOS_STORAGE_DIR || require('path').resolve(require('os').homedir(), '.steedos', 'storage'),
		nodeRedServer: {
			enabled: false,
			port: null,
		},
		packageInfo: {
			path: standardObjectsPath,
		},
		apiServer: {
			enabled: true
		},
		built_in_plugins: [
			"@steedos/steedos-plugin-workflow",
			"@steedos/accounts",
			"@steedos/steedos-plugin-schema-builder",
			"@steedos/plugin-enterprise",
			"@steedos/word-template",
			"@steedos/plugin-qywx",
			"@steedos/metadata-api",
			"@steedos/plugin-dingtalk"],
		plugins: []
	},

	/**
	 * Dependencies
	 */
	dependencies: [
		'metadata-server'
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
		wrapAsync(fn, context) {
			let proxyFn = async function (_cb) {
				let value = null;
				let error = null;
				try {
					value = await fn.call(context)
				} catch (err) {
					error = err
				}
				_cb(error, value)
			}
			let fut = new Future();
			let callback = fut.resolver();
			let result = proxyFn.apply(this, [callback]);
			return fut ? fut.wait() : result;
		},

		async startSteedos() {

			this.meteor = require('@steedos/meteor-bundle-runner');
			this.steedos = require('@steedos/core');
			// const logger = this.logger;
			await Future.task(() => {
				try {
					this.meteor.loadServerBundles();
					require('@steedos/objectql').getSteedosSchema(this.broker);
					this.wrapAsync(this.startStandardObjectsPackageLoader, {});
					this.wrapAsync(this.steedos.init, this.settings);
					this.WebApp = WebApp;
					this.startNodeRedService();
					this.meteor.callStartupHooks();
					this.meteor.runMain();

				} catch (error) {
					this.logger.error(error)
				}
			}).promise();

		},

		async startNodeRedService() {
			if (this.settings.nodeRedServer && this.settings.nodeRedServer.enabled) {
				this.nodeRedService = await this.broker.createService({
					name: "node-red-flows",
					mixins: [NodeRedService],
					settings: this.settings.nodeRedServer
				});

				await this.broker._restartService(this.nodeRedService)
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
				this.WebApp.connectHandlers.use("/", this.apiService.express());
			}

		},

		async startStandardObjectsPackageLoader() {
			let settings = this.settings.packageInfo;
			if (settings.path) {
				this.standardObjectsPackageLoaderService = this.broker.createService({
					name: 'standard-objects',
					mixins: [packageLoader],
					settings: { packageInfo: settings }
				});
				await this.broker.waitForServices(this.standardObjectsPackageLoaderService.name);
			}

		}
	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {
		this.RED = RED;
		this.MetadataService = this.broker.createService(MetadataService);
	},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {
		this.broker.waitForServices(this.name).then(async () => {
			process.env.PORT = this.settings.port;
			process.env.ROOT_URL = this.settings.rootUrl;

			await this.startSteedos();

			this.startAPIService();
		});

	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
