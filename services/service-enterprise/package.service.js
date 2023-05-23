/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-12-13 10:15:20
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-17 15:29:10
 * @Description: 
 */
"use strict";
const project = require('./package.json');
const serviceName = project.name;
const validator = require('validator');
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
        oidc: {
            enable: validator.toBoolean(process.env.STEEDOS_IDENTITY_OIDC_ENABLED || 'false', true),
        }
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

    },

    /**
     * Service created lifecycle event handler
     */
    async created() {

    },

    /**
     * Service started lifecycle event handler
     */
    async started(ctx) {
        // 启动 社区版 服务
        this.broker.createService(require("@steedos/service-community"));

        // 启动 企业版许可证服务
        // this.broker.createService(require("@steedos/ee_service-plugin-license"));

        // 启动 报表服务
        // this.broker.createService(require("@steedos/ee_stimulsoft-reports"));

        // 启动 sidecar服务: steedos services 跨语言访问
        // broker.createService(require("@steedos/service-sidecar"));
        // 字段级加密服务
        // broker.createService(require("@steedos/ee_plugin-field-encryption"));
        // 附件病毒扫描
        // broker.createService(require("@steedos/ee_virus-scan"));
        // 记录审计日志
        // this.broker.createService(require("@steedos/ee_audit-records"));
        // 自定义品牌
        // this.broker.createService(require("@steedos/ee_branding"));
        // mongodb bi connector
        // this.broker.createService(require("@steedos/ee_mongodb-bi-connector"));
    },

    /**
     * Service stopped lifecycle event handler
     */
    async stopped() {

    }
};
