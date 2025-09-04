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


        this.broker.createService(require("@steedos/ee_branding"));

    },

    /**
     * Service stopped lifecycle event handler
     */
    async stopped() {

    }
};