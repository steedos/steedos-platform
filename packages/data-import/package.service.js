/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:35:34
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-10-31 10:13:21
 * @Description: 
 */
"use strict";
const project = require('./package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-package-loader');
const path = require('path');
const objectql = require('@steedos/objectql');
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
                const count = await objectql.getObject('queue_import').count({filters: [
                    ['object_name', '=', objectName]
                ]});
                return count > 0
            }
        },
        'getAllImportTemplates': {
            async handler(ctx) {
                const records = await objectql.getObject('queue_import').find();
                return records;
            }
        },
    },

    /**
     * Methods
     */
    methods: {
        init: function (context) {
        }
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