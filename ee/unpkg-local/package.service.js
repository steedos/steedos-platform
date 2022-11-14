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
			name: packageName,
			isPackage: false
		},
		unpkgUrl: process.env.STEEDOS_UNPKG_URL ? process.env.STEEDOS_UNPKG_URL: 'https://unpkg.steedos.cn',
		local_packages: [
			'd3',
			'echarts',
			'echarts-stat',
			'react',
			'react-dom',
			'prop-types',
			'lodash',
			'moment',
			'monaco-editor',
			'amis',
			'@steedos-builder/react',
			'@steedos/filters',
			'@steedos-ui/amis',
			'@steedos-ui/builder-community',
			'@steedos-ui/design-system',
			'@steedos-ui/builder-widgets',
			'@salesforce-ux/design-system',
			'axios',
			'mermaid',
			'marked',
			'crypto-js',
			'@steedos-builder/fiddle'
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
				const cacheTime = 86400000 * 1; // one day
				this.settings.local_packages.forEach(packageName => {		
					var packageDir = path.join(process.cwd(), 'node_modules', packageName);
					if (true)  //(!fs.existsSync(packageDir)) 
					{
						try {
							if(packageName === 'amis'){
								packageDir = path.dirname(path.dirname(require.resolve(packageName + '/sdk/sdk.js')))
							}else{
								packageDir = path.dirname(require.resolve(packageName + '/package.json')).replace('/package.json', '')
							}
						} catch (e) {
							console.log(e)
						}
					} 
					if (fs.existsSync(packageDir)) {
						router.use(`/unpkg.com/${packageName}/`, express.static(packageDir, { maxAge: cacheTime }));
						// 内置模块，统一跳转到无版本号URL，防止浏览器端重复加载。
						router.get(`/unpkg.com/${packageName}@*`, (req, res) => {
							const packageUrl = req.path.split('/unpkg.com')[1]
							const parsed = this.parsePackagePathname(packageUrl)
							// res.redirect(301, `/unpkg.com/${parsed.packageName}${parsed.filename}`);
							return res.sendFile(path.join(packageDir, parsed.filename), { maxAge: cacheTime });
						})
					} else {
						this.logger.warn(301, `Package not found: ${packageName}, you should add to you project.`)
					}
				});
				if (this.settings.unpkgUrl) {
					router.get('/unpkg.com/*', (req, res) => {
						const packageUrl = req.path.split('/unpkg.com')[1]
						res.redirect(301, this.settings.unpkgUrl + packageUrl);
						return
					})
				}
				SteedosApi?.server?.use(router);
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