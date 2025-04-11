/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-07-29 09:40:31
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-09 13:41:05
 * @Description: 
 */
"use strict";
const project = require('./package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-package-loader');
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
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
	dependencies: ['~packages-standard-objects'],

	/**
	 * Actions
	 */
	actions: {

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
