"use strict";

const objectql = require('@steedos/objectql');
const core = require('@steedos/core');
const triggerLoader = require('./lib').triggerLoader;
const sendPackageFlowToDb = require('./lib/loadPackageFlow').sendPackageFlowToDb;
const path = require('path');
const Future = require('fibers/future');
const _ = require('lodash');
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
        name: '' // service name
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
        "translations.change": {
            handler() {
                core.loadTranslations()
            }
        },
        "translations.object.change": {
            handler() {
                core.loadObjectTranslations()
            }
        },
        "steedos-server.started": {
            handler() {
                let packageInfo = this.settings.packageInfo;
                if (!packageInfo) {
                    return;
                }
                const { path : _path } = packageInfo;
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
                await objectql.loadStandardMetadata(name, datasourceName);
                await objectql.addAllConfigFiles(packagePath, datasourceName, name);
                const datasource = objectql.getDataSource(datasourceName);
                await datasource.init();
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
        }
    },

    /**
     * Service created lifecycle event handler
     */
    created() {
        this.logger.debug('service package loader created!!!');
    },

    merged(schema) {
        schema.name = `~packages-${schema.name}`;
    },

    /**
     * Service started lifecycle event handler
     */
    async started() {
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
        console.log(`service ${this.name} started`);
    },

    /**
     * Service stopped lifecycle event handler
     */
    async stopped() {
        this.broker.call(`@steedos/service-packages.offline`, {serviceInfo: {name: this.name, nodeID: this.broker.nodeID, instanceID: this.broker.instanceID}})
        await this.broker.call(`metadata.refreshServiceMetadatas`, { offlinePackageServices: [`${this.broker.nodeID}.${this.name}`] });
        console.log(`service ${this.name} stopped`);
    }
};
