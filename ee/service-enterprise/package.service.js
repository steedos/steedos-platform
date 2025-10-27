/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-05-17 15:06:55
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2024-01-27 09:22:24
 * @Description: 
 */
"use strict";
const project = require('./package.json');
const serviceName = project.name;
const validator = require('validator');
const _ = require('lodash');

const DEFAULT_PLUGINS = [
    "@steedos/ee_branding",
    "@steedos-labs/analytics",
    "@steedos-labs/plugin-workflow",
    "@steedos-labs/plugin-print-template"
]
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * 软件包服务启动后也需要抛出事件。
 */
module.exports = {
    name: serviceName,
    namespace: "steedos",
    /**
     * Settings
     */
    settings: {
        packageInfo: {
            path: __dirname,
            name: serviceName
        },
        plugins: process.env.STEEDOS_PLUGIN_SERVICES ? process.env.STEEDOS_PLUGIN_SERVICES.split(',') : DEFAULT_PLUGINS,
    },

    /**
     * Dependencies
     */
    dependencies: ['steedos-server'],
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

    },

    /**
     * Service created lifecycle event handler
     */
    async created() {
        global.broker = this.broker;
    },

    /**
     * Service started lifecycle event handler
     */
    async started(ctx) {


        await this.broker.waitForServices('@steedos/service-license')
        const platform = await this.broker.call('@steedos/service-license.getPlatform');
        if (!platform) {
            console.error('No valid license found, please confirm the STEEDOS_LICENSE environment variable.')
            process.exit();
        }


        const steedosPlugins = this.settings.plugins;
        for (const plugin of steedosPlugins) {
            try {
                console.log(`Starting plugin service: ${plugin}`);
                await this.broker.createService(require(plugin));
            } catch (error) {
                console.error(`Failed to start plugin service: ${plugin}`, error);
            }
        }
    },

    /**
     * Service stopped lifecycle event handler
     */
    async stopped() {

    }
};