/*
 * @Author: yinlianghui@steedos.com
 * @Date: 2022-07-26 11:45:49
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-07-19 14:58:21
 * @Description: 
 */
"use strict";
const project = require('./package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-package-loader');
const register = require('@steedos/metadata-registrar');
const steedosI18n = require("@steedos/i18n");
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
		generateObjectTranslationTemplate: async function(ctx){
			const {objectName, lng = 'zh-CN'} = ctx.params;
			console.log(`generateObjectTranslationTemplate===`, objectName, lng)
			if(!objectName){
				return {}
			}
			const objectConfig = await register.getObjectConfig(objectName);
			return steedosI18n.getObjectMetadataTranslationTemplate(lng, objectConfig.name, objectConfig, true);
		},
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
