/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2023-03-23 15:12:14
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-02-25 17:29:55
 * @Description: 
 */

"use strict";
const { SteedosDatabaseDriverType, getObject, getDataSource } = require('@steedos/objectql');
const {
    generateActionGraphqlProp,
    generateSettingsGraphql,
    getGraphqlActions,
    getQueryFields
} = require('./lib');
const open = require('open');

const { formatFiltersToODataQuery } = require("@steedos/filters");

const serviceObjectMixin = require('@steedos/service-object-mixin');

const { QUERY_DOCS_TOP, UI_PREFIX, EXPAND_SUFFIX, GRAPHQL_ACTION_PREFIX} = require('./lib/consts');
const { translateToUI } = require('./lib/getGraphqlActions');

const _ = require('lodash');

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
module.exports = {
    name: 'graphql',
    namespace: "steedos",
    mixins: [serviceObjectMixin],

    globalGraphQLSettings: {}, // service-api 里generateGraphQLSchema使用 
    getGraphqlFields: getQueryFields,

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
        // expand、related等actions
        ...getGraphqlActions(),

        // meteor、default database 默认不返回is_deleted = true的数据
        find: {
            params: {
                fields: { type: 'array', items: "string", optional: true },
                filters: [{ type: 'array', optional: true }, { type: 'string', optional: true }],
                top: { type: 'number', optional: true, default: QUERY_DOCS_TOP },
                skip: { type: 'number', optional: true },
                sort: { type: 'string', optional: true }
            },
            // graphql: {
            //     query:
            //     [
            //         gql`
            //             users(fields: JSON, filters: JSON, top: Int, skip: Int, sort: String): [space_users]
            //         `,
            //         gql`
            //             space_users(fields: JSON, filters: JSON, top: Int, skip: Int, sort: String): [space_users]
            //         `    
            //     ]
            // },
            async handler(ctx) {
                const resolveInfo = ctx.meta.resolveInfo
                const objectName = resolveInfo.fieldName
                // filters: 如果filters中没有查询 is_deleted 则自动添加is_deleted != true 条件
                ctx.params.filters = await this.dealWithFilters(ctx.params.filters, objectName)
                if (_.isEmpty(ctx.params.fields)) {
                    const { resolveInfo } = ctx.meta;

                    const fieldNames = getQueryFields(resolveInfo);

                    if (!_.isEmpty(fieldNames)) {
                        ctx.params.fields = fieldNames;
                    }
                }
                const userSession = ctx.meta.user;

                if (_.has(ctx.params, "top")) { // 如果top小于1，不返回数据
                    if (ctx.params.top < 1) {
                        return []
                    }
                    if (ctx.params.top > QUERY_DOCS_TOP) {
                        ctx.params.top = QUERY_DOCS_TOP   // 最多返回5000条数据
                    }
                }
                return this.find(objectName, ctx.params, userSession)
            }
        },
        count: {
            params: {
                fields: { type: 'array', items: "string", optional: true },
                filters: [{ type: 'array', optional: true }, { type: 'string', optional: true }],
                top: { type: 'number', optional: true },
                skip: { type: 'number', optional: true },
                sort: { type: 'string', optional: true }
            },
            async handler(ctx) {
                const resolveInfo = ctx.meta.resolveInfo
                const objectName = resolveInfo.fieldName.replace('__count', '')
                // filters: 如果filters中没有查询 is_deleted 则自动添加is_deleted != true 条件
                ctx.params.filters = await this.dealWithFilters(ctx.params.filters, objectName)

                const userSession = ctx.meta.user;
                return this.count(objectName, ctx.params, userSession)
            }
        },
        findOne: {
            params: {
                id: { type: "any" },
                query: { type: "object", optional: true }
            },
            async handler(ctx) {
                const resolveInfo = ctx.meta.resolveInfo
                const objectName = resolveInfo.fieldName.replace('__findOne', '')
                const userSession = ctx.meta.user;
                const { id, query } = ctx.params;
                return this.findOne(objectName, id, query, userSession)
            }
        },
        insert: {
            params: {
                doc: [
                    { type: "object" },
                    { type: "string" }
                ]
            },
            async handler(ctx) {
                const resolveInfo = ctx.meta.resolveInfo
                const objectName = resolveInfo.fieldName.replace('__insert', '')
                const object = getObject(objectName)
                const userSession = ctx.meta.user;
                const { doc } = ctx.params;
                let data = '';
                if (_.isString(doc)) {
                    data = JSON.parse(doc);
                } else {
                    data = JSON.parse(JSON.stringify(doc));
                }
                if (userSession && (await object.getField('space'))) {
                    data.space = userSession.spaceId;
                }
                return this.insert(objectName, data, userSession)
            }
        },
        update: {
            params: {
                id: { type: "any" },
                doc: [
                    { type: "object" },
                    { type: "string" }
                ]
            },
            async handler(ctx) {
                const resolveInfo = ctx.meta.resolveInfo
                const objectName = resolveInfo.fieldName.replace('__update', '')
                const userSession = ctx.meta.user;
                const { id, doc } = ctx.params;
                let data = '';
                if (_.isString(doc)) {
                    data = JSON.parse(doc);
                } else {
                    data = JSON.parse(JSON.stringify(doc));
                }
                delete data.space;
                return this.update(objectName, id, data, userSession)
            }
        },
        delete: {
            params: {
                id: { type: "any" }
            },
            async handler(ctx) {
                const resolveInfo = ctx.meta.resolveInfo
                const objectName = resolveInfo.fieldName.replace('__delete', '')
                const objectConfig = await getObject(objectName).getConfig()
                const userSession = ctx.meta.user;
                const { id } = ctx.params;
                const enableTrash = objectConfig.enable_trash
                if (!enableTrash) {
                    return this.delete(objectName, id, userSession)
                } else {
                    const data = {
                        is_deleted: true,
                        deleted: new Date(),
                        deleted_by: userSession ? userSession.userId : null
                    }
                    return this.update(objectName, id, data, userSession)
                }
            }
        }
        // /**
        //  * @api {get} /service/api/graphql/generateGraphqlSchemaInfo 生成graphql schema
        //  * @apiName generateGraphqlSchemaInfo
        //  * @apiGroup service-object-graphql
        //  * @apiSuccess {Object} 
        //  */
        // generateGraphqlSchemaInfo: {
        //     rest: {
        //         method: 'GET',
        //         path: '/generateGraphqlSchemaInfo'
        //     },
        //     params: {
        //     },
        //     async handler(ctx) {
        //         this.broker.logger.info('[service][graphql]===>', 'generateGraphqlSchemaInfo', ctx.params.name)
        //         const settingsGraphql = await this.generateObjGraphqlMap(this.name)
        //         return settingsGraphql
        //     }
        // },

    },

    /**
     * Events
     */
    events: {
        // 此事件表示软件包发生变化（包括加载、卸载、对象发生变化），接收到此事件后重新生成graphql schema
        "$packages.changed": {
            params: {},
            async handler(ctx) {
                // console.log("Payload:", ctx.params);
                // console.log("Sender:", ctx.nodeID);
                // console.log("Metadata:", ctx.meta);
                // console.log("The called event name:", ctx.eventName);

                const objGraphqlMap = await this.generateObjGraphqlMap(this.name)

                let type = []
                let query = []
                let mutation = []
                let resolvers = {}
                let resolversQuery = {}
                let resolversMutation = {}

                for (const objectName in objGraphqlMap) {
                    if (Object.hasOwnProperty.call(objGraphqlMap, objectName)) {
                        const gMap = objGraphqlMap[objectName];
                        type.push(gMap.type)
                        query = query.concat(gMap.query)
                        mutation = mutation.concat(gMap.mutation)
                        resolvers = Object.assign(resolvers, gMap.resolvers)
                        resolversQuery = Object.assign(resolversQuery, gMap.resolversQuery)
                        resolversMutation = Object.assign(resolversMutation, gMap.resolversMutation)
                    }
                }

                this.globalGraphQLSettings = {
                    type: type,
                    query: query,
                    mutation: mutation,
                    resolvers: {
                        ...resolvers,
                        Query: resolversQuery,
                        Mutation: resolversMutation
                    }
                }

                // console.log('graphql:', new Date())
                // console.log(JSON.stringify(query, null, 2))

                // 发送事件，通知ApolloService重新加载graphql schema
                ctx.emit('$services.changed');

            }
        }
    },

    /**
     * Methods
     */
    methods: {
        getObjectsUIResolvers(objectConfigs){
            const resolvers = {};
            for (const object of objectConfigs) {
                try {
                    const objectConfig = object.metadata
                    const objectName = objectConfig.name
                    // 排除 __MONGO_BASE_OBJECT __SQL_BASE_OBJECT
                    if (['__MONGO_BASE_OBJECT', '__SQL_BASE_OBJECT'].includes(objectName)) {
                        continue
                    }

                    delete objectConfig.list_views
                    delete objectConfig.permission_set
                    delete objectConfig.actions
                    delete objectConfig.triggers

                    const _fields = {};
                    _.each(objectConfig.fields, (field)=>{
                        _fields[field.name] = _.pick(field, ['_id', 'name', 'label', 'type', 'options', 'multiple', 'reference_to', 'reference_to_field', 'data_type', 'scale', '_reference_to', 'enable_thousands']);
                    })
                    objectConfig.fields=_fields;

                    resolvers[objectName] = async (root, args, context, info) => {
                        // console.log(`${objectName}${UI_PREFIX}`, root, args, context, info);
                        const { ctx } = context;
                        let userSession = ctx.meta.user;
                        let selectFieldNames = [];
                        const fieldNames = getQueryFields(info);
                        if (!_.isEmpty(fieldNames)) {
                            selectFieldNames = fieldNames;
                        }
                        let result = await translateToUI(objectConfig, root, userSession, selectFieldNames, {root, args, context, info, objectDataLoaderHandler: this.objectDataLoaderHandler});
                        return result
                    }
                } catch (error) {
                    console.log(`error`, error)
                }
            }
            return resolvers;
        },
        // async ChangeGlobalGraphQLSettings() {
        //     const result = await Register.get(this.broker, 'globalGraphQLSettings');
        //     if(result){
        //         this.globalGraphQLSettings = result.metadata;
        //         // 发送事件，通知ApolloService重新加载graphql schema; api 服务和graphql服务在同一个节点上.
        //         this.broker.broadcastLocal('$services.changed');
        //     }
        // },
        find: {
            async handler(objectName, query, userSession) {
                const obj = this.getObject(objectName)
                if (objectName == 'users') {
                    return await obj.find(query)
                }
                return await obj.find(query, userSession)
            }
        },
        count: {
            async handler(objectName, query, userSession) {
                const obj = this.getObject(objectName)
                return await obj.count(query, userSession)
            }
        },
        findOne: {
            async handler(objectName, id, query, userSession) {
                const obj = this.getObject(objectName)
                if (objectName == 'users') {
                    return await obj.findOne(id, query)
                }
                return await obj.findOne(id, query, userSession)
            }
        },
        insert: {
            async handler(objectName, doc, userSession) {
                const obj = this.getObject(objectName)
                return await obj.insert(doc, userSession)
            }
        },
        update: {
            async handler(objectName, id, doc, userSession) {
                const obj = this.getObject(objectName)
                return await obj.update(id, doc, userSession)
            }
        },
        delete: {
            async handler(objectName, id, userSession) {
                const obj = this.getObject(objectName)
                return await obj.delete(id, userSession)
            }
        },

        async generateObjGraphqlMap(graphqlServiceName) {
            const objGraphqlMap = {}
            const objectConfigs = await this.broker.call("objects.getAll");
            const allRelationsInfo = await this.broker.call("objects.getAllRelationsInfo");
            const getRelationsInfo = (objectName)=>{
                const results0 = _.filter(allRelationsInfo.details, { 'objectName': objectName})
                const results1 = _.filter(allRelationsInfo.masters, { 'objectName': objectName})
                const results2 = _.filter(allRelationsInfo.lookup_details, { 'objectName': objectName})
                return {
                    details: _.compact(_.map(results0, 'key')),
                    masters: _.compact(_.map(results1, 'key')),
                    lookup_details: _.compact(_.map(results2, 'key')),
                }
            }


            for (const object of objectConfigs) {
                try {
                    // console.log('===>object.metadata.name: ', object.metadata.name)
                    const objectConfig = object.metadata
                    const objectName = objectConfig.name
                    // 排除 __MONGO_BASE_OBJECT __SQL_BASE_OBJECT
                    if (['__MONGO_BASE_OBJECT', '__SQL_BASE_OBJECT'].includes(objectName)) {
                        continue
                    }
                    /**
                     * objGraphqlMap[objectName] 结构
                    {
                        type: "",
                        resolvers: {
                            [objectName]: {
                                [`${name}${EXPAND_SUFFIX}`]: {},
                                [relatedFieldName]: {},
                                [DISPLAY_PREFIX]: {},
                                [UI_PREFIX]: {},
                                [PERMISSIONS_PREFIX]: {},
                                [`${RELATED_PREFIX}_files`]: {},
                                [`${RELATED_PREFIX}_tasks`]: {},
                                [`${RELATED_PREFIX}_notes`]: {},
                                [`${RELATED_PREFIX}_events`]: {},
                                [`${RELATED_PREFIX}_audit_records`]: {},
                                [`${RELATED_PREFIX}_instances`]: {},
                                [`${RELATED_PREFIX}_approvals`]: {}
                            }
                        },
                        query: [],
                        resolversQuery: {
                            [objectName]: { action: 'find' },
                            [`${objectName}__count`]: { action: 'count' },
                            [`${objectName}__findOne`]: { action: 'findOne' }
                        },
                        mutation: [],
                        resolversMutation: {
                            [`${objectName}__insert`]: { action: 'insert' },
                            [`${objectName}__update`]: { action: 'update' },
                            [`${objectName}__delete`]: { action: 'delete' }
                        }
                    }
                    */
                    const gMap = {}

                    const typeAndResolves = generateSettingsGraphql(objectConfig, graphqlServiceName, {getRelationsInfo: getRelationsInfo})

                    gMap.type = typeAndResolves.type
                    gMap.resolvers = typeAndResolves.resolvers

                    if (objectName == 'users') {
                        objGraphqlMap[objectName] = gMap
                        continue
                    }
                    gMap.query = []
                    gMap.resolversQuery = {}
                    gMap.mutation = []
                    gMap.resolversMutation = {}

                    gMap.query.push(generateActionGraphqlProp('find', objectConfig))
                    gMap.resolversQuery[objectName] = { action: 'find' }

                    gMap.query.push(generateActionGraphqlProp('count', objectConfig))
                    gMap.resolversQuery[`${objectName}__count`] = { action: 'count' }

                    gMap.query.push(generateActionGraphqlProp('findOne', objectConfig))
                    gMap.resolversQuery[`${objectName}__findOne`] = { action: 'findOne' }

                    gMap.mutation.push(generateActionGraphqlProp('insert', objectConfig))
                    gMap.resolversMutation[`${objectName}__insert`] = { action: 'insert' }

                    gMap.mutation.push(generateActionGraphqlProp('update', objectConfig))
                    gMap.resolversMutation[`${objectName}__update`] = { action: 'update' }

                    gMap.mutation.push(generateActionGraphqlProp('delete', objectConfig))
                    gMap.resolversMutation[`${objectName}__delete`] = { action: 'delete' }

                    objGraphqlMap[objectName] = gMap
                } catch (error) {
                    console.error(`error`, error)
                }
            };

            this.ObjectsUIResolvers = this.getObjectsUIResolvers(objectConfigs);

            return objGraphqlMap
        },

        // filters: 如果filters中没有查询 is_deleted 则自动添加is_deleted != true 条件
        async dealWithFilters(filters, objectName) {
            let newFilters = filters
            const objectConfig = await getObject(objectName).getConfig()
            const datasource = getDataSource(objectConfig.datasource)
            if (datasource.driver === SteedosDatabaseDriverType.MeteorMongo || datasource.driver === SteedosDatabaseDriverType.Mongo) {
                if (filters) {
                    if (_.isString(filters)) {
                        if (filters.indexOf('(is_deleted eq true)') < 0) {
                            newFilters = `(${filters}) and (is_deleted ne true)`;
                        }
                    }
                    if (_.isArray(filters)) {
                        const filtersStr = formatFiltersToODataQuery(filters);
                        if (filtersStr.indexOf('(is_deleted eq true)') < 0) {
                            newFilters = [filters, ['is_deleted', '!=', true]]
                        }
                    }
                } else {
                    newFilters = '(is_deleted ne true)'
                }
            }
            return newFilters
        }
    },

    /**
     * Service created lifecycle event handler
     */
    created() {
    },

    merged(schema) {
    },

    /**
     * Service started lifecycle event handler
     */
    async started() {
        // const that = this;
        // setTimeout(async function () {
        //     const objGraphqlMap = await that.generateObjGraphqlMap(that.name)

        //     let globalTypeDefs = []
        //     let query = []
        //     let mutation = []
        //     let resolvers = {}
        //     let resolversQuery = {}
        //     let resolversMutation = {}

        //     for (const objectName in objGraphqlMap) {
        //         if (Object.hasOwnProperty.call(objGraphqlMap, objectName)) {
        //             const gMap = objGraphqlMap[objectName];
        //             globalTypeDefs.push(gMap.type)
        //             query = query.concat(gMap.query)
        //             mutation = mutation.concat(gMap.mutation)
        //             resolvers = Object.assign(resolvers, gMap.resolvers)
        //             resolversQuery = Object.assign(resolversQuery, gMap.resolversQuery)
        //             resolversMutation = Object.assign(resolversMutation, gMap.resolversMutation)
        //         }
        //     }

        //     that.globalTypeDefs = globalTypeDefs

        //     that.settings.graphql = {
        //         query: query,
        //         mutation: mutation,
        //         resolvers: {
        //             ...resolvers,
        //             Query: resolversQuery,
        //             Mutation: resolversMutation
        //         }
        //     }

        //     console.log('graphql:', new Date())
        // }, 20000)
    },

    /**
     * Service stopped lifecycle event handler
     */
    async stopped() {

    }
};
