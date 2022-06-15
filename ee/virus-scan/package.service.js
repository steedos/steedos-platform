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

const ClamAV = require('./clamav')
const clamAVClient = new ClamAV(process.env.VIRUS_SCAN_HOST, process.env.VIRUS_SCAN_PORT || 3310)

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
                command: {
                    type: 'string'
                },
                filePath: {
                    type: 'string'
                }
            },
            handler: async function (ctx) {
                const { filePath } = ctx.params;
                const result = { success: true, message: '', stdout: '', stderr: '' };
                try {
                    const data = await clamAVClient.scanFile(filePath);
                    if (data.threat) {
                        result.success = false;
                        result.message = '文件内容存在安全隐患，终止上传，请确认。';
                        result.stdout = data.threat;
                    }
                } catch (error) {
                    console.error(error);
                    result.success = false;
                    result.message = error.message;
                }
                return result;

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
