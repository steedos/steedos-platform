/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-05-19 11:38:30
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-08-02 15:05:31
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
		"steedos-server.started": {
            async handler() {
                await this.publicClientJS();
            }
        },
        "space.initialized": {
            async handler() {
                await this.publicClientJS();
            }
        }
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
                    if (!fs.existsSync(publicPath) || this.settings.loadedPublicClientJS || typeof WebApp == 'undefined') {
                        return;
                    }
                } catch (error) {
                    return
                }

                try {
                    const express = require('express');
                    this.settings.loadedPublicClientJS = true;
                    try {
                        const router = require('@steedos/router').staticRouter();
                        let routerPath = "";
                        if (__meteor_runtime_config__.ROOT_URL_PATH_PREFIX) {
                            routerPath = __meteor_runtime_config__.ROOT_URL_PATH_PREFIX;
                        }
                        const cacheTime = 86400000 * 1; // one day
                        router.use(`${routerPath}/amis-pages/js`, express.static(publicPath, { maxAge: cacheTime }));
                        // WebApp.connectHandlers.use(router);
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
		this.broker.waitForServices("steedos-server").then(async () => {
			await this.publicClientJS()
		});
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
