/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-02 13:17:06
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-01-15 17:03:15
 * @Description: 
 */
"use strict";
const project = require('./package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-meteor-package-loader');
const objectMixin = require('@steedos/service-object-mixin')
const _ = require('lodash')

const triggers = require('./src/triggers')

const methods = [];
const actions = [];

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
module.exports = {
    name: packageName,
    namespace: "steedos",
    mixins: [packageLoader, objectMixin],
    /**
     * Settings
     */
    settings: {
        packageInfo: {
            path: __dirname,
            name: packageName,
            isPackage: false
        },
        STEEDOS_IDENTITY_OIDC_ENABLED: process.env.STEEDOS_IDENTITY_OIDC_ENABLED,
        STEEDOS_IDENTITY_OIDC_CONFIG_URL: process.env.STEEDOS_IDENTITY_OIDC_CONFIG_URL,
        STEEDOS_IDENTITY_OIDC_CLIENT_ID: process.env.STEEDOS_IDENTITY_OIDC_CLIENT_ID,
        MAIL_URL: process.env.MAIL_URL,
        ROOT_URL: process.env.ROOT_URL
    },

    /**
     * Dependencies
     */
    dependencies: ['~packages-standard-objects'],

    /**
     * Actions
     */
    actions: {
        ...triggers,
        ...actions
    },

    /**
     * Events
     */
    events: {
       
    },

    /**
     * Methods
     */
    methods: methods,

    /**
     * Service created lifecycle event handler
     */
    created() {
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

    }
};
