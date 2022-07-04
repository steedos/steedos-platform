/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-24 17:03:59
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-04 11:44:19
 * @Description: 
 */
"use strict";
const project = require('./package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-package-loader');
const objectql = require('@steedos/objectql');
const authController = require("./main/default/routes/auth");
const core = require("./main/default/routes/core");
const license = require('@steedos/license');
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
        SSO_OIDC_CONFIG_URL: process.env.SSO_OIDC_CONFIG_URL,
        SSO_OIDC_CLIENT_ID: process.env.SSO_OIDC_CLIENT_ID,
        SSO_OIDC_CLIENT_SECRET: process.env.SSO_OIDC_CLIENT_SECRET,
        SSO_OIDC_NAME: process.env.SSO_OIDC_NAME || 'Steedos',
        SSO_OIDC_LABEL: process.env.SSO_OIDC_LABEL || 'Steedos ID',
        SSO_OIDC_LOGO: process.env.SSO_OIDC_LOGO || '/images/logo.png'
    },

    /**
     * Dependencies
     */
    dependencies: ['~packages-@steedos/ee_service-plugin-license'],

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

            if (!settings.SSO_OIDC_CONFIG_URL) {
                throw new Error("请配置 SSO_OIDC_CONFIG_URL 环境变量");
            }

            if(!settings.SSO_OIDC_CLIENT_ID) {
                throw new Error("请配置 SSO_OIDC_CLIENT_ID 环境变量");
            }

            if(!settings.SSO_OIDC_CLIENT_SECRET){
                throw new Error("请配置 SSO_OIDC_CLIENT_SECRET 环境变量");
            }

            authController.oidcStrategyFactory().then((strategy)=>{
                passport.use("oidc", strategy);
                objectql.getSteedosConfig().setTenant({
                    disabled_account_register: true,
                    sso_providers: {
                        oidc: {
                            name: settings.SSO_OIDC_NAME,
                            label: settings.SSO_OIDC_LABEL,
                            logo: settings.SSO_OIDC_LOGO,
                            url: '/api/global/auth/oidc/config'
                        }
                    }
                });
            }).catch(err=>{
                this.setError(err);
            })
            
        } catch (error) {
            this.setError(error);
        }
    },

    /**
     * Service started lifecycle event handler
     */
    async started() {
        try {
            if(this.__stop) {
                throw new Error(this.__stop_message);
            }
            const allow = await license.isPlatformEnterPrise(objectql.getSteedosConfig().tenant._id)
            if(!allow){
                throw new Error('请购买企业版许可证，以使用「oidc sso」功能。')
            }
        } catch (error) {
            return await this.errorHandler(error);
        }
    },

    /**
     * Service stopped lifecycle event handler
     */
    async stopped() {
        objectql.getSteedosConfig().setTenant({sso_providers: { oidc : false }})
    }
};
