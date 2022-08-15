"use strict";

const objectql = require('@steedos/objectql');
const core = require('@steedos/core');
const triggerLoader = require('./lib').triggerLoader;
const processLoader = require('./lib').processLoader;
const processTriggerLoader = require('./lib').processTriggerLoader;
const sendPackageFlowToDb = require('./lib/loadPackageFlow').sendPackageFlowToDb;
const path = require('path');
const Future = require('fibers/future');
const _ = require('lodash');
const globby = require("globby");
const express = require('express');
const fs = require("fs");
const metaDataCore = require('@steedos/metadata-core');
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
    name: "service-package-loader",

    /**
     * Settings
     */
    settings: {
        path: '', // 扫描加载元数据的路径
        name: '', // service name,
        loadedPackagePublicFiles: false,
        packageInfo: {
            loadPublicFolder: true, // 是否加载public文件夹
        }
    },

    /**
     * Dependencies
     */
    dependencies: ['metadata-server', '~packages-project-server'],

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
                await this.loadDataOnServiceStarted();
            }
        },
        "space.initialized": {
            async handler() {
                await this.loadDataOnServiceStarted();
            }
        }
    },

    /**
     * Methods
     */
    methods: {
        loadDataOnServiceStarted: async function(){
            let packageInfo = this.settings.packageInfo;
            if (!packageInfo) {
                return;
            }
            const { path : _path } = packageInfo;

            this.loadPackagePublicFiles(_path);
            if(_path){
                sendPackageFlowToDb(this.broker, _path)
                processLoader.sendPackageProcessToDb(_path);
            }
        },
        loadPackageMetadataFiles: async function (packagePath, name, datasourceName) {
            this.broker.logger.debug(`Loading package from ${packagePath}`)
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
                await processTriggerLoader.load(this.broker, packagePath, name);
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
                await this.broker.call(`@steedos/service-packages.setPackageRoutersInfo`, {packageName: name, data: routersInfo});
                await this.broker.emit(`translations.object.change`, {});
                return;
            }).promise();
        },
        loadPackageMetadataServices: async function (packagePath) {
            const filePatten = [
                path.join(packagePath, 'main', 'default', 'services', "**", `*.service.js`),
                "!" + path.join(packagePath, "**", "node_modules"),
            ];
            const matchedPaths = metaDataCore.syncMatchFiles(filePatten);
            for await (const serviceFilePath of matchedPaths) {
                try {
                    const service = objectql.loadService(this.broker, serviceFilePath);
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
                if (!this.settings.packageInfo.loadPublicFolder) {
                    return;
                }
                let publicPath = path.join(packagePath, 'public');
                try {
                    if (!fs.existsSync(publicPath) ||this.settings.loadedPackagePublicFiles || typeof WebApp == 'undefined') {
                        return;
                    }
                } catch (error) {
                    return
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
                    WebApp.connectHandlers.use(router);
                } catch (error) {
                    console.error(error)
                    this.settings.loadedPackagePublicFiles = false;
                }
            }
        },
        async errorHandler(error) {
            this.broker.logger.error(`[${this.name}] 启动失败: ${error.message}`);
            await await this.broker.call(`~packages-project-server.disablePackage`, {
                module: this.schema.packageName
            })
            return await this.broker.destroyService(this);
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
        schema.packageName = schema.name;
        schema.name = `~packages-${schema.name}`;
    },

    /**
     * Service started lifecycle event handler
     */
    async started() {
        if(this.beforeStart){
            try {
                await this.beforeStart()
            } catch (error) {
                return await this.errorHandler(error);
            }
        }

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
            await this.loadDataOnServiceStarted()
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

        // await this.loadPackagePublicFiles(_path);
        this.started = true;
        console.timeEnd(`service ${this.name} started`)
        if(this.afterStart){
            try {
                await this.afterStart();
            } catch (error) {
                this.broker.logger.error(`[${this.name}]: ${error.message}`);
            }
        }
    },

    /**
     * Service stopped lifecycle event handler
     */
    async stopped() {
        if(!this.started){
            return ;
        }
        for await (const packageService of this.packageServices) {
            try {
                await this.broker.destroyService(packageService);
            } catch (error) {
                this.logger.errorr(error);
            }
        }

        objectql.deletePackageClientScripts(this.name);
        core.loadClientScripts();
        this.broker.call(`@steedos/service-packages.offline`, {serviceInfo: {name: this.name, nodeID: this.broker.nodeID, instanceID: this.broker.instanceID}})
        await this.broker.call(`metadata.refreshServiceMetadatas`, { offlinePackageServices: [{
            name: this.name,
            nodeID: this.broker.nodeID,
            instanceID: this.broker.instanceID
        }] }); //${this.broker.nodeID}.${this.name}
        
        this.broker.broadcastLocal("@steedos/service-packages.offline", {serviceInfo: {name: this.name, nodeID: this.broker.nodeID, instanceID: this.broker.instanceID}})

        console.log(`service ${this.name} stopped`);
    }
};
