/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-11 18:09:20
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-05 16:13:29
 * @Description: 
 */
"use strict";
const objectql = require('@steedos/objectql');
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * 软件包服务启动后也需要抛出事件。
 */
module.exports = {
	name: "objectServiceFactory",
	namespace: "steedos",
	/**
	 * Settings
	 */
	settings: {
	},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {
        createObjectService: {
            async handler(ctx) {
                const { serviceName, objectConfig } = ctx.params;
                let service = ctx.broker.createService({
                    name: serviceName,
                    mixins: [objectql.objectBaseService],
                    methods:{
                        getObjectConfig: ()=>{
                            return objectConfig
                        },
                    }
                })
                if (!ctx.broker.started) { //如果broker未启动则手动启动service
                    await ctx.broker._restartService(service)
                }
                console.log(`createService======`, serviceName)
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

	/**
	 * Service created lifecycle event handler
	 */
	async created() {
       const schema = objectql.getSteedosSchema(this.broker);
       const dataSources = schema.getDataSources();
       for (const key in dataSources) {
        if (Object.hasOwnProperty.call(dataSources, key)) {
            const dataSource = dataSources[key];
            dataSource.init()
            console.log(`init dataSources`, key)
        }
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

	}
};
