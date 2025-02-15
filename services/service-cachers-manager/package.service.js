/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:35:35
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-02-15 17:20:59
 * @Description: 维护内存缓存
 */
"use strict";
const project = require('./package.json');
const serviceName = project.name;
// TODO 国际化
const core = require('./lib/translations');
const cachers = require('@steedos/cachers');
const auth = require('@steedos/auth');
const { getObject } = require('@steedos/objectql');
const register = require('@steedos/metadata-registrar');
const _ = require('underscore');
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
	dependencies: ['metadata','~packages-@steedos/service-core-objects'],
	methods: {
		// 加载mo action规则的triggers
		loadActionTriggers: async function (broker) {
			const cache = cachers.getCacher('action-triggers');
			broker.call('triggers.getAll').then((res) => {
				cache.set('triggerActions', res);
			})
		},
		// 加载 steedos 规则的triggers
		loadTriggers: async function (broker) {
			const cache = cachers.getCacher('triggers');
			broker.call('object_triggers.getAll').then((res) => {
				cache.set('triggers', res);
			})
		},
		loadProfiles: async function () {
			const cache = cachers.getCacher('profiles');
			const profileDocs = await getObject('permission_set').directFind({
				filters: [
					['type', '=', 'profile'],
				],
			});
			for (const doc of profileDocs) {
				// 库里的简档
				cache.set(`${doc.space}_${doc.name}`, doc);
			}
			const sourceProfiles = await register.getSourceProfiles()
			for (const doc of sourceProfiles) {
				// 代码定义的简档
				cache.set(doc.name, doc);
			}
		}
	},

	/**
	 * Events
	 */
	events: {
		"translations.change": {
			handler() {
				if (this.translationsChangeTimeoutId) {
					clearTimeout(this.translationsChangeTimeoutId)
				}
				this.translationsChangeTimeoutId = setTimeout(() => {
					core.loadTranslations()
					this.translationsChangeTimeoutId = null;
				}, 2000)
			}
		},
		"translations.object.change": {
			handler() {
				if (this.objectTranslationsChangeTimeoutId) {
					clearTimeout(this.objectTranslationsChangeTimeoutId)
				}
				this.objectTranslationsChangeTimeoutId = setTimeout(() => {
					core.loadObjectTranslations().then(() => {
						console.log(`core.loadObjectTranslations====>`)
						cachers.getCacher('lru.translations.objects').clear();
					})
					this.objectTranslationsChangeTimeoutId = null;
				}, 2000)

			}
		},
		"triggers.change": {
			handler(ctx) {
				this.loadActionTriggers(ctx.broker);
			}
		},
		"metadata.object_triggers.change": {
			handler(ctx) {
				this.loadTriggers(ctx.broker);
			}
		},
		/**
		 * userSession支持实时更新
		 * 当space_users属性值发生变更后清除userSession缓存
		 */
		"@space_users.updated": {
			handler(ctx) {
				const params = ctx.params
				const { isUpdate, isAfter } = params;
				if (isAfter && isUpdate) {
					auth.deleteSpaceUserSessionCacheByChangedProp(params.doc, params.previousDoc)
				}
			}
		},
		/**
		 * userSession支持实时更新
		 * 当spaces属性值发生变更后清除spaces缓存
		 */
		"@spaces.updated": {
			handler(ctx) {
				const params = ctx.params
				const { isUpdate, isAfter } = params;
				if (isAfter && isUpdate) {
					auth.deleteSpaceCacheByChangedProp(params.doc, params.previousDoc)
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
					if (!globalServicesVars[serviceName]) {
						globalServicesVars[serviceName] = {};
					}
					for (const key in actions) {
						if (Object.prototype.hasOwnProperty.call(actions, key)) {
							const rawName = actions[key].rawName;
							globalServicesVars[serviceName][rawName] = async function (params, opts) {
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
					if (!objects[objectName]) {
						objects[objectName] = {}
					}

					//TODO 确认 delete\directDelete 功能
					_.each(['find', 'count', 'findOne', 'insert', 'update', 'delete', 'directFind', 'directInsert', 'directUpdate', 'directDelete'], (funKey) => {
						objects[objectName][funKey] = function (...args) {
							return obj[funKey].apply(obj, args)   // 重写this为obj, 防止this异常
						}
					})
				};
				// console.log('===========global.objects===========');
				// console.log(objects)
				global.objects = objects;
			}
		},
		"steedos-server.started": {
			handler(ctx) {
				// 初始化缓存
				this.loadProfiles();
			}
		},
		"@permission_set.*": {
			async handler(ctx) {
				// 数据库数据变化后，重新加载缓存
				const params = ctx.params
				const { isUpdate, isAfter, isInsert, isDelete, doc, previousDoc } = params;
				if (isAfter && (isUpdate || isInsert || isDelete) && ('profile' === (doc || {}).type || 'profile' === (previousDoc || {}).type)) {
					// 先清理缓存
					cachers.clearCacher('profiles');
					// 重新添加缓存
					await this.loadProfiles();
				}
			}
		},
		"$METADATA.profiles.*": {
			async handler(ctx) {
				if (this.profilesChangeTimeoutId) {
					clearTimeout(this.profilesChangeTimeoutId)
				}
				this.profilesChangeTimeoutId = setTimeout(() => {
					// 先清理缓存
					cachers.clearCacher('profiles');
					// 重新添加缓存
					this.loadProfiles();
					this.profilesChangeTimeoutId = null;
				}, 2000)
			}
		},
		"$user.logout": {
			async handler(ctx) {
				const { authToken } = ctx.params;
				auth.removeUserTokenByToken(authToken)
			}
		}
	},

	actions: {
		getProfile: {
			params: {
				name: { type: "string" },
				spaceId: { type: "string", optional: true }
			},
			async handler(ctx) {
				const { name, spaceId } = ctx.params;

				const cache = cachers.getCacher('profiles');
				let profile;
				if (spaceId) {
					profile = cache.get(`${spaceId}_${name}`);
				}
				if (!profile) {
					profile = cache.get(name);
				}
				return profile;
			}
		},
		getPermissionTabs: {
			params: {
				spaceId: { type: "string", optional: true },
				roles: { type: "array", items: "string" },
			},
			async handler(ctx) {
				const { roles, spaceId } = ctx.params;

				const cache = cachers.getCacher('permission_tabs');

				return [];
			}
		},
	},
	created(){
		console.log('created', serviceName);
	},
	async started() {
		console.log('started', serviceName);
		core.InitTranslations()
		core.loadTranslations();
		core.loadObjectTranslations();
		console.log(`core.loadObjectTranslations===>1`)
		this.loadActionTriggers(this.broker);
		this.loadTriggers(this.broker);

		this.broker.createService(require("./metadata-cachers.service"));
	},

	async stopped(){
		this.actionFieldUpdateCacher?.destroy();
		this.workflowOutboundMessageCacher?.destroy();
		this.workflowNotificationCacher?.destroy();
		this.workflowRuleCacher?.destroy();
	}
};
