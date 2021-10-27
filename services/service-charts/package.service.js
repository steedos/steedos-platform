"use strict";
const project = require('./package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-package-loader');
const objectql = require("@steedos/objectql");
const _ = require('lodash');
const express = require('express');
const path = require('path');
const mustache = require('mustache');
const getQueries = async(apiName)=>{
	const queries = await objectql.getObject('queries').find({ filters: [['name', '=', apiName]] });
	if(queries.length > 0){
		return queries[0]
	}
}

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
				const { recordId, parameters } = ctx.params;
				let results = null;
                let record = await objectql.getObject("queries").findOne(recordId);
				if(!record){
					record = await getQueries(recordId)
				}
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

						query = JSON.parse(this.mustacheRender(JSON.stringify(query), parameters))

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

					}else if(_.includes(['sqlite','sqlserver','postgres','oracle','mysql'], datasource.driver)){
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
						data: data,
						id: recordId,
						_id: recordId,
						data_source_id: record.datasource
					}
				}
            }
        },
		getQuery: {
            rest: {
                method: "GET",
                path: "/queries/:recordId"
            },
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { recordId } = ctx.params;
                let queryRecord = await this.getQueryRecord(recordId);
				return await this.formatQuery(queryRecord);
            }
        },
		addQuery: {
			rest: {
                method: "POST",
                path: "/queries/"
            },
            async handler(ctx) {
				//TODO
				const data = ctx.params;
				console.log(`addQuery data`, data);
				return {}
            }
		},
		updateQuery: {
			rest: {
                method: "POST",
                path: "/queries/:recordId"
            },
            async handler(ctx) {
				const { recordId, query, label, description, data_source_id, options, schedule } = ctx.params;
				const userSession = ctx.meta.user;
				let doc = {};

				if(_.has(ctx.params, 'query')){
					doc.query = query
				}

				if(_.has(ctx.params, 'label')){
					doc.label = label
				}

				if(_.has(ctx.params, 'description')){
					doc.description = description
				}

				if(_.has(ctx.params, 'data_source_id')){
					doc.datasource = data_source_id
				}

				if (_.has(ctx.params, 'options')) {
					doc.options = options
				}

				if (_.has(ctx.params, 'schedule')) {
					doc.schedule = schedule
				}

				const records = await objectql.getObject('queries').find({filters: [['name','=', recordId]]})

				if(records && records.length > 0){
					await objectql.getObject('queries').update(records[0]._id, doc, userSession)
				}
				let queryRecord = await this.getQueryRecord(recordId);
				return await this.formatQuery(queryRecord);
            }
		},
		dataSources: {
			rest: {
                method: "GET",
                path: "/data_sources"
            },
            async handler(ctx) {
                const dataSourcesAll = objectql.getSteedosSchema().getDataSources();
				const dataSources = [];
				_.each(dataSourcesAll, (dataSource, name)=>{
					if(dataSource.driver === 'mongo'){
						dataSources.push({
							_id: name,
							id: name,
							name: dataSource.label || name,
							syntax: 'json',
							type: 'mongodb',
							view_only: false
						})
					}
				})
				return dataSources;
            }
		},
		dataSourcesSchema: {
			rest: {
                method: "GET",
                path: "data_sources/:datasource/schema"
            },
            async handler(ctx) {
				const { datasource } = ctx.params;
                const objectConfig = objectql.getDataSource(datasource).getObjectsConfig();
				let schema = [];
				_.each(objectConfig, (config, name)=>{
					schema.push({name: config.table_name || name, columns: _.keys(config.fields)})
				})

				if(datasource === 'default'){
					const meteorObjectsConfig = objectql.getDataSource('meteor').getObjectsConfig();
					_.each(meteorObjectsConfig, (config, name)=>{
						schema.push({name: config.table_name || name, columns: _.keys(config.fields)})
					})
				}

				schema = _.sortBy(schema, ['name'])
				return {schema: schema};
            }
		},
		querySnippets: {
			rest: {
                method: "GET",
                path: "/query_snippets"
            },
            async handler(ctx) {
				//	TODO : 查询片段
				return []
            }
		},
	},

	/**
	 * Events
	 */
	 events: {
		'steedos-server.started': async function (ctx) {
			const router = express.Router();
			let publicPath = require.resolve("@steedos/service-charts/package.json");
			publicPath = publicPath.replace("package.json", 'webapp');
			let routerPath = "";
			if (__meteor_runtime_config__.ROOT_URL_PATH_PREFIX) {
				routerPath = __meteor_runtime_config__.ROOT_URL_PATH_PREFIX;
			}
			const cacheTime = 86400000 * 1; // one day
			router.use(`${routerPath}/charts-design`, express.static(publicPath, { maxAge: cacheTime }));
			WebApp.rawConnectHandlers.use(router);
		}
	},

	/**
	 * Methods
	 */
	methods: {
		getQueryRecord: {
			async handler(recordId){
				let queryRecord = await objectql.getObject("queries").findOne(recordId);
				if(!queryRecord){
					queryRecord = await getQueries(recordId)
				}
				return queryRecord;
			}
		},
		formatQuery: {
			async handler(queryRecord){
				if(queryRecord){
					const visualizations = await this.getQueryVisualizations(queryRecord.name);
					return {
						user: {
							// auth_type: "password",
							is_disabled: false,
							// updated_at: "2021-10-15T07:31:10.579Z",
							profile_image_url: Steedos.absoluteUrl(`/avatar/${queryRecord.created_by}`),
							// is_invitation_pending: false,
							// groups: [
							// 	1,
							// 	2
							// ],
							// id: 1,
							name: "admin",
							// created_at: "2021-07-27T06:50:26.282Z",
							// disabled_at: null,
							// is_email_verified: true,
							// active_at: "2021-10-15T07:31:08Z",
							// email: "chenzhipei@hotoa.com"
						},
						created_at: queryRecord.created,
						// latest_query_data_id: null,
						schedule: queryRecord.schedule,
						description: queryRecord.description,
						tags: [],
						updated_at: queryRecord.modified,
						last_modified_by: {
							// auth_type: "password",
							is_disabled: false,
							// updated_at: "2021-10-15T07:31:10.579Z",
							profile_image_url: Steedos.absoluteUrl(`/avatar/${queryRecord.modified_by}`),
							// is_invitation_pending: false,
							// groups: [
							// 	1,
							// 	2
							// ],
							// id: 1,
							name: "admin",
							// created_at: "2021-07-27T06:50:26.282Z",
							// disabled_at: null,
							// is_email_verified: true,
							// active_at: "2021-10-15T07:31:08Z",
							// email: "chenzhipei@hotoa.com"
						},
						options: queryRecord.options || {
							"parameters": []
						},
						is_safe: true,
						version: 1,
						is_favorite: false,
						query_hash: "",
						is_archived: false,
						can_edit: true,
						visualizations: visualizations,
						query: queryRecord.query,
						api_key: "",
						is_draft: true,
						id: queryRecord.name,
						data_source_id: queryRecord.datasource,
						name: queryRecord.name,
						label: queryRecord.label,
						_id: queryRecord._id
					}
				}

				return {}
			}
		},
		getQueryVisualizations:{
			async handler(queryApiName){
				const charts = await objectql.getObject('charts').find({filters: [['query','=', queryApiName]]})
				const visualizations = [];
				_.each(charts, function(chart){
					visualizations.push({
						_id: chart._id,
						id: chart._id,
						description: chart.description,
						query: queryApiName,
						type: chart.type,
						options: chart.options,
						name: chart.name,
						label: chart.label,
						created_at: chart.created,
						updated_at: chart.modified
					})
				})
				return visualizations;
			}
		},
		mustacheRender: {
			handler(template, context = {}) {
				return mustache.render(template, context);
			}
		},
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
