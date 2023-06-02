import { JsonMap, Dictionary } from "@salesforce/ts-types";
import { SteedosDriver } from "./index"
import { SteedosQueryOptions, SteedosQueryFilters } from "../types/query";
import { SteedosIDType, SteedosObjectType } from "../types";
import { SteedosDriverConfig } from "./driver";
import { formatFiltersToODataQuery } from "@steedos/filters";
import { createFilter, createQuery } from '@steedos/odata-v4-mongodb';
import _ = require("underscore");
import { SteedosFieldDBType } from "./fieldDBType";
import { ObjectId } from "mongodb";
import { formatRecord } from './format';

var Fiber = require('fibers');

declare var Creator: any;
declare var DDP: any;
declare var DDPCommon: any;

export class SteedosMeteorMongoDriver implements SteedosDriver {

    getSupportedColumnTypes() {
        return [
            SteedosFieldDBType.varchar,
            SteedosFieldDBType.text,
            SteedosFieldDBType.number,
            SteedosFieldDBType.boolean,
            SteedosFieldDBType.date,
            SteedosFieldDBType.dateTime,
            SteedosFieldDBType.json,
            SteedosFieldDBType.array
        ]
    }

    connect() {
    }
    close() {
    }

    async init() {

    }

    constructor(config: SteedosDriverConfig) {
    }

    formatFiltersToMongoQuery(filters: any): JsonMap {
        let emptyFilters = {};
        let odataQuery: string = "";
        if (_.isString(filters)) {
            odataQuery = filters;
        }
        else {
            odataQuery = formatFiltersToODataQuery(filters)
        }
        if (!odataQuery) {
            return emptyFilters;
        }
        let query: JsonMap = createFilter(odataQuery);
        return query;
    }

    /* TODO： */
    getMongoFilters(filters: SteedosQueryFilters): JsonMap {
        let emptyFilters = {};
        if (_.isUndefined(filters)) {
            return emptyFilters;
        }
        if (_.isString(filters) && !filters.length) {
            return emptyFilters
        }
        if (_.isArray(filters) && !filters.length) {
            return emptyFilters
        }
        let mongoFilters: JsonMap = this.formatFiltersToMongoQuery(filters);
        return mongoFilters
    }

    getMongoFieldsOptions(fields: string[] | string): JsonMap {
        if (typeof fields == "string") {
            fields = (<string>fields).split(",").map((n) => { return n.trim(); });
        }
        if (!(fields && fields.length)) {
            // throw new Error("fields must not be undefined or empty");
            return {}
        }
        let projection: JsonMap = {};
        (<string[]>fields).forEach((field) => {
            if (field) {
                projection[field] = 1;
            }
        });
        return projection;
    }

    getMongoSortOptions(sort: string): JsonMap {
        let result: JsonMap = undefined;
        if (sort && typeof sort === "string") {
            let arraySort: string[] = sort.split(",").map((n) => { return n.trim(); });
            let stringSort: string = "";
            arraySort.forEach((n) => {
                if (n) {
                    stringSort += `${n},`
                }
            });
            stringSort = stringSort.replace(/,$/g, "");
            result = createQuery(`$orderby=${stringSort}`).sort;
        }
        return result;
    }

    /* TODO： */
    getMongoOptions(options: SteedosQueryOptions): JsonMap {
        if (_.isUndefined(options)) {
            return {};
        }
        let result: JsonMap = {};
        let projection: JsonMap = this.getMongoFieldsOptions(options.fields);
        let sort: JsonMap = this.getMongoSortOptions(options.sort);
        result.fields = projection;
        result.sort = sort;
        result.limit = options.top;
        result.skip = options.skip;
        return result;
    }

    getAggregateOptions(options: SteedosQueryOptions): any[] {
        if (_.isUndefined(options)) {
            return [];
        }
        let result = [];
        let projection: JsonMap = this.getMongoFieldsOptions(options.fields);
        let sort: JsonMap = this.getMongoSortOptions(options.sort);
        if (!_.isEmpty(projection)) {
            result.push({ $project: projection });
        }
        if (!_.isEmpty(sort)) {
            result.push({ $sort: sort });
        }
        if (options.skip) {
            result.push({ $skip: options.skip });
        }
        if (options.top) {
            result.push({ $limit: options.top });
        }
        return result;
    }

    getAggregateSortOption(options: SteedosQueryOptions): any {
        if (_.isUndefined(options)) {
            return;
        }
        let sort: JsonMap = this.getMongoSortOptions(options.sort);
        if (!_.isEmpty(sort)) {
            return { $sort: sort };
        }
        return;
    }

    getAggregateProjectionOption(options: SteedosQueryOptions): any {
        if (_.isUndefined(options)) {
            return [];
        }
        let projection: JsonMap = this.getMongoFieldsOptions(options.fields);
        if (!_.isEmpty(projection)) {
            return { $project: projection };
        }
        return;
    }

    getAggregateSkipLimitOptions(options: SteedosQueryOptions): any {
        if (_.isUndefined(options)) {
            return [];
        }
        let result = [];
        if (options.skip) {
            result.push({ $skip: options.skip });
        }
        if (options.top) {
            result.push({ $limit: options.top });
        }
        return result;
    }

    collection(name: string) {
        return Creator.Collections[name];
    };

    async find(tableName: string, query: SteedosQueryOptions, userId?: SteedosIDType) {
        let collection = this.collection(tableName);

        let mongoFilters = this.getMongoFilters(query.filters);
        let mongoOptions = this.getMongoOptions(query);

        return await new Promise((resolve, reject) => {
            Fiber(function () {
                try {
                    let invocation = new DDPCommon.MethodInvocation({
                        isSimulation: true,
                        userId: userId,
                        connection: null,
                        randomSeed: DDPCommon.makeRpcSeed()
                    })
                    let result = DDP._CurrentInvocation.withValue(invocation, function () {
                        return collection.find(mongoFilters, mongoOptions).fetch();
                    })
                    resolve(result);
                } catch (error) {
                    reject(error)
                }
            }).run()
        });
    }

    async aggregate(tableName: string, query: SteedosQueryOptions, externalPipeline: any[], userId?: SteedosIDType) {
        let collection = this.collection(tableName);
        let rawCollection = collection.rawCollection();
        let pipeline = [];

        let mongoFilters = this.getMongoFilters(query.filters);
        let sortOption = this.getAggregateSortOption(query);
        if (sortOption) {
            pipeline.push(sortOption);
        }
        pipeline.push({ $match: mongoFilters });
        let skipLimitOptions = this.getAggregateSkipLimitOptions(query);
        if (!_.isEmpty(skipLimitOptions)) {
            pipeline = pipeline.concat(skipLimitOptions);
        }
        let projectionOption = this.getAggregateProjectionOption(query);
        if (projectionOption) {
            pipeline.push(projectionOption);
        }
        if (!_.isEmpty(externalPipeline)) {
            pipeline = pipeline.concat(externalPipeline);
        }
        return await new Promise((resolve, reject) => {
            Fiber(function () {
                try {
                    rawCollection.aggregate(pipeline).toArray(function (err, data) {
                        if (err) {
                            reject(err);
                        }
                        resolve(data);
                    });
                } catch (error) {
                    reject(error)
                }
            }).run()
        });
    }

    async directAggregate(tableName: string, query: SteedosQueryOptions, externalPipeline: any[], userId?: SteedosIDType) {
        let collection = this.collection(tableName);
        let rawCollection = collection.rawCollection();
        let pipeline = [];

        let mongoFilters = this.getMongoFilters(query.filters);
        let aggregateOptions = this.getAggregateOptions(query);

        pipeline.push({ $match: mongoFilters });

        pipeline = pipeline.concat(aggregateOptions).concat(externalPipeline);

        return await new Promise((resolve, reject) => {
            Fiber(function () {
                try {
                    rawCollection.aggregate(pipeline).toArray(function (err, data) {
                        if (err) {
                            reject(err);
                        }
                        resolve(data);
                    });
                } catch (error) {
                    reject(error)
                }
            }).run()
        });
    }

    async directAggregatePrefixalPipeline(tableName: string, query: SteedosQueryOptions, prefixalPipeline: any[], userId?: SteedosIDType) {
        let collection = this.collection(tableName);
        let rawCollection = collection.rawCollection();
        let pipeline = [];

        let mongoFilters = this.getMongoFilters(query.filters);
        let aggregateOptions = this.getAggregateOptions(query);

        pipeline.push({ $match: mongoFilters });

        // pipeline中的次序不能错，一定要先$lookup，再$match，再$project、$sort、$skip、$limit等，否则查询结果可能为空，比如公式字段中就用到了$lookup
        pipeline = prefixalPipeline.concat(pipeline).concat(aggregateOptions);

        return await new Promise((resolve, reject) => {
            Fiber(function () {
                try {
                    rawCollection.aggregate(pipeline).toArray(function (err, data) {
                        if (err) {
                            reject(err);
                        }
                        resolve(data);
                    });
                } catch (error) {
                    reject(error)
                }
            }).run()
        });
    }

    async count(tableName: string, query: SteedosQueryOptions, userId?: SteedosIDType) {
        let collection = this.collection(tableName);
        let mongoFilters = this.getMongoFilters(query.filters);
        let mongoOptions = this.getMongoOptions(query);
        return await new Promise((resolve, reject) => {
            Fiber(function () {
                try {
                    let invocation = new DDPCommon.MethodInvocation({
                        isSimulation: true,
                        userId: userId,
                        connection: null,
                        randomSeed: DDPCommon.makeRpcSeed()
                    })
                    let result = DDP._CurrentInvocation.withValue(invocation, function () {
                        return collection.find(mongoFilters, mongoOptions).count();
                    })
                    resolve(result);
                } catch (error) {
                    reject(error)
                }
            }).run()
        });
    }

    async findOne(tableName: string, id: SteedosIDType, query: SteedosQueryOptions, userId?: SteedosIDType) {
        let collection = this.collection(tableName);
        let mongoFilters = this.getMongoFilters(query.filters);
        let mongoOptions = this.getMongoOptions(query);
        let self = this;
        return await new Promise((resolve, reject) => {
            Fiber(function () {
                try {
                    let invocation = new DDPCommon.MethodInvocation({
                        isSimulation: true,
                        userId: userId,
                        connection: null,
                        randomSeed: DDPCommon.makeRpcSeed()
                    })
                    let result = DDP._CurrentInvocation.withValue(invocation, function () {
                        let selector: any = { _id: id };
                        if (_.isObject(id)) {
                            selector = self.getMongoFilters(id['filters']);
                        }
                        if (!_.isEmpty(mongoFilters)) {
                            selector = Object.assign(mongoFilters, selector);
                        }
                        return collection.findOne(selector, mongoOptions);
                    })
                    resolve(result);
                } catch (error) {
                    reject(error)
                }
            }).run()
        });
    }

    async insert(tableName: string, data: Dictionary<any>, userId?: SteedosIDType) {
        let collection = this.collection(tableName);
        return await new Promise((resolve, reject) => {
            Fiber(function () {
                try {
                    data._id = data._id || collection._makeNewID();

                    let invocation = new DDPCommon.MethodInvocation({
                        isSimulation: true,
                        userId: userId,
                        connection: null,
                        randomSeed: DDPCommon.makeRpcSeed()
                    })
                    let result = DDP._CurrentInvocation.withValue(invocation, function () {
                        let recordId = collection.insert(data, { validate: false, filter: false });
                        return collection.findOne({ _id: recordId });
                    })
                    resolve(result);
                } catch (error) {
                    reject(error)
                }

            }).run()
        });
    }

    async update(tableName: string, id: SteedosIDType | SteedosQueryOptions, data: Dictionary<any>, userId?: SteedosIDType) {
        let collection = this.collection(tableName);
        let selector;
        if (_.isObject(id)) {
            selector = this.getMongoFilters(id['filters']);
        } else {
            selector = { _id: id };
        }
        return await new Promise((resolve, reject) => {
            Fiber(function () {
                try {
                    let invocation = new DDPCommon.MethodInvocation({
                        isSimulation: true,
                        userId: userId,
                        connection: null,
                        randomSeed: DDPCommon.makeRpcSeed()
                    })

                    const options = { $set: {} };
                    const keys = _.keys(data);
                    _.each(keys, function (key) {
                        if (_.include(['$inc', '$min', '$max', '$mul'], key)) {
                            options[key] = data[key];
                        } else {
                            options.$set[key] = data[key];
                        }
                    })

                    let result = DDP._CurrentInvocation.withValue(invocation, function () {
                        collection.update(selector, options, { validate: false, filter: false });
                        return collection.findOne(selector);
                    })
                    resolve(result);
                } catch (error) {
                    reject(error)
                }
            }).run()
        });
    }

    async updateOne(tableName: string, id: SteedosIDType | SteedosQueryOptions, data: Dictionary<any>, userId?: SteedosIDType) {
        let collection = this.collection(tableName);
        let selector;
        if (_.isObject(id)) {
            selector = this.getMongoFilters(id['filters']);
        } else {
            selector = { _id: id };
        }
        return await new Promise((resolve, reject) => {
            Fiber(function () {
                try {
                    let invocation = new DDPCommon.MethodInvocation({
                        isSimulation: true,
                        userId: userId,
                        connection: null,
                        randomSeed: DDPCommon.makeRpcSeed()
                    })
                    let result = DDP._CurrentInvocation.withValue(invocation, function () {
                        collection.update(selector, { $set: data }, { validate: false, filter: false });
                        return collection.findOne(selector);
                    })
                    resolve(result);
                } catch (error) {
                    reject(error)
                }
            }).run()
        });
    }

    async updateMany(tableName: string, queryFilters: SteedosQueryFilters, data: Dictionary<any>, userId?: SteedosIDType) {
        let collection = this.collection(tableName);
        let mongoFilters = this.getMongoFilters(queryFilters);
        return await new Promise((resolve, reject) => {
            Fiber(function () {
                try {
                    let invocation = new DDPCommon.MethodInvocation({
                        isSimulation: true,
                        userId: userId,
                        connection: null,
                        randomSeed: DDPCommon.makeRpcSeed()
                    })
                    let result = DDP._CurrentInvocation.withValue(invocation, function () {
                        return collection.update(mongoFilters, { $set: data }, { multi: true, validate: false, filter: false });
                    })
                    resolve(result);
                } catch (error) {
                    reject(error)
                }
            }).run()
        });
    }

    async delete(tableName: string, id: SteedosIDType | SteedosQueryOptions, userId?: SteedosIDType) {
        let collection = this.collection(tableName);
        let selector;
        if (_.isObject(id)) {
            selector = this.getMongoFilters(id['filters']);
        } else {
            selector = { _id: id };
        }
        return await new Promise((resolve, reject) => {
            Fiber(function () {
                try {
                    let invocation = new DDPCommon.MethodInvocation({
                        isSimulation: true,
                        userId: userId,
                        connection: null,
                        randomSeed: DDPCommon.makeRpcSeed()
                    })
                    let result = DDP._CurrentInvocation.withValue(invocation, function () {
                        return collection.remove(selector);
                    })
                    resolve(result);
                } catch (error) {
                    reject(error)
                }
            }).run()
        });
    }

    async directFind(tableName: string, query: SteedosQueryOptions, userId?: SteedosIDType) {
        let collection = this.collection(tableName);

        let mongoFilters = this.getMongoFilters(query.filters);
        let mongoOptions = this.getMongoOptions(query);

        return await new Promise((resolve, reject) => {
            Fiber(function () {
                try {
                    let invocation = new DDPCommon.MethodInvocation({
                        isSimulation: true,
                        userId: userId,
                        connection: null,
                        randomSeed: DDPCommon.makeRpcSeed()
                    })
                    let result = DDP._CurrentInvocation.withValue(invocation, function () {
                        return collection.direct.find(mongoFilters, mongoOptions).fetch();
                    })
                    resolve(result);
                } catch (error) {
                    reject(error)
                }
            }).run()
        });
    }

    async directUpdate(tableName: string, id: SteedosIDType | SteedosQueryOptions, data: Dictionary<any>, userId?: SteedosIDType) {
        let collection = this.collection(tableName);
        let selector;
        if (_.isObject(id)) {
            selector = this.getMongoFilters(id['filters']);
        } else {
            selector = { _id: id };
        }
        return await new Promise((resolve, reject) => {
            Fiber(function () {
                try {
                    let invocation = new DDPCommon.MethodInvocation({
                        isSimulation: true,
                        userId: userId,
                        connection: null,
                        randomSeed: DDPCommon.makeRpcSeed()
                    })

                    const options = { $set: {} };
                    const keys = _.keys(data);
                    _.each(keys, function (key) {
                        if (_.include(['$inc', '$min', '$max', '$mul'], key)) {
                            options[key] = data[key];
                        } else {
                            options.$set[key] = data[key];
                        }
                    })

                    let result = DDP._CurrentInvocation.withValue(invocation, function () {
                        collection.direct.update(selector, options);
                        return collection.findOne(selector);
                    })
                    resolve(result);
                } catch (error) {
                    reject(error)
                }
            }).run()
        });
    }

    async directInsert(tableName: string, data: Dictionary<any>, userId?: SteedosIDType) {
        let collection = this.collection(tableName);
        return await new Promise((resolve, reject) => {
            Fiber(function () {
                try {
                    data._id = data._id || collection._makeNewID();

                    let invocation = new DDPCommon.MethodInvocation({
                        isSimulation: true,
                        userId: userId,
                        connection: null,
                        randomSeed: DDPCommon.makeRpcSeed()
                    })
                    let result = DDP._CurrentInvocation.withValue(invocation, function () {
                        let recordId = collection.direct.insert(data);
                        return collection.findOne({ _id: recordId });
                    })
                    resolve(result);
                } catch (error) {
                    reject(error)
                }

            }).run()
        });
    }

    async directDelete(tableName: string, id: SteedosIDType | SteedosQueryOptions, userId?: SteedosIDType) {
        let collection = this.collection(tableName);
        let selector;
        if (_.isObject(id)) {
            selector = this.getMongoFilters(id['filters']);
        } else {
            selector = { _id: id };
        }
        return await new Promise((resolve, reject) => {
            Fiber(function () {
                try {
                    let invocation = new DDPCommon.MethodInvocation({
                        isSimulation: true,
                        userId: userId,
                        connection: null,
                        randomSeed: DDPCommon.makeRpcSeed()
                    })
                    let result = DDP._CurrentInvocation.withValue(invocation, function () {
                        return collection.direct.remove(selector);
                    })
                    resolve(result);
                } catch (error) {
                    reject(error)
                }
            }).run()
        });
    }

    _makeNewID(tableName?: string) {
        return new ObjectId().toHexString();
    }

    formatRecord(doc: Dictionary<any>, objectConfig: SteedosObjectType){
        return formatRecord(doc, objectConfig);
    }
}