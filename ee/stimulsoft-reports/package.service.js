"use strict";
const project = require('./package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-package-loader');
const express = require('express');
const license = require('@steedos/license');
const objectql = require('@steedos/objectql');
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
	dependencies: ['steedos-server', '~packages-@steedos/ee_service-plugin-license'],

	/**
	 * Actions
	 */
	actions: {

	},

	/**
	 * Events
	 */
	/**
	 * Methods
	 */
	methods: {
		loadWebapp: async function (ctx) {
			try {
				if (WebApp && __meteor_runtime_config__) {
					const router = require('@steedos/router').staticRouter()
					let publicPath = require.resolve("@steedos/ee_stimulsoft-reports/package.json");
					publicPath = publicPath.replace("package.json", 'webapp');
					let routerPath = "";
					if (__meteor_runtime_config__.ROOT_URL_PATH_PREFIX) {
						routerPath = __meteor_runtime_config__.ROOT_URL_PATH_PREFIX;
					}
					const cacheTime = 86400000 * 1; // one day
					router.use(`${routerPath}/@steedos/ee_stimulsoft-reports`, express.static(publicPath, { maxAge: cacheTime }));
					// WebApp.rawConnectHandlers.use(router);
				}
			} catch (error) {
				console.log(`error`, error);
			}
		}
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
		// try {
        //     const allow = await license.isPlatformEnterPrise(objectql.getSteedosConfig().tenant._id)
		// 	if(!allow){
		// 		throw new Error('请购买企业版许可证，以使用「报表」功能。')
		// 	}
		// 	this.loadWebapp();
        // } catch (error) {
        //     this.broker.logger.error(`[${this.name}] 启动失败: ${error.message}`);
        //     return await this.broker.destroyService(this);
        // }
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
