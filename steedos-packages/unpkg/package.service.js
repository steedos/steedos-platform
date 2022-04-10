/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 15:21:28
 * @Description: 登录 web
 */
"use strict";
const project = require('./package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-package-loader');
const express = require('express');
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
			name: packageName
		},
		unpkgUrl: process.env.STEEDOS_UNPKG_URL? process.env.STEEDOS_UNPKG_URL : 'node_modules',
		white_list: [],
		black_list: [],
		resolved_modules: [],
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

		parsePackagePathname: function(pathname) {

			const packagePathnameFormat = /^\/((?:@[^/@]+\/)?[^/@]+)(?:@([^/]+))?(\/.*)?$/;
		
			try {
				pathname = decodeURIComponent(pathname);
			} catch (error) {
				return null;
			}
		
			const match = packagePathnameFormat.exec(pathname);
		
			// Disallow invalid pathnames.
			if (match == null) return null;
		
			const packageName = match[1];
			const packageVersion = match[2] || 'latest';
			const filename = (match[3] || '').replace(/\/\/+/g, '/');
		
			return {
				// If the pathname is /@scope/name@version/file.js:
				packageName, // @scope/name
				packageVersion, // version
				packageSpec: `${packageName}@${packageVersion}`, // @scope/name@version
				filename // /file.js
			};
		},
		
		loadUnpkgRoutes: function() {
			try {
				const router = express.Router();
				const unpkgUrl = this.settings.unpkgUrl
				const resolved_modules = this.settings.resolved_modules;
				router.get('/unpkg.com/*', (req, res) => {
					const packageUrl = req.path.split('/unpkg.com')[1]
					if (unpkgUrl !== 'node_modules') {
						res.redirect(unpkgUrl + packageUrl);
						return
					}
					const parsed = this.parsePackagePathname(packageUrl)
					try {
						if (parsed && resolved_modules.indexOf(parsed.packageName)<0) {
							const packageDir =  path.dirname(require.resolve(parsed.packageName + '/package.json')).replace('/package.json', '')
							if (fs.existsSync(packageDir)) {
								const cacheTime = 86400000 * 1; // one day
								router.use(`/unpkg.com/${parsed.packageName}`, express.static(packageDir, { maxAge: cacheTime }));
								resolved_modules.push(parsed.packageName)
							}
						}
					}catch(error){
						console.log(`Package not found: ${parsed.packageSpec}, you should add to you project.`)
					}
				});
				WebApp.connectHandlers.use(router);
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
