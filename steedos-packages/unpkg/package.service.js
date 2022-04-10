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
		unpkgUrl: process.env.STEEDOS_UNPKG_URL,
		packages: [
			'd3',
			'react',
			'react-dom',
			'prop-types',
			'lodash',
			'moment',
			'@steedos-builder/react',
			'@steedos-ui/builder-community',
			'@steedos-widgets/design-system',
		],
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
				if (this.settings.unpkgUrl) {
					router.get('/unpkg.com/*', (req, res) => {
						const packageUrl = req.path.split('/unpkg.com')[1]
						res.redirect(this.settings.unpkgUrl + packageUrl);
						return
					})
				} else {
					const cacheTime = 86400000 * 1; // one day
					this.settings.packages.forEach(packageName => {				
						try {										
							var packageDir = process.cwd() + packageName;
							if (!fs.existsSync(packageDir)) {
								packageDir = path.dirname(require.resolve(packageName + '/package.json')).replace('/package.json', '')
							} 
							if (!fs.existsSync(packageDir)) {
								console.error(`Package not found: ${packageName}, you should add to you project.`)
							} else {
								router.use(`/unpkg.com/${packageName}/`, express.static(packageDir, { maxAge: cacheTime }));
								router.use(`/unpkg.com/${packageName}@([^/]+)/`, express.static(packageDir, { maxAge: cacheTime }));
							}
							
						}catch(error){
							console.error(`Package not found: ${packageName}, you should add to you project.`)
						}
					});
				}
				
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
