"use strict";
const project = require('./package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-package-loader');
const objectql = require("@steedos/objectql");
const _ = require('underscore');
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
			path: __dirname,
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
		queries: {
            rest: {
                method: "POST",
                path: "/queries/:recordId/results"
            },
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { recordId } = ctx.params;
                const record = await objectql.getObject("queries").findOne(recordId);
				if(record){
					if(!record.query){
						throw new Error(`Invalid query.`)
					}
					const datasource = objectql.getDataSource(record.datasource);
					if(!datasource){
						throw new Error(`not find Data Source.`)
					}
					if( 'mongo' === datasource.driver ){
						let query = null;
						try {
							query = JSON.parse(record.query);
						} catch (error) {
							throw new Error(`Invalid query.`)
						}
						if(!query.collection){
							throw new Error(`collection is required`)
						}
						if(query.aggregate){
							const driver = datasource.adapter;
							await driver.connect();
							return await driver.collection(query.collection).aggregate(query.aggregate).toArray();
						}else if(query.query){
							const driver = datasource.adapter;
							await driver.connect();
							const filter = query.query;
							const options = {
								projection: query.projection,
								sort: query.sort,
								limit: query.limit,
								skip: query.skip
							}
							if(query.count){
								return await driver.collection(query.collection).find(filter, options).count();
							}else{
								return await driver.collection(query.collection).find(filter, options).toArray();
							}
						}

					}else if(_.include(['sqlite','sqlserver','postgres','oracle','mysql'], datasource.driver)){
						throw new Error(`This data source [${datasource.driver}] is not supported.`)
					}else {
						throw new Error(`This data source [${datasource.driver}] is not supported.`)
					}
				}
                return this.getRecordPermissions(record, userSession);
            }
        },
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
	async started() {

	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
