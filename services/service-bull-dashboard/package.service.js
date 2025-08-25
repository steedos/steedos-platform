/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-24 10:08:34
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-04-26 10:10:09
 * @Description: 
 */
"use strict";
const project = require('./package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-package-loader');
const SteedosRouter = require('@steedos/router');
const router = SteedosRouter.staticRouter();
const { Queue: QueueMQ } = require('bullmq');
const { createBullBoard } = require('@bull-board/api')
const { BullMQAdapter } = require('@bull-board/api/bullMQAdapter');
const { ExpressAdapter } = require('@bull-board/express')
const { superAdminAuthentication } = require('@steedos/auth');
const { parseURL } = require('ioredis/built/utils');
const basePath = '/bull-jobs/dashboard';


/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * 软件包服务启动后也需要抛出事件。
 */
module.exports = {
	name: packageName,
	namespace: "steedos",
	mixins: [packageLoader],
	/**
	 * Settings
	 */
	settings: {
		packageInfo: {
			path: __dirname,
			name: packageName
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
	async started() {
		let client;
		if(process.env.STEEDOS_BULLMQ_REDIS){
			client = parseURL(process.env.STEEDOS_BULLMQ_REDIS);
		}else{
			client = parseURL(process.env.CACHER);
			client.db = 9;
		}

		const queueMQ = new QueueMQ('object_webhooks', {connection: client});
		const serverAdapter = new ExpressAdapter();
		serverAdapter.setBasePath(basePath)
		
		createBullBoard({
			queues: [
				new BullMQAdapter(queueMQ, {readOnlyMode: false}),
			],
			serverAdapter 
		})
		// ... express server configuration
		router.use(basePath, superAdminAuthentication,  serverAdapter.getRouter());
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
