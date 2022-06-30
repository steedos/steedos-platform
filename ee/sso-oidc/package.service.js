/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-24 17:03:59
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-06-30 13:54:43
 * @Description: 
 */
"use strict";
const project = require('./package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-package-loader');
const objectql = require('@steedos/objectql');
const authController = require("./main/default/routes/auth");
const core = require("./main/default/routes/core");

const { passport } = core.auth;
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
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
        SSO_OIDC_CONFIG_URL: process.env.SSO_OIDC_CONFIG_URL,
        SSO_OIDC_CLIENT_ID: process.env.SSO_OIDC_CLIENT_ID,
        SSO_OIDC_CLIENT_SECRET: process.env.SSO_OIDC_CLIENT_SECRET,
        SSO_OIDC_NAME: process.env.SSO_OIDC_NAME || 'Steedos',
        SSO_OIDC_LOGO: process.env.SSO_OIDC_LOGO || '/images/logo.png'
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

    },

    /**
     * Service created lifecycle event handler
     */
    async created() {
        try {
            // 检查环境变量
            const settings = this.settings;

            if (!settings.SSO_OIDC_CONFIG_URL) {
                throw new Error("请配置 SSO_OIDC_CONFIG_URL 环境变量");
            }

            if(!settings.SSO_OIDC_CLIENT_ID) {
                throw new Error("请配置 SSO_OIDC_CLIENT_ID 环境变量");
            }

            if(!settings.SSO_OIDC_CLIENT_SECRET){
                throw new Error("请配置 SSO_OIDC_CLIENT_SECRET 环境变量");
            }

            const strategy = await authController.oidcStrategyFactory();
            passport.use("oidc", strategy);
            objectql.getSteedosConfig().setTenant({
                sso_providers: {
                    oidc: {
                        name: settings.SSO_OIDC_NAME,
                        title: settings.SSO_OIDC_NAME,
                        logo: settings.SSO_OIDC_LOGO,
                        url: '/api/global/auth/oidc/config'
                    }
                }
            });
        } catch (error) {
            this.broker.logger.error(`[${this.name}] 启动失败: ${error.message}`);
            await this.broker.destroyService(this);
        }
    },

    /**
     * Service started lifecycle event handler
     */
    async started() {
        
    },

    /**
     * Service stopped lifecycle event handler
     */
    async stopped() {
        objectql.getSteedosConfig().setTenant({sso_providers: { oidc : false }})
    }
};
