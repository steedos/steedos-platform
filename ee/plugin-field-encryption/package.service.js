/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-05-03 10:29:51
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-05-05 13:58:42
 * @Description: 
 */
"use strict";
const project = require('./package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-package-loader');
const { initKey } = require('./main/default/helpers/initKey');
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * 软件包服务启动后也需要抛出事件。
 */
module.exports = {
    name: packageName,
    namespace: "steedos",
    mixins: [packageLoader],
    /**
     * Settings
     */
    settings: {
        packageInfo: {
            path: __dirname,
            name: packageName
        }
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

    merged(schema) {
        // 检查依赖的环境变量是否配置，如未配置则不应加载此软件包
        if (!process.env.STEEDOS_CSFLE_MASTER_KEY
        ) {
            throw new Error(`字段级加密软件包未启用，因为环境变量STEEDOS_CSFLE_MASTER_KEY未配置。`);
        }
    },

    /**
     * Service created lifecycle event handler
     */
    async created() {

    },

    /**
     * Service started lifecycle event handler
     */
    async started() {
        // 初始化密钥
        await initKey();
    },

    /**
     * Service stopped lifecycle event handler
     */
    async stopped() {

    }
};
