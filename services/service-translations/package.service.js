/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:35:35
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-06-09 15:23:21
 * @Description: 
 */
"use strict";
const project = require('./package.json');
const serviceName = project.name;
const core = require('@steedos/core');
const i18n = require('@steedos/i18n');
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
					i18n.clearCacher('objects');
				})
			}
		}
	},

	async started() {
		core.loadTranslations();
		core.loadObjectTranslations();
	},
};
