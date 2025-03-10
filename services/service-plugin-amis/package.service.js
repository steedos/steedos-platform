/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-05-19 11:38:30
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-03-10 11:59:01
 * @Description: 
 */
"use strict";
const project = require('./package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-package-loader');

const path = require('path');
const fs = require("fs");

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
			isPackage: false
		},
		loadedPublicClientJS: false,
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
		
	},

	/**
	 * Methods
	 */
	methods: {
		publicClientJS: {
            handler() {
				let packageInfo = this.settings.packageInfo;
				if (!packageInfo) {
					return;
				}
				const { path : packagePath } = packageInfo;
                let publicPath = path.join(packagePath, 'main', 'default', 'client');
                try {
                    if (!fs.existsSync(publicPath) || this.settings.loadedPublicClientJS) {
                        return;
                    }
                } catch (error) {
					console.log('error', error)
                    return
                }

                try {
                    const express = require('express');
                    this.settings.loadedPublicClientJS = true;
                    try {
                        const router = require('@steedos/router').staticRouter();
                        let routerPath = "";
                        if (process.env.ROOT_URL_PATH_PREFIX) {
                            routerPath = process.env.ROOT_URL_PATH_PREFIX;
                        }
                        const cacheTime = 86400000 * 1; // one day
                        router.use(`${routerPath}/amis-pages/js`, express.static(publicPath, { maxAge: cacheTime }));
                    } catch (error) {
                        console.error(error)
                        this.settings.loadedPublicClientJS = false;
                    }
                } catch (error) {
                        
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
		await this.publicClientJS()
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
