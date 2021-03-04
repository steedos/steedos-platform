"use strict";

const objectql = require('@steedos/objectql');
const triggerLoader = require('./lib').triggerLoader;
const path = require('path');

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "service-package-loader",

	/**
	 * Settings
	 */
	settings: {
		path: '', // 扫描加载原数据的路径
		name: '' // service name
	},

	/**
	 * Dependencies
	 */
	dependencies: [],

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
		loadPackageMetadataFiles: async function (packagePath, name) {
			console.log('path: ', packagePath);
			packagePath = path.join(packagePath, '**');
			objectql.addAllConfigFiles(packagePath, 'default');
			await triggerLoader.load(this.broker, packagePath, name);
			return;
		}
	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {
		this.logger.debug('service package loader created!!!');
	},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {
		let packageInfo = this.settings.packageInfo;
		let path = packageInfo.path;
		let name = packageInfo.name;
		if (!path || !name) {
			this.logger.error(`Please config packageInfo in your settings.`);
			return;
		}
		await this.loadPackageMetadataFiles(path, name);
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
