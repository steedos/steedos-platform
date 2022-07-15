"use strict";

const Future = require('fibers/future');
const path = require('path');
const MetadataService = require("@steedos/service-metadata-server");
const APIService = require('@steedos/service-api');
const packageLoader = require('@steedos/service-meteor-package-loader');
const objectql = require('@steedos/objectql');
const standardObjectsPath = path.dirname(require.resolve("@steedos/standard-objects/package.json"));
const _ = require('lodash');
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
			"@steedos/webapp-public",
			"@steedos/service-ui",
			"@steedos/service-cachers-manager",
			"@steedos/workflow",
			"@steedos/accounts",
			"@steedos/plugin-company",
			// "@steedos/word-template",
			"@steedos/metadata-api",
			"@steedos/data-import",
			"@steedos/service-fields-indexs",
			"@steedos/service-accounts",
			"@steedos/service-charts",
			"@steedos/service-pages",
			"@steedos/service-cloud-init",
			"@steedos/service-workflow",
			"@steedos/service-plugin-amis",
			// "@steedos/standard-process"
			"@steedos/service-files",
		],
		plugins: [
			"@steedos/unpkg",
			"@steedos/webapp-accounts",
			"@steedos/plugin-dingtalk",
			"@steedos/plugin-qywx",
		]
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
		importFlow: {
			async handler(ctx) {
				await Future.task(() => {
					try {
						const { flow } = ctx.params
						const { name } = ctx.meta;
						try {
							if(!db){
								return
							}
							if(!steedosImport){
								return
							}
						} catch (error) {
							return ;
						}
						
						if(db && db.flows && steedosImport){
							const steedosConfig = objectql.getSteedosConfig();
							let space;
							if(steedosConfig && steedosConfig.tenant && steedosConfig.tenant._id){
								space = db.spaces.findOne(steedosConfig.tenant._id)
							}
							if(!space){
								space = db.spaces.findOne()
							}
							if(!space){
								this.logger.debug(`import flow ${flow.name} fail. not find space in db`);
								return ;
							}
							if(!flow.api_name){
								this.logger.warn(`not find api_name in file`);
								return ;
							}
							const dbFlow = db.flows.findOne({api_name: flow.api_name});
							if(!dbFlow){
								if(flow && flow.current){
									if(!_.has(flow.current,'fields')){
										flow.current.fields = [];
									}
								}
								this.logger.info(`insert flow ${flow.api_name} from ${name}`);

								let company_id = null;
								if(flow.company_id){
									let count = Creator.getCollection("company").find({ _id: flow.company_id, space: space._id }).count();
									if(count > 0){
										company_id = flow.company_id
									}
								}

								return steedosImport.workflow(space.owner, space._id, flow, flow.state == 'enabled' ? true : false, company_id);
							}
							this.logger.debug(`not import flow. find flow `, dbFlow._id)
						}
	
					} catch (error) {
						this.logger.error(error)
					}
				}).promise();
				
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
					const steedosSchema = require('@steedos/objectql').getSteedosSchema(this.broker);
					this.wrapAsync(this.startStandardObjectsPackageLoader, {});
					// console.time(`startSteedos-dataSourceInIt`)
					// const datasources = steedosSchema.getDataSources();
					// for (let dataSource in datasources) {
					// 	console.log(`dataSource`, dataSource);
					// 	Future.fromPromise(steedosSchema.getDataSource(dataSource).init()).wait();
					// }
					// console.timeEnd(`startSteedos-dataSourceInIt`)
					Future.fromPromise(this.steedos.init(this.settings)).wait();
					this.WebApp = WebApp;
					// this.startNodeRedService();
					this.meteor.callStartupHooks();
					this.meteor.runMain();
				} catch (error) {
					this.logger.error(error)
				}
			}).promise();

		},

		// async startNodeRedService() {
		// 	if (this.settings.nodeRedServer && this.settings.nodeRedServer.enabled) {
		// 		this.nodeRedService = await this.broker.createService({
		// 			name: "node-red-flows",
		// 			mixins: [NodeRedService],
		// 			settings: this.settings.nodeRedServer
		// 		});
		// 		if (!this.broker.started) {
		// 			await this.broker._restartService(this.nodeRedService)
		// 		}
		// 	}
		// },

		async startAPIService() {
			if (this.settings.apiServer && this.settings.apiServer.enabled) {
				this.settings.apiServer.server = false;
				this.apiService = this.broker.createService({
					name: "api",
					mixins: [APIService],
					settings: this.settings.apiServer
				});
				if (!this.broker.started) {
					this.broker._restartService(this.apiService)
				}
				this.WebApp.connectHandlers.use("/", this.apiService.express());
			}

		},

		async startStandardObjectsPackageLoader() {
			let settings = this.settings.packageInfo;
			if (settings.path) {
				return await new Promise((resolve, reject) => {
					this.standardObjectsPackageLoaderService = this.broker.createService({
						name: 'standard-objects',
						mixins: [packageLoader],
						settings: { packageInfo: settings }
					}, {
						started: () => {
							resolve(true)
						}
					});
					if (!this.broker.started) {
						this.broker._restartService(this.standardObjectsPackageLoaderService)
					}
				})
			}

		}
	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {
		// this.RED = RED;
		// this.MetadataService = this.broker.createService(MetadataService);
	},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {
		let time = new Date().getTime();
		// this.broker.waitForServices(this.name).then(async () => {
			process.env.PORT = this.settings.port;
			process.env.ROOT_URL = this.settings.rootUrl;

			await this.startSteedos();

			this.startAPIService();
			console.log('耗时：', new Date().getTime() - time);
			//  **已经移除了waitForServices, 此事件可以作废了, 可使用 dependencies: ['steedos-server']** ; 此处有异步函数，当前服务started后，实际上还未初始化完成。所以此服务初始化完成后，发出一个事件;
			
			// 此处需要延时处理,否则监听此事件的函数中如果调用了此服务中的aciton, 可能会出现action未注册的情况.
			setTimeout(()=>{
				this.broker.emit("steedos-server.started");
			}, 1000)
		
			// });

	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	},
    merged(schema) {
        schema.name = 'steedos-server';  //steedo-server 服务禁止修改name
    }
};
