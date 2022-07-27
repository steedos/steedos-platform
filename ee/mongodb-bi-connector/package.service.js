"use strict";
const biSchema = require("./lib/biSchema");

const project = require('./package.json');
const packageName = project.name;
const { parse } = require('mongodb-uri')
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * 软件包服务启动后也需要抛出事件。
 */
module.exports = {
    name: packageName,
    namespace: "steedos",
    mixins: [],
    /**
     * Settings
     */
    settings: {
        packageInfo:{},
        schemaUpdateInterval: 10 // 刷新的间隔时间(秒)
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
        "metadata.objects.inserted": {
            async handler(ctx) {
				await schemaUpdateHandler(ctx);
            }
        },
		"metadata.objects.updated": {
            async handler(ctx) {
				await schemaUpdateHandler(ctx);
            }
        },
		"metadata.objects.deleted": {
            async handler(ctx) {
				await schemaUpdateHandler(ctx);
            }
        }
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

var pendingRefresh = false;

async function schemaUpdateHandler(ctx) {
    if (pendingRefresh) {
        return;
    }
    else {
        pendingRefresh = true;
    }
    setTimeout(() => {
        pendingRefresh = false;
    }, 1000 * module.exports.settings.schemaUpdateTimeout);
    const objectConfigs = await ctx.broker.call("objects.getAll");
    // 从MONGO_URL中解析出数据库名
    const defaultuUriObj = parse(process.env.MONGO_URL);
    const steedosObjectDatasource = defaultuUriObj.database;
    var steedosBiSchema = new biSchema.SteedosBiSchema();
    steedosBiSchema.append(objectConfigs, steedosObjectDatasource);
    let biSchemaJson = steedosBiSchema.toJson();
    await biSchema.setDefaultBiSchema(biSchemaJson, process.env.MONGO_URL);
    // console.log('schema updated');
}