"use strict";

const triggerLoader = require('./lib').triggerLoader;
const processLoader = require('./lib').processLoader;
const processTriggerLoader = require('./lib').processTriggerLoader;
const triggerYmlLoader = require('./lib').triggerYmlLoader;
const functionYmlLoader = require('./lib').functionYmlLoader;
const importLoader = require('./lib').importLoader;
const printLoader = require('./lib').printLoader;
const path = require('path');
const _ = require('lodash');
const fs = require("fs");
const metaDataCore = require('@steedos/metadata-core');
const { registerMetadataConfigs, loadStandardMetadata, loadRouters } = require('@steedos/metadata-registrar');
const moment = require('moment');
const objectMixin = require('@steedos/service-object-mixin')
const {
    compressFiles, deleteFolderRecursive, mkTempFolder
} = require('@steedos/metadata-core');
const sRouter = require('@steedos/router');

const loadFlowFile = new metaDataCore.LoadFlowFile();

const getPackageYmlData = (packagePath)=>{
    let packageYmlData = {};
    if(fs.existsSync(path.join(packagePath, 'package.service.yml'))){
        packageYmlData = metaDataCore.loadFile(path.join(packagePath, 'package.service.yml')) || {};
    }
    if(fs.existsSync(path.join(packagePath, 'README.md'))){
        packageYmlData.readme = metaDataCore.loadFile(path.join(packagePath, 'README.md'));
    }else if(fs.existsSync(path.join(packagePath, 'readme.md'))){
        packageYmlData.readme = metaDataCore.loadFile(path.join(packagePath, 'readme.md'));
    }
    return packageYmlData;
}

const methods = require('./lib/methods')

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
    name: "service-package-loader",

	mixins: [objectMixin],
    
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
    dependencies: ['metadata-server', '@steedos/service-project', '@steedos/service-packages', 'objectql'], //, '@steedos/data-import'

    /**
     * Actions
     */
    actions: {

    },

    /**
     * Events
     */
    events: {
        "space.initialized": {
            async handler(ctx) {
                const spaceDoc = ctx.params
                const spaceId = spaceDoc._id
                // 扫描main/default/data文件夹
                await this.importData(path.join(this.settings.packageInfo.path, 'main', 'default', 'data'), false, spaceId);
                let packageInfo = this.settings.packageInfo;
                if (!packageInfo) {
                    return;
                }
                const { path: packagePath, isUnmanaged } = packageInfo;
                if (isUnmanaged && packagePath) {
                    const userSession = { spaceId: spaceId, userId: spaceDoc.owner };
                    await this.deployPackage(packagePath, userSession);
                }
            }
        }
    },

    /**
     * Methods
     */
    methods: {
        ...methods,
        checkPackageMetadataFiles: async function (packagePath) {
            // let publicPath = path.join(packagePath, 'public');
            // if (this.settings.packageInfo.loadPublicFolder && fs.existsSync(publicPath)) {
            //     this.broker.logger.warn(`The public folder has been deprecated. ${publicPath}`); 
            // }

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
            // const filePatten3 = [
            //     path.join(packagePath, "**", "*.router.js"),
            //     "!" + path.join(packagePath, "node_modules"),
            // ]
            // const matchedPaths3 = metaDataCore.syncMatchFiles(filePatten3);
            // for await (const filePath of matchedPaths3) {
            //     this.broker.logger.warn(`The router.js file has been deprecated. ${filePath}`); 
            // }
        },
        loadPackageMetadataFiles: async function (packagePath, name, datasourceName) {
            // console.info(`Loading package from ${packagePath}`)
            packagePath = path.join(packagePath, '**');
            if (!datasourceName) {
                datasourceName = 'default';
            }

            if(this.objectql){
                await this.initDataSource(packagePath, datasourceName);
                await loadStandardMetadata(name, datasourceName);
            }
            await registerMetadataConfigs(packagePath, datasourceName, name);
            await triggerLoader.load(this.broker, packagePath, name);
            await processTriggerLoader.load(this.broker, packagePath, name);
            await triggerYmlLoader.load(this.broker, packagePath, name);
            await functionYmlLoader.load(this.broker, packagePath, name);
            await importLoader.load(this.broker, packagePath, name);
            await printLoader.load(this.broker, packagePath, name);
            const routersInfo = await this.loadPackageRouters(packagePath, name);
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
                if (!this.settings.packageInfo.loadPublicFolder) {
                    return;
                }
                let publicPath = path.join(packagePath, 'public');
                try {
                    if (!fs.existsSync(publicPath) || this.settings.loadedPackagePublicFiles) {
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
                        const cacheTime = 86400000 * 1; // one day
                        router.use(routerPath, express.static(publicPath, { maxAge: cacheTime }));
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
            await await this.broker.call(`@steedos/service-project.disablePackage`, {
                module: this.schema.packageName
            })
            return await this.broker.destroyService(this);
        },
        async onStarted(){
            const primarySpaceId = await this.broker.call("objectql.getPrimarySpaceId");
            if (primarySpaceId) {
                await this.importData(path.join(this.settings.packageInfo.path, 'main', 'default', 'data'), true, primarySpaceId);
            }

            this.checkPackageMetadataFiles(this.settings.packageInfo.path)

            if(this.beforeStart){
                try {
                    await this.beforeStart()
                } catch (error) {
                    return await this.errorHandler(error);
                }
            }
    
            const startTime = moment();
            let packageInfo = this.settings.packageInfo;
            if (!packageInfo) {
                return;
            }
            const { path : _path, datasource, isPackage, isUnmanaged } = packageInfo;
            if (!_path) {
                this.logger.error(`Please config packageInfo in your settings.`);
                console.log(`service ${this.name} started`);
                return;
            }
            if (true != isUnmanaged) {
                // 受管软件包加载元数据文件，非受管软件包不加载
                await this.loadPackageMetadataFiles(_path, this.name, datasource);
            }
            if(isPackage !== false){
                try {
                    let _packageInfo = {};
                    if(fs.existsSync(path.join(_path, 'package.json'))){
                        _packageInfo = metaDataCore.loadJSONFile(path.join(_path, 'package.json'));
                    }else if(fs.existsSync(path.join(_path, '..','package.json'))){
                        _packageInfo = metaDataCore.loadJSONFile(path.join(_path, '..', 'package.json'));
                    }
                    const packageYmlData = getPackageYmlData(_path);
                    await this.broker.call(`@steedos/service-packages.online`, {serviceInfo: {packageYmlData: packageYmlData, name: this.name, nodeID: this.broker.nodeID, instanceID: this.broker.instanceID, path: _path, version: _packageInfo.version, description: _packageInfo.description}})
                } catch (error) {
                    console.log(`error`, error)
                }    
            }
    
            await this.loadPackageMetadataServices(_path);
    
            await this.loadPackagePublicFiles(_path);
            this.started = true;
            const endTime = moment();
            const serviceName = this.name.length < 50 ? `${_.padEnd(this.name, 50, ' ')}` : this.name
            logger.log(`service ${serviceName} started: ${endTime.diff(startTime, 'seconds', true)}s`);
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
                        sRouter.removeRouter(info.path, info.methods)
                    }
                })
            }
            const _routers = [];
            routersData.forEach(element => {
                _routers.push(element)
            });
            sRouter.loadRouters(_routers);
            return routersInfo
        },
        async initDataSource(packagePath, datasourceName){
            this.objectql.getSteedosSchema(this.broker);
            packagePath = path.join(packagePath, '**');
            const datasource = this.objectql.getDataSource(datasourceName);
            if(datasource){
                await datasource.init();
            }
        },
        async deployPackage(sourcePath, userSession){
            try {
                var tempDir = mkTempFolder('deploy-');
                var option = { includeJs: false, tableTitle: 'Steedos Deploy', showLog: true, inDeploy: true };
    
                compressFiles(sourcePath, sourcePath, tempDir, option, async (base64, zipDir) => {
                    const result = await this.broker.call('~packages-@steedos/metadata-api.deploy', {
                        fileBase64: base64,
                    }, {
                        timeout: 0,
                        meta: {
                            user: userSession
                        }
                    })
                    console.log(sourcePath, JSON.stringify(result))
                    deleteFolderRecursive(tempDir);
                });
    
            } catch (err) {
                console.log(err);
                throw err;
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
        
        try {
            this.objectql = require('@steedos/objectql');
        } catch (e) {
            this.logger.error(e)
        }
    },

    merged(schema) {
        schema.packageName = schema.name;
        if(!schema.metadata || !schema.metadata.$package){
            schema.name = `~packages-${schema.name}`;
        }

        schema.settings.packageInfo = {
            ...schema.settings.packageInfo,
            ...(schema.metadata && schema.metadata.$package ? schema.metadata.$package : {}),
        }

        const _path = schema.settings.packageInfo.path;
        let packageYmlData = getPackageYmlData(_path);

        schema.settings.packageInfo = {
            ...schema.settings.packageInfo,
            ...packageYmlData
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
                this.logger.error(error);
            }
        };

        let oldRoutersInfo = await this.broker.call(`@steedos/service-packages.getPackageRoutersInfo`, {packageName: this.name})
        if(oldRoutersInfo){
            _.each(oldRoutersInfo.metadata, (info)=>{
                sRouter.removeRouter(info.path, info.methods)
            })
        }
        await this.objectql.deletePackageClientScripts(this.name);
        // await this.core.loadClientScripts();
        this.broker.call(`@steedos/service-packages.offline`, {serviceInfo: {name: this.name, nodeID: this.broker.nodeID, instanceID: this.broker.instanceID}})
        await this.broker.call(`metadata.refreshServiceMetadatas`, { offlinePackageServices: [{
            name: this.name,
            nodeID: this.broker.nodeID,
            instanceID: this.broker.instanceID
        }] }); //${this.broker.nodeID}.${this.name}
        this.broker.broadcast('metadata.object_triggers.change', {})
        this.broker.broadcastLocal("@steedos/service-packages.offline", {serviceInfo: {name: this.name, nodeID: this.broker.nodeID, instanceID: this.broker.instanceID}})

        logger.log(`service ${this.name} stopped`);
    }
};
