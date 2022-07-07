/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:35:35
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-07-07 10:17:46
 * @Description: 维护内存缓存
 */
"use strict";
const project = require('./package.json');
const serviceName = project.name;
const core = require('@steedos/core');
const cachers = require('@steedos/cachers');
const auth = require('@steedos/auth')
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
	},

	/**
	 * Dependencies
	 */
	dependencies: [],
	methods: {
		loadActionTriggers: async function (broker) {
			const cache = cachers.getCacher('action-triggers');
			broker.call('triggers.getAll').then((res)=>{
				cache.set('triggerActions', res);
			})
		}
	},

	/**
	 * Events
	 */
	events: {
		"translations.change": {
			handler() {
				core.loadTranslations()
			}
		},
		"translations.object.change": {
			handler() {
				core.loadObjectTranslations().then(()=>{
					cachers.getCacher('lru.translations.objects').clear();
				})
			}
		},
		"triggers.change": {
			handler(ctx){
				this.loadActionTriggers(ctx.broker);
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
	},

	async started() {
		core.loadTranslations();
		core.loadObjectTranslations();
		this.loadActionTriggers(this.broker);
	},
};
