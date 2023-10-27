/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:35:34
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-27 12:09:49
 * @Description: 
 */
"use strict";
const project = require('./package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-package-loader');
const path = require('path');
const objectql = require('@steedos/objectql');
const { importData } = require('./lib')
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
            path: path.join(__dirname, 'lib'),
            name: packageName,
            isPackage: false
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
        'hasImportTemplates': {
            async handler(ctx) {
                const { objectName } = ctx.params;
                const count = await objectql.getObject('queue_import').count({
                    filters: [
                        ['object_name', '=', objectName]
                    ]
                });
                return count > 0
            }
        },
        'getAllImportTemplates': {
            async handler(ctx) {
                const records = await objectql.getObject('queue_import').find();
                return records;
            }
        },
        /**
         * 参数示例：
        {
            data: {
                "csv": [{ objectName: 'warehouse', records: [ [Object] ]],
                "json": [{ objectName: 'house', records: [ [Object] ]],
                "flow": { flowApiName1: {}, flowApiName2: {} },
            },
            spaceId,
            onlyInsert: true,
        }
         */
        "importData": {
            params: {
                data: {
                    type: "object",
                    props: {
                        csv: {
                            type: "array",
                            items: {
                                type: "object",
                                props: {
                                    objectName: { type: "string" },
                                    records: { type: "array", items: "object" },
                                }
                            },
                            optional: true,
                        },
                        json: {
                            type: "array",
                            items: {
                                type: "object",
                                props: {
                                    objectName: { type: "string" },
                                    records: { type: "array", items: "object" },
                                }
                            },
                            optional: true,
                        },
                        flow: {
                            type: "object",
                            optional: true,
                        },
                    }
                },
                spaceId: { type: "string" },
                onlyInsert: { type: "boolean", optional: true, default: true },
            },
            async handler(ctx) {
                const { data, spaceId, onlyInsert } = ctx.params;
                await importData(data, onlyInsert, spaceId)
            }
        }
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
    async started() {

    },

    /**
     * Service stopped lifecycle event handler
     */
    async stopped() {

    }
};