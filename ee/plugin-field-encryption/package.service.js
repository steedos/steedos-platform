/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-05-03 10:29:51
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-08-02 09:21:47
 * @Description: 
 */
"use strict";
const project = require('./package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-package-loader');
const { initKey } = require('./main/default/helpers/initKey');
const chalk = require('chalk');
const { NEED_CONFIG_MASTER_KEY } = require('./main/default/helpers/consts')
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
            name: packageName,
			isPackage: false
        },
    },

    /**
     * Dependencies
     */
    dependencies: ['~packages-standard-objects', '~packages-@steedos/standard-object-database'],

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
        // 检查依赖的环境变量是否配置
        if (!process.env.STEEDOS_CSFLE_MASTER_KEY) {
            console.log(chalk.yellow(NEED_CONFIG_MASTER_KEY));
            return;
        }

        // 初始化密钥
        await initKey();
    },

    /**
     * Service stopped lifecycle event handler
     */
    async stopped() {

    }
};
