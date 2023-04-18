"use strict";

const objectql = require('@steedos/objectql');
const Future = require('fibers/future');
const core = require('@steedos/core');
const triggerLoader = require('./lib').triggerLoader;
const processLoader = require('./lib').processLoader;
const processTriggerLoader = require('./lib').processTriggerLoader;
const path = require('path');
const _ = require('lodash');
const express = require('express');
const fs = require("fs");
const metaDataCore = require('@steedos/metadata-core');
const loadFlowFile = new metaDataCore.LoadFlowFile();

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

        sendPackageFlowToDb: async function(packagePath, name) {
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
            await Future.task(() => {
                try {
                    try {
                        if(!db){
                            return
                        }
                        if(!steedosImport){
                            return
                        }
                    } catch (error) {
                        return ;
                    }
                    
                    if(db && db.flows && steedosImport){
                        const steedosConfig = objectql.getSteedosConfig();
                        let space;
                        if(steedosConfig && steedosConfig.tenant && steedosConfig.tenant._id){
                            space = db.spaces.findOne(steedosConfig.tenant._id)
                        }
                        if(!space){
                            space = db.spaces.findOne()
                        }
                        if(!space){
                            this.logger.debug(`import flow ${flow.name} fail. not find space in db`);
                            return ;
                        }
                        if(!flow.api_name){
                            this.logger.warn(`not find api_name in file`);
                            return ;
                        }
                        const dbFlow = db.flows.findOne({api_name: flow.api_name});
                        if(!dbFlow){
                            if(flow && flow.current){
                                if(!_.has(flow.current,'fields')){
                                    flow.current.fields = [];
                                }
                            }
                            this.logger.info(`insert flow ${flow.api_name} from ${name}`);

                            let company_id = null;
                            if(flow.company_id){
                                let count = Creator.getCollection("company").find({ _id: flow.company_id, space: space._id }).count();
                                if(count > 0){
                                    company_id = flow.company_id
                                }
                            }

                            return steedosImport.workflow(space.owner, space._id, flow, flow.state == 'enabled' ? true : false, company_id);
                        }
                        this.logger.debug(`not import flow. find flow `, dbFlow._id)
                    }

                } catch (error) {
                    this.logger.error(error)
                }
            }).promise();
            
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
                processLoader.sendPackageProcessToDb(_path);
            }
        },
        loadPackageMetadataFiles: async function (packagePath, name, datasourceName) {
            this.broker.logger.debug(`Loading package from ${packagePath}`)
            if (!datasourceName) {
                datasourceName = 'default';
            }
            objectql.getSteedosSchema(this.broker);
            packagePath = path.join(packagePath, '**');
            const datasource = objectql.getDataSource(datasourceName);
            if(datasource){
                await datasource.init();
            }
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
                // if(element.router.default === require('@steedos/router').staticRouter()){
                //     objectql.broker.broker.logger.warn(`router error, packagePath: ${packagePath} `);
                // }
                _routers.push(element)
            });
            core.loadRouters(_routers);
            await this.broker.call(`@steedos/service-packages.setPackageRoutersInfo`, {packageName: name, data: routersInfo});
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
                    const router = require('@steedos/router').staticRouter();
                    let routerPath = "";
                    if (__meteor_runtime_config__.ROOT_URL_PATH_PREFIX) {
                        routerPath = __meteor_runtime_config__.ROOT_URL_PATH_PREFIX;
                    }
                    const cacheTime = 86400000 * 1; // one day
                    router.use(routerPath, express.static(publicPath, { maxAge: cacheTime }));
                    // WebApp.connectHandlers.use(router);
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
        },
        async onStarted(){
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
        if(!schema.metadata?.$package){
            schema.name = `~packages-${schema.name}`;
        }

        schema.settings.packageInfo = {
            ...schema.settings.packageInfo,
            ...schema.metadata?.$package
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

        let oldRoutersInfo = await this.broker.call(`@steedos/service-packages.getPackageRoutersInfo`, {packageName: this.name})
        if(oldRoutersInfo){
            _.each(oldRoutersInfo.metadata, (info)=>{
                core.removeRouter(info.path, info.methods)
            })
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
