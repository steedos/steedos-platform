"use strict";

const triggerLoader = require('./lib').triggerLoader;
const processLoader = require('./lib').processLoader;
const processTriggerLoader = require('./lib').processTriggerLoader;
const triggerYmlLoader = require('./lib').triggerYmlLoader;
const path = require('path');
const _ = require('lodash');
const fs = require("fs");
const metaDataCore = require('@steedos/metadata-core');
const { registerMetadataConfigs, loadStandardMetadata, loadRouters, canLoadMetadata } = require('@steedos/metadata-registrar');
const loadFlowFile = new metaDataCore.LoadFlowFile();

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
    name: "service-package-loader",
    
    triggerLoader,

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
    dependencies: ['metadata-server', '~packages-project-server', '@steedos/service-packages'],

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
        checkPackageMetadataFiles: async function (packagePath) {

            if(this.core){
                return ;
            }

            let publicPath = path.join(packagePath, 'public');
            if (this.settings.packageInfo.loadPublicFolder && fs.existsSync(publicPath)) {
                this.broker.logger.warn(`The public folder has been deprecated. ${publicPath}`); 
            }

            // 扫描软件包中的元数据, 如果有 .client.js 文件, 则输出警告信息
            const filePatten = [
                path.join(packagePath, "**", "*.client.js"),
                "!" + path.join(packagePath, "node_modules"),
            ]
            const matchedPaths = metaDataCore.syncMatchFiles(filePatten);
            for await (const filePath of matchedPaths) {
                this.broker.logger.warn(`The client.js file has been deprecated. ${filePath}`); 
            }

            // 扫描软件包中的元数据, 如果有 .object.js 文件, 则输出警告信息
            const filePatten2 = [
                path.join(packagePath, "**", "*.object.js"),
                "!" + path.join(packagePath, "node_modules"),
            ]
            const matchedPaths2 = metaDataCore.syncMatchFiles(filePatten2);
            for await (const filePath of matchedPaths2) {
                this.broker.logger.warn(`The object.js file has been deprecated. ${filePath}`); 
            }

            // 扫描软件包中的元数据, 如果有 .router.js 文件, 则输出警告信息
            const filePatten3 = [
                path.join(packagePath, "**", "*.router.js"),
                "!" + path.join(packagePath, "node_modules"),
            ]
            const matchedPaths3 = metaDataCore.syncMatchFiles(filePatten3);
            for await (const filePath of matchedPaths3) {
                this.broker.logger.warn(`The router.js file has been deprecated. ${filePath}`); 
            }
        },
        sendPackageFlowToDb: async function(packagePath, name) {
            if(!canLoadMetadata('Flow')){
                return ;
            }
            const flows = loadFlowFile.load(path.join(packagePath, '**'));
            for (const apiName in flows) {
                const flow = flows[apiName];
                const flowFilePath = flow.__filename;
                delete flow.__filename;
                try {
                    await this.importFlow(flow, name);
                } catch (error) {
                    console.error(`importFlow error`, flowFilePath, error)
                }
            }
        },

        importFlow: async function(flow, name) {
            return await this.broker.call('steedos-server.importFlow', {flow, name});
        }, 
        loadDataOnServiceStarted: async function(){
            let packageInfo = this.settings.packageInfo;
            if (!packageInfo) {
                return;
            }
            const { path : _path } = packageInfo;
            this.loadPackagePublicFiles(_path);
            if(_path){
                this.sendPackageFlowToDb(_path)
                if(canLoadMetadata('Process')){
                    processLoader.sendPackageProcessToDb(_path);
                }
            }
        },
        loadPackageMetadataFiles: async function (packagePath, name, datasourceName) {
            this.broker.logger.debug(`Loading package from ${packagePath}`)
            packagePath = path.join(packagePath, '**');
            if (!datasourceName) {
                datasourceName = 'default';
            }
            if(this.objectql){
                await loadStandardMetadata(name, datasourceName);
                await this.initDataSource(packagePath, datasourceName);
            }
            await registerMetadataConfigs(packagePath, datasourceName, name);
            if(canLoadMetadata('Trigger')){
                await triggerLoader.load(this.broker, packagePath, name);
            }
            if(canLoadMetadata('ProcessTrigger')){
                await processTriggerLoader.load(this.broker, packagePath, name);
            }
            if(canLoadMetadata('TriggerYml')){
                await triggerYmlLoader.load(this.broker, packagePath, name);
            }
            if(this.core){
                if(canLoadMetadata('ClientJS')){
                    this.core.loadClientScripts();
                }
                if(canLoadMetadata('Router')){
                    const routersInfo = await this.loadPackageRouters(packagePath, name);
                    await this.broker.call(`@steedos/service-packages.setPackageRoutersInfo`, {packageName: name, data: routersInfo});
                }
            }
            await this.broker.emit(`translations.object.change`, {});
            return;
        },
        loadPackageMetadataServices: async function (packagePath) {
            const filePatten = [
                path.join(packagePath, 'main', 'default', 'services', "**", `*.service.js`),
                "!" + path.join(packagePath, "**", "node_modules"),
            ];
            const matchedPaths = metaDataCore.syncMatchFiles(filePatten);
            for await (const serviceFilePath of matchedPaths) {
                try {
                    metaDataCore.clearRequireCache(serviceFilePath);
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
                if(!canLoadMetadata('PublicFolder')){
                    return ;
                }
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
                try {
                    const express = require('express');
                    this.settings.loadedPackagePublicFiles = true;
                    try {
                        const router = require('@steedos/router').staticRouter();
                        let routerPath = "";
                        if (__meteor_runtime_config__.ROOT_URL_PATH_PREFIX) {
                            routerPath = __meteor_runtime_config__.ROOT_URL_PATH_PREFIX;
                        }
                        const cacheTime = 86400000 * 1; // one day
                        // console.log(`static router`, routerPath, publicPath)
                        router.use(routerPath, express.static(publicPath, { maxAge: cacheTime }));
                        // WebApp.connectHandlers.use(router);
                    } catch (error) {
                        console.error(error)
                        this.settings.loadedPackagePublicFiles = false;
                    }
                } catch (error) {
                        
                }
            }
        },
        async errorHandler(error) {
            this.broker.logger.error(`[${this.name}] 启动失败: ${error.message}`);
            await await this.broker.call(`~packages-project-server.disablePackage`, {
                module: this.schema.packageName
            })
            return await this.broker.destroyService(this);
        },
        async onStarted(){

            this.checkPackageMetadataFiles(this.settings.packageInfo.path)

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
                    const _packageInfo = metaDataCore.loadJSONFile(path.join(_path, 'package.json'));
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
        async loadPackageRouters(packagePath, name){
            let routersData = loadRouters(packagePath);
            let oldRoutersInfo = await this.broker.call(`@steedos/service-packages.getPackageRoutersInfo`, {packageName: name})
            let routersInfo = _.flattenDeep(_.map(routersData, 'infoList'));
            if(oldRoutersInfo){
                _.each(oldRoutersInfo.metadata, (info)=>{
                    const _info = _.find(routersInfo, (item)=>{
                        return item.path == info.path && JSON.stringify(item.methods) == JSON.stringify(info.methods) && item.md5 == info.md5
                    })
                    if(!_info){
                        this.core.removeRouter(info.path, info.methods)
                    }
                })
            }
            const _routers = [];
            routersData.forEach(element => {
                _routers.push(element)
            });
            this.core.loadRouters(_routers);
            return routersInfo
        },
        async initDataSource(packagePath, datasourceName){
            this.objectql.getSteedosSchema(this.broker);
            packagePath = path.join(packagePath, '**');
            const datasource = this.objectql.getDataSource(datasourceName);
            if(datasource){
                await datasource.init();
            }
        }
    },

    /**
     * Service created lifecycle event handler
     */
    created() {
        if(!global.broker){
            global.broker = this.broker;
        }
        this.packageServices = [];  //此属性不能放到settings下，否则会导致mo clone settings 时 内存溢出。
        this.logger.debug('service package loader created!!!');
        
        try {
            this.core = require('@steedos/core');
        } catch (e) {
            
        }

        try {
            this.objectql = require('@steedos/objectql');
        } catch (e) {
            
        }
    },

    merged(schema) {
        schema.packageName = schema.name;
        if(!schema.metadata || !schema.metadata.$package){
            schema.name = `~packages-${schema.name}`;
        }

        schema.settings.packageInfo = {
            ...schema.settings.packageInfo,
            ...(schema.metadata && schema.metadata.$package ? schema.metadata.$package : {})
        }
    },

    /**
     * Service started lifecycle event handler
     */
    async started() {
        await this.broker.call(`@steedos/service-packages.starting`, {serviceInfo: {name: this.name, nodeID: this.broker.nodeID, instanceID: this.broker.instanceID}})
        await this.onStarted();
        await this.broker.call(`@steedos/service-packages.started`, {serviceInfo: {name: this.name, nodeID: this.broker.nodeID, instanceID: this.broker.instanceID}})
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
        };

        if(this.core){
            let oldRoutersInfo = await this.broker.call(`@steedos/service-packages.getPackageRoutersInfo`, {packageName: this.name})
            if(oldRoutersInfo){
                _.each(oldRoutersInfo.metadata, (info)=>{
                    this.core.removeRouter(info.path, info.methods)
                })
            }
            await this.core.deletePackageClientScripts(this.name);
            await this.core.loadClientScripts();
        }
        this.broker.call(`@steedos/service-packages.offline`, {serviceInfo: {name: this.name, nodeID: this.broker.nodeID, instanceID: this.broker.instanceID}})
        await this.broker.call(`metadata.refreshServiceMetadatas`, { offlinePackageServices: [{
            name: this.name,
            nodeID: this.broker.nodeID,
            instanceID: this.broker.instanceID
        }] }); //${this.broker.nodeID}.${this.name}
        this.broker.broadcast('metadata.object_triggers.change', {})
        this.broker.broadcastLocal("@steedos/service-packages.offline", {serviceInfo: {name: this.name, nodeID: this.broker.nodeID, instanceID: this.broker.instanceID}})

        console.log(`service ${this.name} stopped`);
    }
};
