import { SteedosObjectType } from '../types/object';
import { getDataSource } from '../types/datasource';
import { getObjectConfig } from '../types/object_dynamic_load';
// import { parse } from '@steedos/formula';
// mongodb pipeline: https://docs.mongodb.com/manual/core/aggregation-pipeline/
type externalPipelineItem = {
    [mongodPipeline: string]: any
}
function getObjectServiceMethodsSchema() {
    const methods = {
        aggregate: {
            async handler(query, externalPipeline: Array<externalPipelineItem>, userSession) {
                return await this.object.aggregate(query, externalPipeline, userSession)
            }
        },
        find: {
            async handler(query, userSession) {
                return await this.object.find(query, userSession)
            }
        },
        findOne: {
            async handler(id: string, query, userSession) {
                return await this.object.findOne(id, query, userSession)
            }
        },
        insert: {
            async handler(doc, userSession) {
                return await this.object.insert(doc, userSession)
            }
        },
        updateOne: {
            async handler(id, doc, userSession) {
                return await this.object.updateOne(id, doc, userSession)
            }
        },
        updateMany: {
            async handler(queryFilters, doc, userSession) {
                return await this.object.updateMany(queryFilters, doc, userSession)
            }
        },
        delete: {
            async handler(id, userSession) {
                return await this.object.delete(id, userSession)
            }
        },
        directAggregate: {
            async handler(query, externalPipeline: Array<externalPipelineItem>, userSession) {
                return await this.object.directAggregate(query, externalPipeline, userSession)
            }
        },
        directAggregatePrefixalPipeline: {
            async handler(query, externalPipeline: Array<externalPipelineItem>, userSession) {
                return await this.object.directAggregatePrefixalPipeline(query, externalPipeline, userSession)
            }
        },
        directFind: {
            async handler(query, userSession) {
                return await this.object.directFind(query, userSession)
            }
        },
        directInsert: {
            async handler(doc, userSession) {
                return await this.object.directInsert(doc, userSession)
            }
        },
        directUpdate: {
            async handler(id, doc, userSession) {
                return await this.object.directUpdate(id, doc, userSession)
            }
        },
        directDelete: {
            async handler(id, userSession) {
                return await this.object.directDelete(id, userSession)
            }
        },
        getField: {
            handler(fieldName) {
                return this.object.getField(fieldName)
            }
        },
        toConfig: {
            handler() {
                return this.object.toConfig()
            }
        }
    };

    return methods;
}
//TODO 添加rest、params
function getObjectServiceActionsSchema() {
    const actions: any = {
        aggregate: {
            rest: {
                method: "GET",
                path: "/aggregate"
            },
            params: {
                query: { type: "object" },
                externalPipeline: { type: "array", items: "object" }
            },
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { query, externalPipeline } = ctx.params;
                return await this.aggregate(query, externalPipeline, userSession)
            }
        },
        find: {
            rest: {
                method: "GET",
                path: "/find"
            },
            params: {
                query: { type: "object" }
            },
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { query } = ctx.params;
                return this.find(query, userSession)
            }
        },
        findOne: {
            rest: {
                method: "GET",
                path: "/findOne"
            },
            params: {
                id: { type: "any" },
                query: { type: "object" }
            },
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { id, query } = ctx.params;
                return this.findOne(id, query, userSession)
            }
        },
        insert: {
            rest: {
                method: "POST",
                path: "/insert"
            },
            params: {
                doc: { type: "object" }
            },
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { doc } = ctx.params;
                return this.insert(doc, userSession)
            }
        },
        updateOne: {
            rest: {
                method: "PUT",
                path: "/updateOne"
            },
            params: {
                id: { type: "any" },
                doc: { type: "object" }
            },
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { id, doc } = ctx.params;
                return this.updateOne(id, doc, userSession)
            }
        },
        updateMany: {
            rest: {
                method: "PUT",
                path: "/updateMany"
            },
            params: {
                queryFilters: { type: "array", items: "array|string" },
                doc: { type: "object" }
            },
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { queryFilters, doc } = ctx.params;
                return this.updateMany(queryFilters, doc, userSession)
            }
        },
        delete: {
            rest: {
                method: "DELETE",
                path: "/delete"
            },
            params: {
                id: { type: "any" }
            },
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { id } = ctx.params;
                return this.delete(id, userSession)
            }
        },
        directAggregate: {
            rest: {
                method: "GET",
                path: "/directAggregate"
            },
            params: {
                query: { type: "object" },
                externalPipeline: { type: "array", items: "object" }
            },
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { query, externalPipeline } = ctx.params;
                return this.directAggregate(query, externalPipeline, userSession)
            }
        },
        directAggregatePrefixalPipeline: {
            rest: {
                method: "GET",
                path: "/directAggregatePrefixalPipeline"
            },
            params: {
                query: { type: "object" },
                prefixalPipeline: { type: "array", items: "object" }
            },
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { query, prefixalPipeline } = ctx.params;
                return this.directAggregatePrefixalPipeline(query, prefixalPipeline, userSession)
            }
        },
        directFind: {
            rest: {
                method: "GET",
                path: "/directFind"
            },
            params: {
                query: { type: "object" },
            },
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { query } = ctx.params;
                return this.directAggregate(query, userSession)
            }
        },
        directInsert: {
            rest: {
                method: "POST",
                path: "/directInsert"
            },
            params: {
                doc: { type: "object" }
            },
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { doc } = ctx.params;
                return this.directInsert(doc, userSession)
            }
        },
        directUpdate: {
            rest: {
                method: "PUT",
                path: "/directUpdate"
            },
            params: {
                id: { type: "any" },
                doc: { type: "object" }
            },
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { id, doc } = ctx.params;
                return this.directUpdate(id, doc, userSession)
            }
        },
        directDelete: {
            rest: {
                method: "DELETE",
                path: "/directDelete"
            },
            params: {
                id: { type: "any" },
            },
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { id } = ctx.params;
                return this.directDelete(id, userSession)
            }
        },
        getField: {
            rest: {
                method: "GET",
                path: "/getField"
            },
            params: {
                fieldName: { type: "string" },
            },
            async handler(ctx) {
                const { fieldName } = ctx.params;
                return this.getField(fieldName)
            }
        },
        toConfig: {
            rest: {
                method: "GET",
                path: "/toConfig"
            },
            async handler(ctx) {
                return this.toConfig()
            }
        }
    };
    return actions;
}

export function getObjectServiceSchema(serviceName, objectConfig) {
    return {
        name: serviceName,
        actions: getObjectServiceActionsSchema(),
        methods: getObjectServiceMethodsSchema(),
        created() {
            this.object = new SteedosObjectType(objectConfig.name, getDataSource(objectConfig.datasource), objectConfig);
        }
    }
}

module.exports = {
    name: '#_objectBaseService', //TODO
    settings: {
        // objectApiName:  //TODO
        // objectConfig
    },
    actions: getObjectServiceActionsSchema(),
    methods: getObjectServiceMethodsSchema(),
    created(broker) {
        // console.log('this.settings', this.settings);
        if (!this.settings.objectApiName && !this.settings.objectConfig) {
            throw new Error('Please set the settings.objectApiName.')
        }
        const objectConfig: any = this.settings.objectConfig || getObjectConfig(this.settings.objectApiName);
        if (!objectConfig) {
            throw new Error('Not found object config by objectApiName.')
        }
        this.object = new SteedosObjectType(objectConfig.name, getDataSource(objectConfig.datasource), objectConfig);
    }
}