/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 15:21:28
 * @Description: 登录 web
 */
"use strict";
const project = require('./package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-package-loader');
const fs = require('fs')
const path = require('path')


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
		},
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
		
		loadUnpkgRoutes: function() {
			try {
				const router = require('@steedos/router').staticRouter()
				if (process.env.STEEDOS_LICENSE && process.env.STEEDOS_UNPKG_URL === '/unpkg') {
					// 启动内置 unpkg 服务
					process.env.UNPKG_BASE_URL = "/unpkg";
					process.env.NPM_CACHE_FOLDER = path.join(
						process.env.B6_STORAGE_DIR,
						"unpkg",
					);
					const eeUnpkg = require("@steedos/ee_unpkg");
			
					const unpkgApp = eeUnpkg();
					router.use("/", unpkgApp);
				}

				router.get('/unpkg.com/*unpkg', (req, res) => {
					const packageUrl = req.path.split('/unpkg.com')[1]
					res.redirect(process.env.STEEDOS_UNPKG_URL + packageUrl);
					return
				})
				
			} catch (error) {
				console.error(error)
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
		this.loadUnpkgRoutes();
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};