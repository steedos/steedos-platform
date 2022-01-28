"use strict";
const project = require('./package.json');
const serviceName = project.name;
const core = require('@steedos/core');

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
				core.loadObjectTranslations()
			}
		}
	},

	async started() {
		console.time(`started-Translations`)
		core.loadTranslations();
		core.loadObjectTranslations();
		console.timeEnd(`started-Translations`)
	},
};
