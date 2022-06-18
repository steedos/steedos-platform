/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:35:35
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-06-18 09:56:56
 * @Description: 维护内存缓存
 */
"use strict";
const project = require('./package.json');
const serviceName = project.name;
const core = require('@steedos/core');
const cachers = require('@steedos/cachers');
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
		}
	},

	async started() {
		core.loadTranslations();
		core.loadObjectTranslations();
		this.loadActionTriggers(this.broker);
	},
};
