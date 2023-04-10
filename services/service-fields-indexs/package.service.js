"use strict";
const project = require('./package.json');
const serviceName = project.name;
const objectql = require("@steedos/objectql");
const schedule = require('node-schedule');
const path = require('path');
const Fiber = require("fibers");
const metaDataCore = require('@steedos/metadata-core');
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * 软件包服务启动后也需要抛出事件。
 */
module.exports = {
	name: serviceName,
	namespace: "steedos",
	/**
	 * Settings
	 */
	settings: {
		packageInfo: {
			path: __dirname,
			name: serviceName
		}
	},

	/**
	 * Dependencies
	 */
	dependencies: [],
	/**
	 * Actions
	 */
	actions: {
		refreshIndexes: {
			async handler(ctx) {
				this.logger.debug(`refreshIndexes start`);
				const objects = await ctx.call(`objects.getAll`, {});
				for await (const object of objects) {
					const objectAPIName = object.metadata.name;
					if (objectAPIName && !objectAPIName.startsWith('__')) {
						await objectql.getObject(objectAPIName).refreshIndexes()
					}
				}

				const filePatten = [
					path.join(__dirname, 'meteor-collection-indexs', "*.object.js")
				];
				const matchedPaths = metaDataCore.syncMatchFiles(filePatten);
				_.each(matchedPaths, (matchedPath) => {
					try {
						Fiber(function () {
							try {
								require(matchedPath);
							} catch (error) {
								console.error(`refresh indexe error: ${matchedPath}`, error);
							}
						}).run();
					} catch (error) {
						console.error(`refresh indexe error: ${matchedPath}`, error);
					}
				});

				const indexFilePatten = [
					path.join(__dirname, 'collection-indexes', "*.index.js")
				];
				const matchedIndexPaths = metaDataCore.syncMatchFiles(indexFilePatten);
				_.each(matchedIndexPaths, (matchedPath) => {
					try {
						require(matchedPath).run();
					} catch (error) {
						console.error(`refresh indexe error: ${matchedPath}`, error);
					}
				});
				this.logger.debug(`refreshIndexes end`);
				return 'success'
			}
		}
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
	async created() {

	},

	/**
	 * Service started lifecycle event handler
	 */
	async started(ctx) {
		try {
			let indexScheduleCron = "0 0 2 * * *"; // 默认每天凌晨2点
			const steedosConfig = objectql.getSteedosConfig() || {};
			const cron = steedosConfig.cron;
			if (cron && cron.build_index) {
				indexScheduleCron = cron.build_index;
			}
			if (indexScheduleCron) {
				this.job = schedule.scheduleJob(indexScheduleCron, () => {
					this.broker.call(`${serviceName}.refreshIndexes`)
				});
			}
		} catch (error) {
			console.error(error)
		}
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {
		if (this.job && this.job.cancel) {
			this.job.cancel()
		}
	}
};
