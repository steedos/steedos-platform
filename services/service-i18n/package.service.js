/*
 * @Author: yinlianghui@steedos.com
 * @Date: 2022-07-26 11:45:49
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-04-04 09:14:25
 * @Description: 
 */
"use strict";
const project = require('./package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-package-loader');

const objectql = require("@steedos/objectql");
const steedosI18n = require("@steedos/i18n");
const core = require('@steedos/core');

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
			name: packageName,
			isPackage: false
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
		testObjectTranslation: {
			rest: {
                method: "GET",
                path: "/test/object-translation/:objectName"
            },
			async handler(ctx) {
				console.log('====',core)
				const userSession = ctx.meta.user;
				const { objectName } = ctx.params;
                const lng = userSession.language || 'zh-CN';
				const objectConfig = await objectql.getObjectConfig(objectName);
				steedosI18n.translationObject(lng, objectConfig.name, objectConfig, false, false, true);
                return objectConfig
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

	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
