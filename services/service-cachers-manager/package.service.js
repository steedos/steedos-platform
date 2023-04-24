/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:35:35
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-04-24 11:43:06
 * @Description: 维护内存缓存
 */
"use strict";
const project = require('./package.json');
const serviceName = project.name;
const core = require('@steedos/core');
const cachers = require('@steedos/cachers');
const auth = require('@steedos/auth');
const { getObject } = require('@steedos/objectql');
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * 软件包服务启动后也需要抛出事件。
 */
module.exports = {
	name: serviceName,
	namespace: "steedos",
	translationsChangeTimeoutId: null,
	objectTranslationsChangeTimeoutId: null,
	/**
	 * Settings
	 */
	settings: {
	},

	/**
	 * Dependencies
	 */
	dependencies: [],
	methods: {
		// 加载mo action规则的triggers
		loadActionTriggers: async function (broker) {
			const cache = cachers.getCacher('action-triggers');
			broker.call('triggers.getAll').then((res)=>{
				cache.set('triggerActions', res);
			})
		},
		// 加载 steedos 规则的triggers
		loadTriggers: async function(broker){
			const cache = cachers.getCacher('triggers');
			broker.call('object_triggers.getAll').then((res)=>{
				cache.set('triggers', res);
			})
		}
	},

	/**
	 * Events
	 */
	events: {
		"translations.change": {
			handler() {
				if(this.translationsChangeTimeoutId){
					clearTimeout(this.translationsChangeTimeoutId)
				}
				this.translationsChangeTimeoutId = setTimeout(()=>{
					core.loadTranslations()
					this.translationsChangeTimeoutId = null;
				}, 2000)
			}
		},
		"translations.object.change": {
			handler() {
				if(this.objectTranslationsChangeTimeoutId){
					clearTimeout(this.objectTranslationsChangeTimeoutId)
				}
				this.objectTranslationsChangeTimeoutId = setTimeout(()=>{
					core.loadObjectTranslations().then(()=>{
						cachers.getCacher('lru.translations.objects').clear();
					})
					this.objectTranslationsChangeTimeoutId = null;
				}, 2000)
				
			}
		},
		"triggers.change": {
			handler(ctx){
				this.loadActionTriggers(ctx.broker);
			}
		},
		"metadata.object_triggers.add": {
			handler(ctx){
				this.loadTriggers(ctx.broker);
			}
		},
		/**
		 * userSession支持实时更新
		 * 当space_users属性值发生变更后清除userSession缓存
		 */
		"@space_users.updated": {
			handler(ctx){
				const params = ctx.params
				const operationType = params.operationType
				if (operationType === 'AFTER_UPDATE') {
					auth.deleteSpaceUserSessionCacheByChangedProp(params.new[0], params.old[0])
				}
			}
		},
		/**
		 * userSession支持实时更新
		 * 当spaces属性值发生变更后清除spaces缓存
		 */
		 "@spaces.updated": {
			handler(ctx){
				const params = ctx.params
				const operationType = params.operationType
				if (operationType === 'AFTER_UPDATE') {
					auth.deleteSpaceCacheByChangedProp(params.new[0], params.old[0])
				}
			}
		},
		"$services.changed": {
            async handler(ctx) {
                const { broker } = ctx
                const _services = broker.registry.getServiceList({ skipInternal: true, withActions: true });
				const globalServicesVars = {};
                for (const service of _services) {
                    const { name: serviceName, actions } = service
					if(!globalServicesVars[serviceName]){
						globalServicesVars[serviceName] = {};
					}
                    for (const key in actions) {
                        if (Object.prototype.hasOwnProperty.call(actions, key)) {
							const rawName = actions[key].rawName;
							globalServicesVars[serviceName][rawName] = async function(params, opts){
								return await broker.call(key, params, opts)
							}
                        }
                    }
                }
				global.services = globalServicesVars;
				// console.log('===========global.services===========');
				// console.log(global.services)
            }
        },
		"$packages.changed": {
			params: {},
			async handler(ctx) {
				const objects = {}
				const objectConfigs = await this.broker.call("objects.getAll");
				for (const object of objectConfigs) {
					const objectConfig = object.metadata
					const objectName = objectConfig.name
					// 排除 __MONGO_BASE_OBJECT __SQL_BASE_OBJECT
					if (['__MONGO_BASE_OBJECT', '__SQL_BASE_OBJECT'].includes(objectName)) {
						continue
					}

					const obj = getObject(objectName);
					if(!objects[objectName]){
						objects[objectName] = {}
					}

					//TODO 确认 delete\directDelete 功能
					_.each(['find', 'count', 'findOne', 'insert', 'update', 'delete', 'directFind', 'directInsert', 'directUpdate', 'directDelete'], (funKey)=>{
						objects[objectName][funKey] = function(...args){
							return obj[funKey].apply(obj, args)   // 重写this为obj, 防止this异常
						}
					})
				};
				console.log('===========global.objects===========');
				console.log(objects)
				global.objects = objects;
			}
		}
	},

	async started() {
		core.loadTranslations();
		core.loadObjectTranslations();
		this.loadActionTriggers(this.broker);
		this.loadTriggers(this.broker);
	},
};
