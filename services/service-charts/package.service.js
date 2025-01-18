"use strict";
const project = require('./package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-package-loader');
const objectql = require("@steedos/objectql");
const _ = require('lodash');
const express = require('express');
const path = require('path');
const mustache = require('mustache');
const Schedule = require('node-schedule');
const moment = require('moment');
const validator = require('validator');
const duration = require('duration');
const json2xls = require('json2xls');
const json2csv = require('json2csv');
const str = require('string-to-stream')

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
			path: path.join(__dirname, 'main'),
			name: packageName,
			isPackage: true,
		},
		initBuilderRouter: false,
		QUERY_RESULTS_CLEANUP_ENABLED: process.env.STEEDOS_QUERY_RESULTS_CLEANUP_ENABLED ? validator.toBoolean(process.env.STEEDOS_QUERY_RESULTS_CLEANUP_ENABLED || 'true', true) : true,
		QUERY_RESULTS_CLEANUP_COUNT: process.env.STEEDOS_QUERY_RESULTS_CLEANUP_COUNT || 100,
		QUERY_RESULTS_CLEANUP_MAX_AGE: process.env.STEEDOS_QUERY_RESULTS_CLEANUP_MAX_AGE || 7
	},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {
		exportResults: {
			rest: {
				method: "GET",
				path: "/queries/:queryId/results/:queryHash.:type"
			},
			async handler(ctx) {
				let { queryId, queryHash, type } = ctx.params;
				const allowTypes = ['csv', 'xlsx', 'json'];
				if (!_.includes(allowTypes, type)) {
					throw new Error(`Invalid type`);
				}
				const queryRecord = await this.getQueryRecord(queryId);
				let queryResult = await this.getLatestQueryResult(queryRecord.datasource, queryHash, -1);
				if (!queryResult) {
					queryResult = {
						data: {
							columns: [],
							rows: []
						}
					}
				}
				if (type == 'csv') {
					ctx.meta.$responseType = "text/csv; charset=UTF-8";
					ctx.meta.$responseHeaders = {
						"Content-Disposition": `attachment; filename="${encodeURI(queryRecord.name + '.csv')}"`
					};
					const fields = _.map(queryResult.data.columns, 'name');
					const opts = { fields };
					const parser = new json2csv.Parser(opts);
					return parser.parse(queryResult.data.rows);
				} else if (type == 'xlsx') {
					ctx.meta.$responseType = "application/octet-stream";
					const xls = json2xls(queryResult.data.rows || { "": "" });
					ctx.meta.$responseHeaders = {
						"Content-Disposition": `attachment; filename="${encodeURI(queryRecord.name + '.xlsx')}"`,
						'Content-Length': xls.length
					};
					return str(xls, 'binary')
				} else if (type == 'json') {
					ctx.meta.$responseType = "application/json";
					ctx.meta.$responseHeaders = {
						"Content-Disposition": `attachment; filename="${encodeURI(queryRecord.name + '.json')}"`
					};
					return queryResult.data.rows
				}
			}
		},
		queries: {
            rest: {
                method: "POST",
                path: "/queries/:recordId/results"
            },
            async handler(ctx) {
                const userSession = ctx.meta.user;
				let { recordId, parameters, max_age } = ctx.params;
				if (!_.has(ctx.params, 'max_age')) {
					max_age = -1;
				}
				const queryResult = await this.getQueryResult(recordId, parameters, max_age);
				return {
					query_result: queryResult
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
		searchQueries: {
			rest: {
				method: "GET",
				path: "/queries"
			},
			async handler(ctx) {
				const { q } = ctx.params;
				const queries = await objectql.getObject('queries').find({ filters: [['label', 'contains', q], 'or', ['name', 'contains', q]], sort: 'modified desc' });
				return {
					count: queries.length,
					page: 1,
					page_size: queries.length,
					results: queries
				}
			}
		},
		queryDropdowns: {
			rest: {
				method: "GET",
				path: "/queries/:queryId/dropdowns/:dropdownQueryId"
			},
			async handler(ctx) {
				const { queryId, dropdownQueryId } = ctx.params;

				return await this.dropdownValues(dropdownQueryId);
			}
		},
		getQueriesRecent: {
			rest: {
				method: "GET",
				path: "/queries/recent"
			},
			async handler(ctx) {
				const queries = await objectql.getObject('queries').find({ sort: 'modified desc', top: 10 });
				return queries;
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
				let parameters = {};
				if (queryRecord && queryRecord.options && queryRecord.options.parameters) {
					_.each(queryRecord.options.parameters, (parameter) => {
						parameters[parameter.name] = parameter.value
					})
				}

				try {
					let queryInfo = await this.getQueryInfo(recordId, parameters)
					this.startOrUpdateQuerySchedule(queryInfo, true)
				} catch (error) {

				}

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
					if (dataSource.driver != 'meteor-mongo') {
						const dataSourceType = this.getDataSourceType(dataSource.driver)
						switch (dataSource.driver) {
							case 'mongo':
								dataSources.push({
									_id: name,
									id: name,
									name: dataSource.label || name,
									syntax: 'json',
									type: dataSourceType,
									view_only: false
								})
								break;
							default:
								dataSources.push({
									_id: name,
									id: name,
									name: dataSource.label || name,
									syntax: 'sql',
									type: dataSourceType,
									view_only: false
								})
								break;
						}
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
			this.initBuilderRouter();
		}
	},

	/**
	 * Methods
	 */
	methods: {
		initBuilderRouter: {
			handler() {
				if (this.settings.initBuilderRouter) {
					return;
				}
				this.settings.initBuilderRouter = true;
				try {
					const router = require('@steedos/router').staticRouter();
					let publicPath = require.resolve("@steedos/service-charts/package.json");
					publicPath = publicPath.replace("package.json", 'webapp');
					let routerPath = "";
					const cacheTime = 86400000 * 1; // one day
					router.use(`${routerPath}/builder`, express.static(publicPath, { maxAge: cacheTime }));
				} catch (error) {
					console.error(error)
					this.settings.initBuilderRouter = false;
				}
			}
		},
		getDataSourceType: {
			handler(driver) {
				switch (driver) {
					case 'mongo':
						return 'mongodb'
					case 'sqlite':
						return 'sqlite'
					case 'sqlserver':
						return 'mssql'
					case 'postgres':
						return 'pg'
					case 'oracle':
						return 'oracle'
					case 'mysql':
						return 'mysql'
					default:
						break;
				}
			}
		},
		getQueryRecord: {
			async handler(recordId){
				let queryRecord = await objectql.getObject("queries").findOne(recordId);
				if(!queryRecord || _.has(queryRecord, '__filename')){
					const RecordByName = await getQueries(recordId);
					if(RecordByName){
						queryRecord = RecordByName;
					}
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
		joinParameterListValues: {
			handler(parameters, schema) {
				const updatedParameters = {};
				_.each(parameters, (val, key) => {
					if (_.isArray(val)) {
						const definition = _.find(schema, (item) => {
							return item.name == key
						})
						const multi_values_options = definition.multiValuesOptions || {};
						const separator = String(multi_values_options.separator || ",");
						const prefix = String(multi_values_options.prefix || "");
						const suffix = String(multi_values_options.suffix || "");
						let newValue = '';
						_.each(val, (item, index) => {
							newValue = newValue + `${prefix}${item}${suffix}` + (index < val.length - 1 ? separator : '')
						})

						updatedParameters[key] = newValue
					} else {
						updatedParameters[key] = val
					}
				})

				return updatedParameters;
			}
		},
		getQueryInfo: {
			async handler(queryId, parameters) {
				let queryInfo = null;
				let record = await this.getQueryRecord(queryId);
				if (record) {
					if (!record.query) {
						throw new Error(`Invalid query.`)
					}
					const datasource = objectql.getDataSource(record.datasource);
					if (!datasource) {
						throw new Error(`not find Data Source.`)
					}
					if (!record.options) {
						record.options = { parameters: [] }
					}
					if (!record.options.parameters) {
						record.options.parameters = []
					}
					const invalidParameterNames = [];
					for (const definition of record.options.parameters) {
						const valid = await this.validParameter(definition, parameters[definition.name])
						if (!valid) {
							invalidParameterNames.push(definition.name)
						}
					}
					if (invalidParameterNames && invalidParameterNames.length > 0) {
						throw new Error(`The following parameter values are incompatible with their definitions: ${invalidParameterNames.join(',')}`)
					}
					const parameterized_query = this.joinParameterListValues(parameters, record.options.parameters || [])
					const queryString = this.mustacheRender(record.query, parameterized_query);
					queryInfo = {
						queryString,
						queryId,
						data_source_id: record.datasource,
						datasource,
						options: record.options,
						schedule: record.schedule
					};

					switch (datasource.driver) {
						case 'mongo':
							try {
								JSON.parse(queryString);
							} catch (Exception) {
								console.error(`queryString`, queryString, Exception);
								throw new Error(`Invalid query.`);
							}
							break;
						case 'sqlite':
						case 'sqlserver':
						case 'postgres':
						case 'oracle':
						case 'mysql':
							//TODO check is sql
							break;
						default:
							throw new Error(`This data source [${datasource.driver}] is not supported.`)
					}
				}
				return queryInfo;
			}
		},
		getQueryResult: {
			/**
			 * 
			 * @param {*} queryId 
			 * @param {*} parameters 
			 * @param {*} max_age ：值为-1时且存在缓存，始终从缓存中获取。
			 * @returns 
			 */
			async handler(queryId, parameters, max_age) {
				const queryInfo = await this.getQueryInfo(queryId, parameters);
				if (queryInfo) {
					const queryHash = this.getQueryHash(queryInfo.queryString);
					let result = await this.getLatestQueryResult(queryInfo.data_source_id, queryHash, max_age);
					if (!result) {
						result = await this.runQueryExecutor(queryInfo);
						this.startOrUpdateQuerySchedule(queryInfo)
					}
					return result;
				} else {
					throw new Error('not find query');
				}
			}
		},
		validParameter: {
			async handler(definition, value) {
				let enum_options = definition.enumOptions
				let query_id = definition.queryId
				let type = definition.type
				let allow_multiple_values = _.isObject(definition.multiValuesOptions)
				if (_.isString(enum_options)) {
					enum_options = enum_options.split("\n")
				}

				const _isDate = (value) => {
					return !_.isNaN(Date.parse(value))
				}

				const _isDateRange = (value) => {
					try {
						return _isDate(value["start"]) && _isDate(value["end"])
					} catch (error) {
						return false;
					}
				}
				let dropdownValues = []
				if (query_id) {
					dropdownValues = _.map(await this.dropdownValues(query_id), 'value');
				}

				const validators = {
					text: (value) => {
						return _.isString(value)
					},
					number: (value) => {
						return _.isNumber(value)
					},
					enum: (value) => {
						if (_.isArray(value)) {
							return allow_multiple_values && _.difference(value, enum_options).length == 0
						} else {
							return _.includes(enum_options, String(value))
						}
					},
					query: (value) => {
						if (_.isArray(value)) {
							return allow_multiple_values && _.difference(value, dropdownValues).length == 0
						} else {
							return _.includes(dropdownValues, String(value))
						}
					},
					date: _isDate,
					"datetime-local": _isDate,
					"datetime-with-seconds": _isDate,
					"date-range": _isDateRange,
					"datetime-range": _isDateRange,
					"datetime-range-with-seconds": _isDateRange
				}
				return validators[type](value);
			}
		},
		mustacheRender: {
			handler(template, context = {}) {
				return mustache.render(template, context, undefined, {
					// tags: ["\"{{", "}}\""],
					escape: function (value) {
						return value;
					}
				});
			}
		},
		getQueryHash: {
			handler(sql) {
				return objectql.getMD5(sql);
			}
		},
		getQueryResultCacheKey: {
			handler(dataSourceId, queryHash) {
				return `$steedos.queries.${dataSourceId}.${queryHash}`
			}
		},
		storeQueryResult: {
			async handler(result) {
				const key = this.getQueryResultCacheKey(result.data_source_id, result.query_hash)
				//缓存时，将retrieved_at存储为时间戳便于比较
				result.retrieved_at = result.retrieved_at.getTime();
				this.cacherMaps.push({ key, retrieved_at: result.retrieved_at })
				await this.broker.cacher.set(key, result);
			}
		},
		getLatestQueryResult: {
			async handler(dataSourceId, queryHash, maxAge = 0) {
				const key = this.getQueryResultCacheKey(dataSourceId, queryHash);
				const result = await this.broker.cacher.get(key);
				if (maxAge === -1) {
					if (result) {
						result.retrieved_at = new Date(result.retrieved_at);
					}
					return result
				} else {
					if (result && result.retrieved_at + maxAge * 1000 >= new Date().getTime()) {
						result.retrieved_at = new Date(result.retrieved_at);
						return result;
					}
				}
				return null;
			}
		},
		runQueryExecutor: {
			async handler(queryInfo) {
				const { queryId, data_source_id, queryString, datasource } = queryInfo
				let queryHash = this.getQueryHash(queryString);
				let retrievedAt = null;
				let runtime = 0.00;

				let results = null;
				const startedAt = new Date().getTime();
				try {
					results = await this.runQuery(datasource, queryString);
				} catch (error) {
					console.error(error, queryString)
				}
				retrievedAt = new Date();
				runtime = (retrievedAt.getTime() - startedAt) / 1000;
				let data = {
					columns: [],
					rows: results || []
				}
				let columns = [];
				_.each(results, function (result) {
					columns = _.union(_.concat(columns, _.keys(result)));
				})

				_.each(columns, function (column) {
					data.columns.push({ type: '', name: column })
				})
				const queryResult = {
					retrieved_at: retrievedAt,
					query_hash: queryHash,
					query: queryString,
					runtime: runtime,
					data: data,
					id: queryId,
					_id: queryId,
					data_source_id: data_source_id,
					data_source_type: this.getDataSourceType(datasource.driver)
				}
				await this.storeQueryResult(queryResult);
				return queryResult;
			}
		},
		runQuery: {
			async handler(datasource, queryString) {
				let results = null;
				if (queryString && datasource) {
					const driver = datasource.adapter;
					await driver.connect();
					if ('mongo' === datasource.driver) {
						let query = null;
						try {
							query = JSON.parse(queryString);
						} catch (Exception) {
							console.error(`queryString`, queryString, Exception);
							throw new Error(`Invalid query.`);
						}
						if (query.aggregate) {
							results = await driver.collection(query.collection).aggregate(query.aggregate).toArray();
						} else if (query.query) {
							const filter = query.query;
							const options = {
								projection: query.projection || query.fields,
								sort: query.sort,
								limit: query.limit,
								skip: query.skip
							}
							if (query.count) {
								results = await driver.collection(query.collection).find(filter, options).count();
							} else {
								results = await driver.collection(query.collection).find(filter, options).toArray();
							}
						}
					} else if (_.includes(['sqlite', 'sqlserver', 'postgres', 'oracle', 'mysql'], datasource.driver)) {
						results = await driver.run(queryString);
					}
				}
				return results;
			}
		},
		cleanupQueryResults: {
			async handler() {
				const settings = this.settings;
				this.broker.logger.info(`Running query results clean up (removing maximum of ${settings.QUERY_RESULTS_CLEANUP_COUNT} unused results, that are ${settings.QUERY_RESULTS_CLEANUP_MAX_AGE} days old or more)`);
				const unusedQueryResults = _.filter(this.cacherMaps, (item) => {
					return item.retrieved_at < moment().subtract(Number(settings.QUERY_RESULTS_CLEANUP_MAX_AGE), 'd').toDate().getTime()
				});
				const deleteQueryResults = _.slice(unusedQueryResults, 0, Number(settings.QUERY_RESULTS_CLEANUP_COUNT));
				for (const item of deleteQueryResults) {
					await this.broker.cacher.del(item.key);
				}
				this.broker.logger.info(`Deleted ${deleteQueryResults.length} unused query results.`);
			}
		},
		cleaupQueryJob: {
			handler(queryId) {
				_.each(this.querySCheduleMaps, (item, index) => {
					if (item.queryId == queryId) {
						if (item.job && item.job.cancel) {
							item.job.cancel()
						}
						this.querySCheduleMaps[index] = undefined;
					}
				})
				this.querySCheduleMaps = _.compact(this.querySCheduleMaps);
			}
		},
		startOrUpdateQuerySchedule: {
			handler(queryInfo, refresh) {
				const { queryId, schedule } = queryInfo
				let _queryJob = _.find(this.querySCheduleMaps, (item) => {
					return item.queryId == queryId;
				})
				if (schedule && schedule.interval > 0) {
					if (_queryJob) {
						if (refresh) {
							this.cleaupQueryJob(queryId);
						} else {
							return;
						}
					}

					const date = new Date();
					const date2 = moment(date).add(schedule.interval, 'seconds').toDate();
					var diff = new duration(date, date2);
					let role_year = diff.year > 0 ? diff.year : "*";
					let role_month = diff.month > 0 ? diff.month : "*";
					let role_day = diff.day > 0 ? `*/${diff.day}` : "*";
					let role_dayOfWeek = "*";
					let role_hour = diff.hour > 0 ? `*/${diff.hour}` : (diff.minute > 0 ? "*" : "0");
					let role_minute = diff.minute > 0 ? `*/${diff.minute}` : "0";
					// let role_second = diff.second > 0 ? diff.second : 0;

					if (schedule.time) {
						const foo = schedule.time.split(":");
						role_hour = Number(foo[0]);
						role_minute = Number(foo[1]);
					}
					const rule = `${role_minute} ${role_hour} ${role_day} * *`
					// if (role_date) {
					// 	role = `${role_minute} ${role_hour} */${role_date} * *`
					// } else {
					// 	role = `${role_minute} ${role_hour} * * *`
					// }
					let end = null;
					if (schedule.until) {
						end = new Date(schedule.until)
					}
					let job = Schedule.scheduleJob({ end: end, rule: rule }, () => {
						try {
							this.runQueryExecutor(queryInfo);
						} catch (error) {
							console.error(error);
						}
					});
					this.broker.logger.info(`add query job`, queryId, rule, end);
					this.querySCheduleMaps.push({ queryId, job })
				} else {
					if (_queryJob) {
						this.cleaupQueryJob(queryId);
					}
				}
			}
		},
		dropdownValues: {
			async handler(dropdownQueryId) {
				const { data } = await this.getQueryResult(dropdownQueryId, {}, 0);

				if (!data || !data.columns || data.columns.length === 0) {
					return [];
				}

				const first_column = data["columns"][0]["name"];

				return _.map(data.rows, (row) => {
					const rowKeys = _.keys(row);
					const name_column = _.find(rowKeys, (key) => {
						if (key && key.toLocaleLowerCase() == 'name') {
							return true;
						}
					}) || first_column;
					const value_column = _.find(rowKeys, (key) => {
						if (key && key.toLocaleLowerCase() == 'value') {
							return true;
						}
					}) || first_column;
					return { "name": row[name_column], "value": String(row[value_column]) }
				})
			}
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
		this.initBuilderRouter();
		this.cacherMaps = [];
		this.querySCheduleMaps = [];
		if (this.settings.QUERY_RESULTS_CLEANUP_ENABLED) {
			this.job = Schedule.scheduleJob('*/5 * * * *', () => {
				try {
					this.cleanupQueryResults();
				} catch (error) {
					console.error(error);
				}
			});
		};
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {
		if (this.job && this.job.cancel) {
			this.job.cancel()
		}
	}
};
