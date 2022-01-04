"use strict";
const project = require('./package.json');
const serviceName = project.name;
const objectql = require("@steedos/objectql");
const schedule = require('node-schedule');

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
				const objects = await ctx.call(`objects.getAll`, {});
				for await(const object of objects) {
					const objectAPIName = object.metadata.name;
					if(objectAPIName && !objectAPIName.startsWith('__')){
						await objectql.getObject(objectAPIName).refreshIndexes()
					}
					
				}
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
			const steedosConfig = objectql.getSteedosConfig() || {};
			const cron = steedosConfig.cron;
			if(cron && cron.build_index){
				this.job = schedule.scheduleJob(cron.build_index, ()=>{
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
		if(this.job && this.job.cancel){
			this.job.cancel()
		}
	}
};
