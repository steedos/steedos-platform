"use strict";

const objectql = require('@steedos/objectql');
const core = require('@steedos/core');
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
  dependencies: ['metadata-server'],

	/**
	 * Actions
	 */
	actions: {

	},

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

	/**
	 * Methods
	 */
	methods: {
		loadPackageMetadataFiles: async function (packagePath, name, datasourceName) {
			await Future.task(async () => {
				//datasourceName 参数为临时改动，待meteor-package-load 处理完成后，此部分代码可以删除
				if(!datasourceName){
					datasourceName = 'default';
				}
				objectql.getSteedosSchema(this.broker);
				packagePath = path.join(packagePath, '**');
				objectql.loadStandardObjects();
				await objectql.addAllConfigFiles(packagePath, datasourceName);
				const datasource = objectql.getDataSource(datasourceName);
				await datasource.init();
				await triggerLoader.load(this.broker, packagePath, name);
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
		const {path, name, datasource} = packageInfo;
		if (!path || !name) {
			this.logger.error(`Please config packageInfo in your settings.`);
			return;
		}
		await this.loadPackageMetadataFiles(path, name, datasource);
		console.log(`service ${name} started`);
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
