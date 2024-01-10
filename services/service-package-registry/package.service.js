/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-16 15:58:42
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2024-01-08 15:36:18
 * @Description: 
 */
"use strict";
const project = require('./package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-package-loader');
const path = require('path');

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
			name: this.name,
			isPackage: false
		},
		userDir: process.env.STEEDOS_PACKAGE_STORAGE || path.join(process.cwd(), '.steedos'),
	},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Service created lifecycle event handler
	 */
	async created() {
		this.broker.createService(require('./project.package.service'));
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

