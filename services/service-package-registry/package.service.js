"use strict";
const project = require('./package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-package-loader');
const loader = require('./main/default/manager/loader');
const packages = require('./main/default/manager/packages');
const metadata = require('@steedos/metadata-core')
const _ = require(`lodash`);
const path = require(`path`);
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
			name: packageName
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

		packages.maintainSystemFiles()

		try {
			const packagePath = path.join(process.cwd(), 'steedos-app');
			const packageInfo = require(path.join(packagePath, 'package.json'));
			loader.appendToPackagesConfig(`${packageInfo.name}`, {version: packageInfo.version, description: packageInfo.description, local: true, path: packagePath});
		} catch (error) {
			console.log(`started error`, error)
		}

		await metadata.uncompressPackages(process.cwd());
		const mPackages = metadata.getAllPackages(process.cwd());
		_.each(mPackages, (packagePath)=>{
			try {
				const packageInfo = require(path.join(packagePath, 'package.json'));
				loader.appendToPackagesConfig(packageInfo.name, {version: packageInfo.version, description: packageInfo.description, local: true, path: packagePath});
			} catch (error) {
				console.log(`started error`, error)
			}
		})
		await loader.loadPackages();
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
