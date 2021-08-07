"use strict";
const project = require('./package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-package-loader');
const objectql = require("@steedos/objectql");
const _ = require('lodash');
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
				let results = null;
                const record = await objectql.getObject("queries").findOne(recordId);
				if(record){
					if(!record.query){
						throw new Error(`Invalid query.`)
					}
					console.log(`record.datasource`, record.datasource)
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
							results = await driver.collection(query.collection).aggregate(query.aggregate).toArray();
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
								results = await driver.collection(query.collection).find(filter, options).count();
							}else{
								results = await driver.collection(query.collection).find(filter, options).toArray();
							}
						}

					}else if(_.include(['sqlite','sqlserver','postgres','oracle','mysql'], datasource.driver)){
						throw new Error(`This data source [${datasource.driver}] is not supported.`)
					}else {
						throw new Error(`This data source [${datasource.driver}] is not supported.`)
					}
				}
				let data = {
					columns: [],
					rows: results
				}
				let columns = [];
				_.each(results, function(result){
					columns = _.union(_.concat(columns, _.keys(result))); 
				})
	
				_.each(columns, function(column){
					data.columns.push({type: '', name: column})
				})
				return {
					query_result: {
						retrieved_at: new Date(),
						// "query_hash": "3b089af464ff50343365c7ab7e376c30",
						query: record.query,
						// runtime: 0.690132141113281,
						data: {
							columns: [],
							rows: results
						},
						id: recordId,
						_id: recordId,
						data_source_id: record.datasource
					}
				}
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
