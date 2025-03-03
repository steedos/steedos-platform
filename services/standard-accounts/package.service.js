/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-02 13:17:06
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-12-29 11:28:53
 * @Description: 
 */
"use strict";
const project = require('./package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-package-loader');

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
        }
    },

    /**
     * Dependencies
     */
    dependencies: ['~packages-standard-objects'],

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
