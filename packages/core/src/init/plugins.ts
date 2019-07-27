const _ = require("underscore");
const express = require('express');
const app = express();
export class Plugins {
    static init() {
        const pluginContext = {
            app,
            settings: Meteor.settings
        };
        const plugins = Meteor.settings.plugins
        if (_.isArray(plugins)) {
            _.each(plugins, (pluginName) => {
                try {
                    const plugin = require(pluginName);
                    plugin.init(pluginContext);
                } catch (error) {
                    if(error.message.startsWith("Cannot find module")){
                        throw new Error(`Plugin in not found in project, please execute: yarn add ${pluginName}`)
                    }else{
                        throw new Error(error);
                    }
                }
            })
            WebApp.connectHandlers.use(pluginContext.app);
        }
    }
}