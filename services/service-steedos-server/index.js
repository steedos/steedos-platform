"use strict";

const Future = require('fibers/future');
const path = require('path');
const packageLoader = require('@steedos/service-meteor-package-loader');
const objectql = require('@steedos/objectql');
const standardObjectsPath = path.dirname(require.resolve("@steedos/standard-objects/package.json"));
const _ = require('lodash');
const express = require('express');
const validator = require('validator');
const core = require('@steedos/core');

const helmet = require('helmet');

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
		built_in_plugins: getBuiltinPlugins(),
		plugins: [
		]
	},

	/**
	 * Dependencies
	 */
	dependencies: [
		'metadata-server', 'api'
	],

	/**
	 * Actions
	 */
	actions: {
		// 动态修改浏览器端 Steedos.settings 变量，包括其中的 PUBLIC_SETTINGS
		setSettings(ctx) {
			this.setSettings(ctx.params)
		},
		async importFlow(ctx) {
			const { flow, name, spaceId } = ctx.params;
			return await this.importFlow(flow, name, spaceId)
		},
	},

	/**
	 * Events
	 */
	events: {
		async 'service-cloud-init.succeeded'(ctx) {
			await this.setMasterSpaceId()
		},
		'steedos-server.started': async function (ctx) {
			// console.log(chalk.blue('steedos-server.started'));
			const records = await objectql.getObject('spaces').directFind({ top: 1, fields: ['_id'], sort: { created: -1 } });
			const steedosConfig = objectql.getSteedosConfig();
			if (records.length > 0) {
				process.env.STEEDOS_TENANT_ID = records[0]._id;
				steedosConfig.setTenant({ _id: records[0]._id });
			} else {
				steedosConfig.setTenant({ enable_create_tenant: true, enable_register: true });
			}
			// 工作区未初始化时，才初始化软件包
			// const allowInit = await this.allowInit(records);
			// if (!allowInit) {
			// 	return
			// }
			try {
				await ctx.broker.call('@steedos/service-project.initialPackages', {}, {});
			} catch (error) {
				console.error(`initialPackages error`, error)
			}
		},
		'trigger.loaded': async function (ctx) {
			const { objectName } = ctx.params;
			// 判断能否获取到对象
			if (Creator.getObject(objectName)){
				const localObjectConfig = objectql.getObjectConfig(objectName);
				if (localObjectConfig) {
					let creatorTriggers = {};
					if(Creator.Objects[localObjectConfig.name]?.triggers){
						creatorTriggers = Creator.Objects[localObjectConfig.name].triggers
					}
					objectql.extend(localObjectConfig, { triggers:  creatorTriggers || {}}, { triggers: localObjectConfig._baseTriggers })
					Creator.loadObjects(localObjectConfig, localObjectConfig.name);
				}

				
			}
		},
		'clientJS.changed': async function (ctx){
			if (this.clientJSChangeTimeoutId) {
				clearTimeout(this.clientJSChangeTimeoutId)
			}
			this.clientJSChangeTimeoutId = setTimeout(() => {
				const steedos = require('@steedos/core')
				steedos.loadClientScripts();
				this.clientJSChangeTimeoutId = null;
			}, 1000)
		},

		"*.*.metadata.objects.inserted": async function (ctx) {
			let objectConfig = ctx.params.data;
			// console.log(`${objectConfig.datasource}.${getObjectServiceName(objectConfig.name)}.metadata.objects.inserted`);
			// 对象发生变化时，重新创建Steedos Object 对象
			const datasource = objectql.getDataSource(objectConfig.datasource);
			if (datasource) {
				const localObjectConfig = objectql.getObjectConfig(objectConfig.name);
				if (localObjectConfig) {
					objectConfig.listeners = localObjectConfig.listeners;
					objectConfig.methods = localObjectConfig.methods;
				}

				if (datasource.name === 'meteor' && Creator.Objects[objectConfig.name]) {
					objectql.jsonToObject(objectConfig);
					const localTriggers = (localObjectConfig).triggers;
					if (localTriggers) {
						objectConfig.triggers = localTriggers;
					}
					objectql.extend(objectConfig, { triggers: Creator.Objects[objectConfig.name].triggers }, { triggers: (localObjectConfig)._baseTriggers })
					Creator.Objects[objectConfig.name] = objectConfig;

					await Future.task(() => {
						try {
							Creator.loadObjects(objectConfig, objectConfig.name);
						} catch (error) {
							this.logger.error('metadata.objects.inserted error', objectConfig.name, error)
						}
					}).promise();
				}
			}
		},

		"$services.changed": async function (ctx) {
			const { broker } = ctx
			const hasLicense = broker.registry.hasService('@steedos/service-license')
			if (hasLicense){
				global.HAS_LICENSE_SERVICE = true
			} else {
				global.HAS_LICENSE_SERVICE = false
			}
		}
	},

	/**
	 * Methods
	 */
	methods: {
		// 动态修改浏览器端 Steedos.settings 变量，包括其中的 PUBLIC_SETTINGS
		setSettings(params) {
			_.defaultsDeep(__meteor_runtime_config__, params);
			Object.keys(WebApp.clientPrograms).forEach((arch) => {
				const program = WebApp.clientPrograms[arch];     
				const meteorRuntimeConfig = JSON.parse(program.meteorRuntimeConfig)
				_.defaultsDeep(meteorRuntimeConfig,  params)
				program.meteorRuntimeConfig = JSON.stringify(meteorRuntimeConfig);
			});
		},
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
			const broker = this.broker;
			await Future.task(() => {
				try {
					this.meteor.loadServerBundles();
					// 使用 express 服务扩展meteor req 功能, 比如sendFile等
					const connectHandlersExpress = express();
					const session = require('express-session');
					connectHandlersExpress.use(session({
						secret: process.env.STEEDOS_SESSION_SECRET || 'steedos',
						resave: false,
						saveUninitialized: true,
						cookie: { secure: false, maxAge: 800000 },
						name: 'ivan'
					}))
					connectHandlersExpress.use((req, res, next)=>{
						next();
					});
					connectHandlersExpress.use(require('@steedos/router').staticRouter());
					connectHandlersExpress.use(SteedosApi.express());
					if(process.env.STEEDOS_HTTP_DISABLE_METHOD){
						WebApp.connectHandlers.use((req, res, next) => {
							if (_.split(process.env.STEEDOS_HTTP_DISABLE_METHOD).includes(req.method)){
								res.statusCode = 405;
								return res.end('Method Not Allowed')
							}
							return next()
						});
					}

					if(process.env.STEEDOS_HTTP_ENABLED_HELMET===true || process.env.STEEDOS_HTTP_ENABLED_HELMET=='true'){
						
						const steedosConfig = objectql.getSteedosConfig();

						const helmetConfig = steedosConfig.helmet;

						WebApp.connectHandlers.use(helmet(helmetConfig))
					}

					WebApp.connectHandlers.use(connectHandlersExpress)
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

					// 给Push添加微服务事件
					Push.originalSend = Push.send;
					Push.send = async function (options) {
						Push.originalSend(options);
						try {
							await broker.emit('push.send', options)
						} catch (error) {

						}
					}

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
			// if (this.settings.apiServer && this.settings.apiServer.enabled) {
			// 	console.log(`this.WebApp.rawConnectHandlers.use`, this.WebApp.rawConnectHandlers.use.toString())
			// 	console.log(`======require('@steedos/router').staticRouter()=====`, require('@steedos/router').staticRouter())
			// 	this.WebApp.rawConnectHandlers.use(require('@steedos/router').staticRouter());
			// 	console.log(`===rawConnectHandlers===require('@steedos/router').staticRouter()=====`, require('@steedos/router').staticRouter())
			// 	this.WebApp.connectHandlers.use(SteedosApi.express());
			// }

		},

		async startStandardObjectsPackageLoader() {
			let settings = this.settings.packageInfo;
			if (settings.path) {
				return await new Promise((resolve, reject) => {
					this.standardObjectsPackageLoaderService = this.broker.createService({
						name: 'standard-objects',
						mixins: [packageLoader],
						settings: { packageInfo: settings },
						started: () => {
							resolve(true)
						}
					});
					if (!this.broker.started) {
						this.broker._restartService(this.standardObjectsPackageLoaderService)
					}
				})
			}

		},


		// 设置魔方Id
		async setMasterSpaceId() {

			// if (validator.trim(process.env.STEEDOS_TENANT_MASTER_ID || '').length == 0) {
			// 	process.env.STEEDOS_TENANT_MASTER_ID = (await objectql.getObject('spaces').directFind({ fields: ['_id', 'name', 'admins'] }))[0]['_id']
			// 	this.logger.info(`Set master space id to first space: ${process.env.STEEDOS_TENANT_MASTER_ID} `)
			// }		
			
			this.masterSpaceId = process.env.STEEDOS_TENANT_MASTER_ID
			this.setSettings({
				PUBLIC_SETTINGS: {
					masterSpaceId: process.env.STEEDOS_TENANT_MASTER_ID
				}
			})
		},
		/**
		 * 导入流程
		 * @param {object} flow 
		 * @param {string} name 
		 * @param {string} spaceId 非必传
		 */
		importFlow: async function(flow, name, spaceId) {
            await Future.task(() => {
                try {
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
                        if (spaceId) {
                            space = db.spaces.findOne(spaceId)
                        }
                        if(!space && steedosConfig && steedosConfig.tenant && steedosConfig.tenant._id){
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
                        const dbFlow = db.flows.findOne({api_name: flow.api_name, space: space._id});
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
                            // 默认分部
                            if (!company_id) {
                                const rootOrg = db.organizations.findOne({ space: space._id, is_company: true, parent: null });
                                if (rootOrg && rootOrg.company_id) {
                                    company_id = rootOrg.company_id;
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
            
        },

		allowInit: async function (spaces) {
			if (spaces && spaces.length > 0) {
				return false;
			}
			// 查询库中工作区记录，如果有工作区记录则不初始化
			const spaceObj = objectql.getObject('spaces');
			let spacesCount = await spaceObj.count({});
			if (spacesCount > 0) {
				return false;
			}
			return true;
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
		// let time = new Date().getTime();
		// this.broker.waitForServices(this.name).then(async () => {
			process.env.PORT = this.settings.port;
			process.env.ROOT_URL = this.settings.rootUrl;

			await this.startSteedos();

			// this.startAPIService();
			await this.setMasterSpaceId();

			// console.log('耗时：', new Date().getTime() - time);
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

function getBuiltinPlugins () {
	const plugins = [
		"@steedos/standard-object-database",
		"@steedos/standard-process-approval",
		"@steedos/standard-collaboration",
		"@steedos/standard-ui",
		"@steedos/standard-permission",
		// "@steedos/webapp-public",
		// "@steedos/service-ui",
		"@steedos/service-cachers-manager", // 依赖了 steedos/core
		"@steedos/workflow",
		"@steedos/accounts",
		// "@steedos/word-template",
		"@steedos/metadata-api", // ? TODO: 为啥使用meteor package load
		"@steedos/data-import", // main 文件不是 package.service.js
		"@steedos/service-fields-indexs", // 依赖了meteor collection
		// "@steedos/service-accounts",
		// "@steedos/service-charts",
		// "@steedos/service-pages",
		// "@steedos/service-workflow",
		// "@steedos/service-plugin-amis",
		// "@steedos/standard-process"
		// "@steedos/service-files",
		// "@steedos/steedos-plugin-schema-builder",
		"@steedos/service-core-objects"
	]
	if ("true" == process.env.STEEDOS_ENABLE_STANDARD_ACCOUNTS) {
		plugins.unshift("@steedos/standard-accounts");
	}
	return plugins
}
