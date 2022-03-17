"use strict";
const project = require('./package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-package-loader');
const _ = require(`lodash`);
const express = require('express');
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
		},
		initBuilderRouter: false
	},

	/**
	 * Dependencies
	 */
	dependencies: ['~packages-@steedos/service-pages'],

	/**
	 * Actions
	 */
	actions: {

	},

	/**
	 * Events
	 */
	events: {
		'steedos-server.started': async function (ctx) {
			this.initBuilderRouter();
		}
	},

	/**
	 * Methods
	 */
	methods: {
		initBuilderRouter: {
			handler() {
				if (this.settings.initBuilderRouter) {
					return;
				}
				this.settings.initBuilderRouter = true;
				try {
					const router = express.Router();
					let publicPath = path.join(__dirname, 'public');
					let routerPath = "";
					if (__meteor_runtime_config__.ROOT_URL_PATH_PREFIX) {
						routerPath = __meteor_runtime_config__.ROOT_URL_PATH_PREFIX;
					}
					const cacheTime = 86400000 * 1; // one day
					router.use(routerPath, express.static(publicPath, { maxAge: cacheTime }));
					WebApp.rawConnectHandlers.use(router);
				} catch (error) {
					console.error(error)
					this.settings.initBuilderRouter = false;
				}
			}
		},
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
		this.initBuilderRouter();
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
