const path = require('path');
const fs = require('fs');
const _ = require("underscore");
const express = require('express');
const app = express();
const objectql = require('@steedos/objectql')
const util = require('../util/index')
const ConfigName = 'plugin.config.yml'
import * as initConfig from './init-config.json'
export class Plugins {
    static init() {
        const pluginContext = {
            app,
            settings: Meteor.settings
        };
        const builtInPlugins= initConfig.built_in_plugins || [];
        const settingsPlugins = Meteor.settings.plugins || [];
        let plugins = _.union(builtInPlugins, settingsPlugins)
        if (_.isArray(plugins)) {
            _.each(plugins, (pluginName) => {
                try {
                    const pluginDir = this.getPluginDir(pluginName)
                    const plugin = require(pluginDir);
                    this.loadFiles(pluginName);
                    if(_.isFunction(plugin.init)){
                        plugin.init(pluginContext);
                    }
                    
                } catch (error) {
                    if(error.message.startsWith("Cannot find module")){
                        throw new Error(`Plugin not found in project, please execute: yarn add ${pluginName}`)
                    }else{
                        throw new Error(error);
                    }
                }
            })
            WebApp.connectHandlers.use(pluginContext.app);
        }
    }

    static getPluginDir(pluginName) {
        return path.dirname(require.resolve(`${pluginName}/package.json`, { 
            paths: [path.join(require('app-root-path').path, '.plugins'), path.join(process.cwd(), '.plugins')] 
        }));
    }

    static getConfig(pluginDir: string){
        let config: any;
        let configPath = path.join(pluginDir, ConfigName)
        if (fs.existsSync(configPath) && !fs.statSync(configPath).isDirectory()) {
            config = util.loadYmlFile(configPath)
        }else{
            console.warn(`WARNING: not found ${ConfigName}`, configPath);
        }
        return config;
    }

    static loadFiles(pluginName){
        let pluginDir = this.getPluginDir(pluginName);
        let config = this.getConfig(pluginDir);
        if(config){
            _.each(config.datasources, (_datasource, name)=>{
                if(!_.isArray(_datasource.objectFiles)){
                    throw new Error(`${name}.objectFiles must be an array` + _datasource.objectFiles)
                }
                _.each(_datasource.objectFiles, (objectFile)=>{
                    let filePath = path.join(pluginDir, objectFile)
                    objectql.addObjectConfigFiles(filePath, name)
                    objectql.addAppConfigFiles(filePath, name)
                })
            })
        }
    }
}