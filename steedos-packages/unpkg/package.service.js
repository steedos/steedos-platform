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
				if (this.settings.unpkgUrl) {
					router.get('/unpkg.com/*', (req, res) => {
						const packageUrl = req.path.split('/unpkg.com')[1]
						res.redirect(this.settings.unpkgUrl + packageUrl);
						return
					})
				}
				
				// WebApp.connectHandlers.use(router);
				// SteedosApi?.server?.use(router);
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