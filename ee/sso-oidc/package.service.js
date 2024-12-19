/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-24 17:03:59
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-17 14:32:43
 * @Description: 
 */
"use strict";
const project = require('./package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-package-loader');
const objectql = require('@steedos/objectql');
const authController = require("./main/default/routes/auth");
const core = require("./main/default/routes/core");
const _ = require('lodash');

const { passport } = core.auth;
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
module.exports = {
    name: packageName,
    namespace: "steedos",
    mixins: [packageLoader],
    __stop: false,  // 在created中销毁服务后,服务还是会被启动. 借助此参数控制服务的启动和销毁
    __stop_message: '',
    /**
     * Settings
     */
    settings: {
        packageInfo: {
            path: __dirname,
            name: packageName,
            isPackage: false
        },
        STEEDOS_IDENTITY_OIDC_CONFIG_URL: process.env.STEEDOS_IDENTITY_OIDC_CONFIG_URL,
        STEEDOS_IDENTITY_OIDC_CLIENT_ID: process.env.STEEDOS_IDENTITY_OIDC_CLIENT_ID,
        STEEDOS_IDENTITY_OIDC_CLIENT_SECRET: process.env.STEEDOS_IDENTITY_OIDC_CLIENT_SECRET,
        STEEDOS_IDENTITY_OIDC_NAME: process.env.STEEDOS_IDENTITY_OIDC_NAME || 'Steedos',
        STEEDOS_IDENTITY_OIDC_LABEL: process.env.STEEDOS_IDENTITY_OIDC_LABEL || 'Steedos ID',
        STEEDOS_IDENTITY_OIDC_LOGO: process.env.STEEDOS_IDENTITY_OIDC_LOGO || '/images/logo.png',
        STEEDOS_IDENTITY_OIDC_URL: process.env.STEEDOS_IDENTITY_OIDC_URL || '/api/global/auth/oidc/config'
    },

    /**
     * Dependencies
     */
    dependencies: [],

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
        setError(error){
            this.__stop = true;
            this.__stop_message = error.message;
        },
        async errorHandler(error) {
            this.broker.logger.error(`[${this.name}] 启动失败: ${error.message}`);
            return await this.broker.destroyService(this);
        },
    },

    merged(schema) {

    },


    /**
     * Service created lifecycle event handler
     */
    created() {
        try {
            // 检查环境变量
            const settings = this.settings;

            if (settings.STEEDOS_IDENTITY_OIDC_CONFIG_URL && settings.STEEDOS_IDENTITY_OIDC_CLIENT_ID) {

                authController.oidcStrategyFactory().then((strategy)=>{
                    passport.use("oidc", strategy);
                    objectql.getSteedosConfig().setTenant({
                        disabled_account_register: true,
                        sso_providers: {
                            oidc: {
                                name: settings.STEEDOS_IDENTITY_OIDC_NAME,
                                label: settings.STEEDOS_IDENTITY_OIDC_LABEL,
                                logo: settings.STEEDOS_IDENTITY_OIDC_LOGO,
                                url: settings.STEEDOS_IDENTITY_OIDC_URL
                            }
                        }
                    });
                }).catch(err=>{
                    this.setError(err);
                })
            }

            
        } catch (error) {
            this.setError(error);
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
