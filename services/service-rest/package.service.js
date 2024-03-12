/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2023-03-23 15:12:14
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-03-12 11:18:49
 * @Description: 
 */
"use strict";
// @ts-check
const serviceObjectMixin = require('@steedos/service-object-mixin');
const { QUERY_DOCS_TOP, REQUEST_SUCCESS_STATUS } = require('./consts')
const { translateRecords } = require('./translate');
const _ = require('lodash')
const { getObject } = require('@steedos/objectql');

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
module.exports = {
    name: 'rest',
    namespace: "steedos",
    mixins: [serviceObjectMixin],

    /**
     * Settings
     */
    settings: {
        // Base path
        rest: "/",
    },

    /**
     * Dependencies
     */
    dependencies: [],

    /**
     * Actions
     */
    actions: {
        health: {
            rest: {
                method: "GET",
                path: "/health"
            },
            async handler(ctx) {
                return 'ok'
            }
        },
        /**
         * @api {GET} /api/v1/:objectName 获取列表记录
         * @apiVersion 0.0.0
         * @apiName find
         * @apiGroup @steedos/service-rest
         * @apiParam {String} objectName 对象API Name，如：contracts
         * @apiQuery {String} [fields] 字段名，如：'["name", "description"]'
         * @apiQuery {String} [uiFields] 字段名，如：'["owner", "date"]',此参数中的字段要求在参数fields中存在
         * @apiQuery {String} [expandFields] 字段名，如：'{owner: {fields: ["name"], uiFields: ["owner"], expandFields: ...}}'
         * @apiQuery {String} [filters] 过滤条件，如：'[["name", "=", "test"],["amount", ">", 100]]'
         * @apiQuery {String} [top] 获取条数，如：'10'，最多5000
         * @apiQuery {String} [skip] 跳过条数，如：'10'
         * @apiQuery {String} [sort] 排序，如：'name desc'
         * @apiSuccess {Object[]} find  记录列表
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       "status": 0, // 返回 0，表示当前接口正确返回，否则按错误请求处理
         *       "msg": "", // 返回接口处理信息
         *       "data": {
         *         "items": [
         *           {
         *             "_id": "5a6b1c3c8d6d1d0b7c6d1d0b",
         *             "name": "",
         *             ...
         *           }
         *         ],
         *         "total": 200 // 注意！！！这里不是当前请求返回的 items 的长度，而是数据库中一共有多少条数据
         *       }
         *     }
         * @apiErrorExample {json} Error-Response:
         *     HTTP/1.1 500 Error
         *     {
         *       "status": -1,
         *       "msg": "",
         *       "data": {}
         *     }
         */
        find: {
            rest: {
                method: "GET",
                path: "/:objectName"
            },
            params: {
                objectName: { type: "string" },
                fields: { type: 'string', optional: true },
                uiFields: { type: 'string', optional: true },
                expandFields: { type: 'string', optional: true },
                filters: { type: 'string', optional: true },
                top: { type: 'string', optional: true, default: QUERY_DOCS_TOP },
                skip: { type: 'string', optional: true },
                sort: { type: 'string', optional: true }
            },
            async handler(ctx) {
                const params = ctx.params
                const { objectName, filters, top, skip, sort } = params
                const userSession = ctx.meta.user;

                let fields = [];
                if(params.fields){
                    fields = JSON.parse(params.fields)
                }

                let uiFields = [];
                if(params.uiFields){
                    uiFields = JSON.parse(params.uiFields)
                }

                let expandFields = {};
                if(params.expandFields){
                    expandFields = JSON.parse(params.expandFields)
                    // 跟GraphQL第一层一样，从库里查的字段要补上expandFields中的字段，即uiFields中依赖的字段可以在fields中定义，也可以在expandFields中字义
                    fields = _.union(fields, _.keys(expandFields));
                }

                const query = {}
                if (filters) {
                    query.filters = JSON.parse(filters)
                }
                if (fields) {
                    query.fields = fields;
                }
                if (top) {
                    query.top = Number(top)
                }
                if (skip) {
                    query.skip = Number(skip)
                }
                if (sort) {
                    query.sort = sort
                }

                if (_.has(query, "top")) { // 如果top小于1，不返回数据
                    if (query.top < 1) {
                        return []
                    }
                    if (query.top > QUERY_DOCS_TOP) {
                        query.top = QUERY_DOCS_TOP   // 最多返回5000条数据
                    }
                }

                const records = await this.find(objectName, query, userSession)
                const countQuery = {
                    filters: query.filters
                }
                const totalCount = await this.count(objectName, countQuery, userSession)

                return {
                    "status": REQUEST_SUCCESS_STATUS,
                    "msg": "",
                    "data": {
                        "items": await translateRecords(records, objectName, fields, uiFields, expandFields, userSession),
                        "total": totalCount
                    }
                }
            }
        },
        /**
         * @api {POST} /api/v1/:objectName/search 查询列表记录
         * @apiVersion 0.0.0
         * @apiName search
         * @apiGroup @steedos/service-rest
         * @apiParam {String} objectName 对象API Name，如：contracts
         * @apiBody {String[]} [fields] 字段名，如：["name", "description"]
         * @apiBody {Object[]} [filters] 过滤条件，如：[['name', '=', 'test'],['amount', '>', 100]]
         * @apiBody {Number} [top] 获取条数，如：10，最多5000
         * @apiBody {Number} [skip] 跳过条数，如：10
         * @apiBody {String} [sort] 排序，如：'name desc'
         * @apiSuccess {Object[]} search  记录列表
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       "status": 0, // 返回 0，表示当前接口正确返回，否则按错误请求处理
         *       "msg": "", // 返回接口处理信息
         *       "data": {
         *         "items": [
         *           {
         *             "_id": "5a6b1c3c8d6d1d0b7c6d1d0b",
         *             "name": "",
         *             ...
         *           }
         *         ],
         *         "total": 200 // 注意！！！这里不是当前请求返回的 items 的长度，而是数据库中一共有多少条数据
         *       }
         *     }
         * @apiErrorExample {json} Error-Response:
         *     HTTP/1.1 500 Error
         *     {
         *       "status": -1,
         *       "msg": "",
         *       "data": {}
         *     }
         */
        search: {
            rest: {
                method: "POST",
                path: "/:objectName/search"
            },
            params: {
                objectName: { type: "string" },
                fields: { type: 'array', items: "string", optional: true },
                filters: [{ type: 'array', optional: true }, { type: 'string', optional: true }],
                top: { type: 'number', optional: true, default: QUERY_DOCS_TOP },
                skip: { type: 'number', optional: true },
                sort: { type: 'string', optional: true }
            },
            async handler(ctx) {
                const params = ctx.params
                const { objectName } = params
                const userSession = ctx.meta.user;

                const query = {}
                if (_.has(params, "filters")) {
                    query.filters = params.filters
                }
                if (_.has(params, "fields")) {
                    query.fields = params.fields
                }
                if (_.has(params, "top")) {
                    query.top = params.top
                }
                if (_.has(params, "skip")) {
                    query.skip = params.skip
                }
                if (_.has(params, "sort")) {
                    query.sort = params.sort
                }

                if (_.has(query, "top")) { // 如果top小于1，不返回数据
                    if (query.top < 1) {
                        return []
                    }
                    if (query.top > QUERY_DOCS_TOP) {
                        query.top = QUERY_DOCS_TOP   // 最多返回5000条数据
                    }
                }

                const records = await this.find(objectName, query, userSession)
                const countQuery = {
                    filters: query.filters
                }
                const totalCount = await this.count(objectName, countQuery, userSession)
                return {
                    "status": REQUEST_SUCCESS_STATUS,
                    "msg": "",
                    "data": {
                        "items": records,
                        "total": totalCount
                    }
                }
            }
        },
        /**
         * @api {GET} /api/v1/:objectName/:id 获取单条记录
         * @apiVersion 0.0.0
         * @apiName findOne
         * @apiGroup @steedos/service-rest
         * @apiParam {String} objectName 对象API Name，如：contracts
         * @apiParam {String} id 记录id，如：5e7d1b9b9c9d4400001d1b9b
         * @apiQuery {String} [fields] 字段名，如：'["name","description"]'
         * @apiSuccess {Object} record  记录信息
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       "status": 0, // 返回 0，表示当前接口正确返回，否则按错误请求处理
         *       "msg": "", // 返回接口处理信息
         *       "data": {
         *          "_id": "5a6b1c3c8d6d1d0b7c6d1d0b",
         *          "name": "",
         *          ...
         *        }
         *       }
         *     }
         * @apiErrorExample {json} Error-Response:
         *     HTTP/1.1 500 Error
         *     {
         *       "status": -1,
         *       "msg": "",
         *       "data": {}
         *     }
         */
        findOne: {
            rest: {
                method: "GET",
                path: "/:objectName/:id"
            },
            params: {
                objectName: { type: "string" },
                id: { type: "any" },
                fields: { type: 'string', optional: true },
            },
            async handler(ctx) {
                const { objectName, id, fields } = ctx.params
                const userSession = ctx.meta.user;
                const query = {}
                if (fields) {
                    query.fields = JSON.parse(fields)
                }
                const doc = await this.findOne(objectName, id, query, userSession)
                return {
                    "status": REQUEST_SUCCESS_STATUS,
                    "msg": "",
                    "data": doc
                }
            }
        },
        /**
         * @api {POST} /api/v1/:objectName 新增记录
         * @apiVersion 0.0.0
         * @apiName insert
         * @apiGroup @steedos/service-rest
         * @apiParam {String} objectName 对象API Name，如：contracts
         * @apiBody {Object} doc 新增的内容，如：{ name: 'test', description: 'test' }
         * @apiSuccess {Object} record  新记录信息
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       "status": 0, // 返回 0，表示当前接口正确返回，否则按错误请求处理
         *       "msg": "", // 返回接口处理信息
         *       "data": {
         *          "_id": "5a6b1c3c8d6d1d0b7c6d1d0b",
         *          "name": "",
         *          ...
         *        }
         *       }
         *     }
         * @apiErrorExample {json} Error-Response:
         *     HTTP/1.1 500 Error
         *     {
         *       "status": -1,
         *       "msg": "",
         *       "data": {}
         *     }
         */
        insert: {
            rest: {
                method: "POST",
                path: "/:objectName"
            },
            params: {
                objectName: { type: "string" },
                doc: { type: "object" }
            },
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { objectName, doc } = ctx.params;
                const object = getObject(objectName)
                let data = '';
                if (_.isString(doc)) {
                    data = JSON.parse(doc);
                } else {
                    data = JSON.parse(JSON.stringify(doc));
                }
                if (userSession && (await object.getField('space'))) {
                    data.space = userSession.spaceId;
                }
                const newDoc = await this.insert(objectName, data, userSession)
                return {
                    "status": REQUEST_SUCCESS_STATUS,
                    "msg": "",
                    "data": newDoc
                }
            }
        },
        /**
         * @api {PUT} /api/v1/:objectName/:id 更新记录
         * @apiVersion 0.0.0
         * @apiName update
         * @apiGroup @steedos/service-rest
         * @apiParam {String} objectName 对象API Name，如：contracts
         * @apiParam {String} id 记录id，如：5e7d1b9b9c9d4400001d1b9b
         * @apiBody {Object} doc 更新的内容，如：{ name: 'test', description: 'test' }
         * @apiSuccess {Object} record  新记录信息
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       "status": 0, // 返回 0，表示当前接口正确返回，否则按错误请求处理
         *       "msg": "", // 返回接口处理信息
         *       "data": {
         *          "_id": "5a6b1c3c8d6d1d0b7c6d1d0b",
         *          "name": "",
         *          ...
         *        }
         *       }
         *     }
         * @apiErrorExample {json} Error-Response:
         *     HTTP/1.1 500 Error
         *     {
         *       "status": -1,
         *       "msg": "",
         *       "data": {}
         *     }
         */
        update: {
            rest: {
                method: "PUT",
                path: "/:objectName/:id"
            },
            params: {
                objectName: { type: "string" },
                id: { type: "any" },
                doc: { type: "object" }
            },
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { objectName, id, doc } = ctx.params;
                let data = '';
                if (_.isString(doc)) {
                    data = JSON.parse(doc);
                } else {
                    data = JSON.parse(JSON.stringify(doc));
                }
                delete data.space;
                const newDoc = await this.update(objectName, id, data, userSession)
                return {
                    "status": REQUEST_SUCCESS_STATUS,
                    "msg": "",
                    "data": newDoc
                }
            }
        },
        /**
         * @api {DELETE} /api/v1/:objectName/:id 删除记录
         * @apiVersion 0.0.0
         * @apiName delete
         * @apiGroup @steedos/service-rest
         * @apiParam {String} objectName 对象API Name，如：contracts
         * @apiParam {String} id 记录id，如：5e7d1b9b9c9d4400001d1b9b
         * @apiSuccess {Object} record  新记录信息
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       "status": 0, // 返回 0，表示当前接口正确返回，否则按错误请求处理
         *       "msg": "", // 返回接口处理信息
         *       "data": {
         *          "_id": "5a6b1c3c8d6d1d0b7c6d1d0b",
         *        }
         *       }
         *     }
         * @apiErrorExample {json} Error-Response:
         *     HTTP/1.1 500 Error
         *     {
         *       "status": -1,
         *       "msg": "",
         *       "data": {}
         *     }
         */
        delete: {
            rest: {
                method: "DELETE",
                path: "/:objectName/:id"
            },
            params: {
                objectName: { type: "string" },
                id: { type: "any" }
            },
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { objectName, id } = ctx.params;
                const objectConfig = await getObject(objectName).getConfig()
                const enableTrash = objectConfig.enable_trash
                if (!enableTrash) {
                    await this.delete(objectName, id, userSession)
                } else {
                    const data = {
                        is_deleted: true,
                        deleted: new Date(),
                        deleted_by: userSession ? userSession.userId : null
                    }
                    await this.update(objectName, id, data, userSession)
                }
                return {
                    "status": REQUEST_SUCCESS_STATUS,
                    "msg": "",
                    "data": {
                        "_id": id
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

    },

    /**
     * Service stopped lifecycle event handler
     */
    async stopped() {

    }
};
