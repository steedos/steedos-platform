"use strict";

const objectql = require('@steedos/objectql');
const triggerLoader = require('./lib').triggerLoader;
const path = require('path');
const Future = require('fibers/future');
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
			await Future.task(async () => {
				objectql.getSteedosSchema(this.broker);
				packagePath = path.join(packagePath, '**');
				objectql.loadStandardObjects();
				objectql.addAllConfigFiles(packagePath, 'default');
				const datasource = objectql.getDataSource('default');
				await datasource.init();
				await triggerLoader.load(this.broker, packagePath, name);
				console.log('loadPackageMetadataFiles end...')
				return;
			}).promise();
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
		console.log(`service ${name} started`);
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
