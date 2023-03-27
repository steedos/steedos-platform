/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2023-03-23 15:12:14
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2023-03-27 17:15:39
 * @Description: 
 */
"use strict";
// @ts-check

const { getObject } = require('@steedos/objectql');

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
module.exports = {
    name: 'objectql',
    namespace: "steedos",
    mixins: [],

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
        aggregate: {
            params: {
                objectName: { type: "string" },
                query: { type: "object" },
                externalPipeline: { type: "array", items: "object" }
            },
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { objectName, query, externalPipeline } = ctx.params;
                const obj = getObject(objectName)
                return await obj.aggregate(query, externalPipeline, userSession)
            }
        },
        find: {
            params: {
                objectName: { type: "string" },
                query: {
                    type: "object",
                    props: {
                        fields: { type: 'array', items: "string", optional: true },
                        filters: [{ type: 'array', optional: true }, { type: 'string', optional: true }],
                        top: { type: 'number', optional: true },
                        skip: { type: 'number', optional: true },
                        sort: { type: 'string', optional: true }
                    }
                },
            },
            async handler(ctx) {
                this.broker.logger.info('objectql.find', ctx.params)
                const { objectName, query } = ctx.params
                const obj = getObject(objectName)
                const userSession = ctx.meta.user;
                return await obj.find(query, userSession)
            }
        },
        count: {
            params: {
                objectName: { type: "string" },
                query: {
                    type: "object",
                    props: {
                        fields: { type: 'array', items: "string", optional: true },
                        filters: [{ type: 'array', optional: true }, { type: 'string', optional: true }],
                        top: { type: 'number', optional: true },
                        skip: { type: 'number', optional: true },
                        sort: { type: 'string', optional: true }
                    }
                }
            },
            async handler(ctx) {
                this.broker.logger.info('objectql.count', ctx.params)
                const { objectName, query } = ctx.params
                const obj = getObject(objectName)
                const userSession = ctx.meta.user;
                return await obj.count(query, userSession)
            }
        },
        findOne: {
            params: {
                objectName: { type: "string" },
                id: { type: "any" },
                query: { type: "object", optional: true }
            },
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { objectName, id, query } = ctx.params;
                const obj = getObject(objectName)
                return await obj.findOne(id, query, userSession)
            }
        },
        insert: {
            params: {
                objectName: { type: "string" },
                doc: { type: "object" }
            },
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { objectName, doc } = ctx.params;
                const obj = getObject(objectName)
                let data = '';
                if (_.isString(doc)) {
                    data = JSON.parse(doc);
                } else {
                    data = JSON.parse(JSON.stringify(doc));
                }
                if (userSession && obj.getField('space')) {
                    data.space = userSession.spaceId;
                }
                return await obj.insert(data, userSession)
            }
        },
        update: {
            params: {
                objectName: { type: "string" },
                id: { type: "any" },
                doc: { type: "object" }
            },
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { objectName, id, doc } = ctx.params;
                const obj = getObject(objectName)
                let data = '';
                if (_.isString(doc)) {
                    data = JSON.parse(doc);
                } else {
                    data = JSON.parse(JSON.stringify(doc));
                }
                delete data.space;
                return await obj.update(id, data, userSession)
            }
        },
        updateOne: {
            params: {
                objectName: { type: "string" },
                id: { type: "any" },
                doc: { type: "object" }
            },
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { objectName, id, doc } = ctx.params;
                const obj = getObject(objectName)
                let data = '';
                if (_.isString(doc)) {
                    data = JSON.parse(doc);
                } else {
                    data = JSON.parse(JSON.stringify(doc));
                }
                delete data.space;
                return await obj.updateOne(id, data, userSession)
            }
        },
        updateMany: {
            params: {
                objectName: { type: "string" },
                queryFilters: { type: "array", items: "any" },
                doc: { type: "object" }
            },
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { objectName, queryFilters, doc } = ctx.params;
                const obj = getObject(objectName)
                let data = '';
                if (_.isString(doc)) {
                    data = JSON.parse(doc);
                } else {
                    data = JSON.parse(JSON.stringify(doc));
                }
                delete data.space;
                return await obj.updateMany(queryFilters, data, userSession)
            }
        },
        delete: {
            params: {
                objectName: { type: "string" },
                id: { type: "any" }
            },
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { objectName, id } = ctx.params;
                const obj = getObject(objectName)
                const enableTrash = obj.enable_trash
                if (!enableTrash) {
                    return await obj.delete(id, userSession)
                } else {
                    const data = {
                        is_deleted: true,
                        deleted: new Date(),
                        deleted_by: userSession ? userSession.userId : null
                    }
                    return await obj.update(id, data, userSession)
                }
            }
        },
        directAggregate: {
            params: {
                objectName: { type: "string" },
                query: { type: "object" },
                externalPipeline: { type: "array", items: "object" }
            },
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { objectName, query, externalPipeline } = ctx.params;
                const obj = getObject(objectName)
                return await obj.directAggregate(query, externalPipeline, userSession)
            }
        },
        directAggregatePrefixalPipeline: {
            params: {
                objectName: { type: "string" },
                query: { type: "object" },
                prefixalPipeline: { type: "array", items: "object" }
            },
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { objectName, query, prefixalPipeline } = ctx.params;
                const obj = getObject(objectName)
                return await obj.directAggregatePrefixalPipeline(query, prefixalPipeline, userSession)
            }
        },
        directFind: {
            params: {
                objectName: { type: "string" },
                query: {
                    type: "object",
                    props: {
                        fields: { type: 'array', items: "string", optional: true },
                        filters: [{ type: 'array', optional: true }, { type: 'string', optional: true }],
                        top: { type: 'number', optional: true },
                        skip: { type: 'number', optional: true },
                        sort: { type: 'string', optional: true }
                    }
                }
            },
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { objectName, query } = ctx.params;
                const obj = getObject(objectName)
                return await obj.directFind(query, userSession)
            }
        },
        directInsert: {
            params: {
                objectName: { type: "string" },
                doc: { type: "object" }
            },
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { objectName, doc } = ctx.params;
                const obj = getObject(objectName)
                return await obj.directInsert(doc, userSession)
            }
        },
        directUpdate: {
            params: {
                objectName: { type: "string" },
                id: { type: "any" },
                doc: { type: "object" }
            },
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { objectName, id, doc } = ctx.params;
                const obj = getObject(objectName)
                return await obj.directUpdate(id, doc, userSession)
            }
        },
        directDelete: {
            params: {
                objectName: { type: "string" },
                id: { type: "any" },
            },
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { objectName, id } = ctx.params;
                const obj = getObject(objectName)
                return await obj.directDelete(id, userSession)
            }
        },
        getField: {
            params: {
                objectName: { type: "string" },
                fieldApiName: { type: "string" },
            },
            async handler(ctx) {
                const { objectName, fieldApiName } = ctx.params;
                const obj = getObject(objectName)
                return obj.getField(fieldApiName).toConfig()
            }
        },
        getFields: {
            params: {
                objectName: { type: "string" },
            },
            async handler(ctx) {
                const { objectName } = ctx.params;
                const obj = getObject(objectName)
                return obj.toConfig().fields
            }
        },
        getNameFieldKey: {
            params: {
                objectName: { type: "string" },
            },
            async handler(ctx) {
                const { objectName } = ctx.params;
                const obj = getObject(objectName)
                return obj.getNameFieldKey()
            }
        },
        toConfig: {
            params: {
                objectName: { type: "string" },
            },
            async handler(ctx) {
                const { objectName } = ctx.params;
                const obj = getObject(objectName)
                return obj.toConfig()
            }
        },
        getConfig: {
            params: {
                objectName: { type: "string" },
            },
            async handler(ctx) {
                const { objectName } = ctx.params;
                const obj = getObject(objectName)
                return obj.getConfig()
            }
        },
        getUserObjectPermission: {
            params: {
                objectName: { type: "string" },
            },
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { objectName } = ctx.params;
                const obj = getObject(objectName)
                return obj.getUserObjectPermission(userSession)
            }
        },
        isEnableAudit: {
            params: {
                objectName: { type: "string" },
            },
            async handler() {
                const { objectName } = ctx.params;
                const obj = getObject(objectName)
                return obj.isEnableAudit();
            }
        },
        _makeNewID: {
            params: {
                objectName: { type: "string" },
            },
            async handler() {
                const { objectName } = ctx.params;
                const obj = getObject(objectName)
                return await obj._makeNewID();
            }
        },
        getRecordAbsoluteUrl: {
            params: {
                objectName: { type: "string" },
            },
            async handler() {
                const { objectName } = ctx.params;
                const obj = getObject(objectName)
                return obj.getRecordAbsoluteUrl();
            }
        },
        getGridAbsoluteUrl: {
            params: {
                objectName: { type: "string" },
            },
            async handler() {
                const { objectName } = ctx.params;
                const obj = getObject(objectName)
                return obj.getGridAbsoluteUrl();
            }
        },
        getRecordPermissionsById: {
            params: {
                objectName: { type: "string" },
                recordId: { type: "string" },
            },
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { objectName, recordId } = ctx.params;
                const obj = getObject(objectName)
                const record = await obj.findOne(recordId)
                return obj.getRecordPermissions(record, userSession);
            }
        },
        getRecordPermissions: {
            params: {
                objectName: { type: "string" },
                record: { type: "object" },
            },
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { objectName, record } = ctx.params;
                const obj = getObject(objectName)
                return obj.getRecordPermissions(record, userSession);
            }
        },
        getRecordView: {
            params: {
                objectName: { type: "string" },
                context: { type: "object", optional: true },
            },
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { objectName, context } = ctx.params;
                const obj = getObject(objectName)
                return await obj.getRecordView(userSession, context);
            }
        },
        createDefaultRecordView: {
            params: {
                objectName: { type: "string" },
            },
            async handler(ctx) {
                const userSession = ctx.meta.user;
                if (!userSession.is_space_admin) {
                    throw new Error('no permission.')
                }
                const { objectName } = ctx.params;
                const obj = getObject(objectName)
                return await obj.createDefaultRecordView(userSession);
            }
        },
        getDefaultRecordView: {
            params: {
                objectName: { type: "string" },
            },
            async handler(ctx) {
                const userSession = ctx.meta.user;
                if (!userSession.is_space_admin) {
                    throw new Error('no permission.')
                }
                const { objectName } = ctx.params;
                const obj = getObject(objectName)
                return await obj.getDefaultRecordView(userSession);
            }
        },
        getRelateds: {
            params: {
                objectName: { type: "string" },
            },
            async handler(ctx) {
                const { objectName } = ctx.params;
                const obj = getObject(objectName)
                return await obj.getRelateds();
            }
        },
        refreshIndexes: {
            params: {
                objectName: { type: "string" },
            },
            async handler(ctx) {
                const { objectName } = ctx.params;
                const obj = getObject(objectName)
                return await obj.refreshIndexes();
            }
        },
        allowRead: {
            params: {
                objectName: { type: "string" },
            },
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { objectName } = ctx.params;
                const obj = getObject(objectName)
                return await obj.allowRead(userSession);
            }
        },
        allowInsert: {
            params: {
                objectName: { type: "string" },
            },
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { objectName } = ctx.params;
                const obj = getObject(objectName)
                return await obj.allowInsert(userSession);
            }
        },
        allowUpdate: {
            params: {
                objectName: { type: "string" },
            },
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { objectName } = ctx.params;
                const obj = getObject(objectName)
                return await obj.allowUpdate(userSession);
            }
        },
        allowDelete: {
            params: {
                objectName: { type: "string" },
            },
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { objectName } = ctx.params;
                const obj = getObject(objectName)
                return await obj.allowDelete(userSession);
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
