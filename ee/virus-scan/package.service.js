/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-05-03 10:29:51
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-05-13 14:35:47
 * @Description: 
 */
"use strict";
const project = require('./package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-package-loader');

const { execSync } = require('child_process');

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
            name: packageName
        },
    },

    /**
     * Dependencies
     */
    dependencies: ['~packages-standard-objects'],

    /**
     * Actions
     */
    actions: {
        execScanCommand: {
            params: {
                filePath: {
                    type: 'string'
                }
            },
            handler: function (ctx) {
                const { filePath } = ctx.params;
                const VIRUS_SCAN_SCAN_COMMAND = process.env.VIRUS_SCAN_SCAN_COMMAND;
                execSync(`${VIRUS_SCAN_SCAN_COMMAND} ${filePath}`);
            }
        }
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

    },

    /**
     * Service stopped lifecycle event handler
     */
    async stopped() {

    }
};
