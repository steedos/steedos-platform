/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:35:35
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-06-10 14:11:22
 * @Description: 
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
				const cache = cachers.getCacher('action-triggers');
				ctx.broker.call('triggers.getAll').then((res)=>{
					cache.set('triggerActions', res);
				})
			}
		}
	},

	async started() {
		core.loadTranslations();
		core.loadObjectTranslations();
	},
};
