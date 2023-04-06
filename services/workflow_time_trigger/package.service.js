/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-11-12 13:05:05
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-11-12 20:19:51
 * @Description: 
 */
"use strict";
const project = require('./package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-package-loader');

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
	dependencies: ['~packages-@steedos/standard-process-approval'],

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
		require('./main/default/schedule/time_trigger').run()
		require('./main/default/schedule/time_trigger_queue').run()
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
