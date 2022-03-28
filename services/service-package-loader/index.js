"use strict";

const objectql = require('@steedos/objectql');
const core = require('@steedos/core');
const triggerLoader = require('./lib').triggerLoader;
const sendPackageFlowToDb = require('./lib/loadPackageFlow').sendPackageFlowToDb;
const path = require('path');
const Future = require('fibers/future');
const _ = require('lodash');
const globby = require("globby");
const express = require('express');
const fs = require("fs");
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
    name: "service-package-loader",

    /**
     * Settings
     */
    settings: {
        path: '', // 扫描加载原数据的路径
        name: '', // service name
		loadedPackagePublicFiles: false
    },

    /**
     * Dependencies
     */
    dependencies: ['metadata-server'],

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
            handler() {
                let packageInfo = this.settings.packageInfo;
                if (!packageInfo) {
                    return;
                }
                const { path : _path } = packageInfo;

                this.loadPackagePublicFiles(_path);

                if(_path){
                    //此处延迟10秒加载流程文件，防止工作区初始化未完成
                    setTimeout(() => {
                        sendPackageFlowToDb(this.broker, _path)
                    }, 10 * 1000)
                }
            }
        }
    },

    /**
     * Methods
     */
    methods: {
        loadPackageMetadataFiles: async function (packagePath, name, datasourceName) {
            await Future.task(async () => {
                if (!datasourceName) {
                    datasourceName = 'default';
                }
                objectql.getSteedosSchema(this.broker);
                packagePath = path.join(packagePath, '**');
                const datasource = objectql.getDataSource(datasourceName);
                await datasource.init();
                await objectql.loadStandardMetadata(name, datasourceName);
                await objectql.addAllConfigFiles(packagePath, datasourceName, name);
                await triggerLoader.load(this.broker, packagePath, name);
                core.loadClientScripts();
                let routersData = objectql.loadRouters(packagePath);
                let oldRoutersInfo = await this.broker.call(`@steedos/service-packages.getPackageRoutersInfo`, {packageName: name})
                let routersInfo = _.flattenDeep(_.map(routersData, 'infoList'));
                if(oldRoutersInfo){
                    _.each(oldRoutersInfo.metadata, (info)=>{
                        const _info = _.find(routersInfo, (item)=>{
                            return item.path == info.path && JSON.stringify(item.methods) == JSON.stringify(info.methods) && item.md5 == info.md5
                        })
                        if(!_info){
                            core.removeRouter(info.path, info.methods)
                        }
                    })
                }
                const _routers = [];
                routersData.forEach(element => {
                    _routers.push(element)
                });
                core.loadRouters(_routers);
                await this.broker.call(`@steedos/service-packages.setPackageRoutersInfo`, {packageName: name, data: routersInfo})
                return;
            }).promise();
        },
        loadPackageMetadataServices: async function (packagePath) {
            const filePatten = [
                path.join(packagePath, 'main', 'default', 'services', `*.service.js`),
                "!" + path.join(packagePath, "**", "node_modules"),
            ];
            const matchedPaths = globby.sync(filePatten);
            for await (const serviceFilePath of matchedPaths) {
                try {
                    const service = this.broker.loadService(serviceFilePath);
                    this.packageServices.push(service);
                    if (!this.broker.started) {
                        this.broker._restartService(service)
                    }
                } catch (error) {
                    this.logger.error(error)
                }
            }
        },
        loadPackagePublicFiles: {
            handler(packagePath) {
                let publicPath = path.join(packagePath, 'public');
				if (!fs.existsSync(publicPath) ||this.settings.loadedPackagePublicFiles || !WebApp) {
					return;
				}

				this.settings.loadedPackagePublicFiles = true;
				try {
					const router = express.Router();
					let routerPath = "";
					if (__meteor_runtime_config__.ROOT_URL_PATH_PREFIX) {
						routerPath = __meteor_runtime_config__.ROOT_URL_PATH_PREFIX;
					}
					const cacheTime = 86400000 * 1; // one day
					router.use(routerPath, express.static(publicPath, { maxAge: cacheTime }));
					WebApp.rawConnectHandlers.use(router);

                    console.log(`loadPackagePublicFiles ===>`, publicPath)

				} catch (error) {
					console.error(error)
					this.settings.loadedPackagePublicFiles = false;
				}
			}
        }
    },

    /**
     * Service created lifecycle event handler
     */
    created() {
        this.packageServices = [];  //此属性不能放到settings下，否则会导致mo clone settings 时 内存溢出。
        this.logger.debug('service package loader created!!!');
    },

    merged(schema) {
        schema.name = `~packages-${schema.name}`;
    },

    /**
     * Service started lifecycle event handler
     */
    async started() {
        console.time(`service ${this.name} started`)
        let packageInfo = this.settings.packageInfo;
        if (!packageInfo) {
            return;
        }
        const { path : _path, datasource, isPackage } = packageInfo;
        if (!_path) {
            this.logger.error(`Please config packageInfo in your settings.`);
            console.log(`service ${this.name} started`);
            return;
        }
        this.broker.waitForServices("steedos-server").then(async () => {
			sendPackageFlowToDb(this.broker, _path, this.name)
		});
        
        await this.loadPackageMetadataFiles(_path, this.name, datasource);
        if(isPackage !== false){
            try {
                const _packageInfo = objectql.loadJSONFile(path.join(_path, 'package.json'));
                await this.broker.call(`@steedos/service-packages.online`, {serviceInfo: {name: this.name, nodeID: this.broker.nodeID, instanceID: this.broker.instanceID, path: _path, version: _packageInfo.version, description: _packageInfo.description}})
            } catch (error) {
                
            }    
        }

        await this.loadPackageMetadataServices(_path);

        await this.loadPackagePublicFiles(_path);

        console.timeEnd(`service ${this.name} started`)
        // console.log(`service ${this.name} started`);
    },

    /**
     * Service stopped lifecycle event handler
     */
    async stopped() {
        for await (const packageService of this.packageServices) {
            try {
                await this.broker.destroyService(packageService);
            } catch (error) {
                this.logger.errorr(error);
            }
        }
        this.broker.call(`@steedos/service-packages.offline`, {serviceInfo: {name: this.name, nodeID: this.broker.nodeID, instanceID: this.broker.instanceID}})
        await this.broker.call(`metadata.refreshServiceMetadatas`, { offlinePackageServices: [`${this.broker.nodeID}.${this.name}`] });
        console.log(`service ${this.name} stopped`);
    }
};
