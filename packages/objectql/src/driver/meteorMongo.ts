import { JsonMap, Dictionary } from "@salesforce/ts-types";
import { SteedosDriver } from "./index"
import { SteedosQueryOptions, SteedosQueryFilters } from "../types/query";
import { SteedosIDType } from "../types";
import { SteedosDriverConfig } from "./driver";
import { formatFiltersToODataQuery } from "@steedos/filters";
import { createFilter } from 'odata-v4-mongodb';
import { createQuery } from 'odata-v4-mongodb';
import _ = require("underscore");
import { SteedosFieldDBType } from "./fieldDBType";

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
    disconnect() {
    }

    init() {

    }

    constructor(config: SteedosDriverConfig) {
    }

    formatFiltersToMongoQuery(filters: any): JsonMap {
        let odataQuery: string = "";
        if (_.isString(filters)) {
            odataQuery = filters;
        }
        else {
            odataQuery = formatFiltersToODataQuery(filters)
        }
        let query: JsonMap = createFilter(odataQuery)
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
                        let selector = { _id: id };
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
                        let recordId = collection.insert(data);
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
                    let result = DDP._CurrentInvocation.withValue(invocation, function () {
                        collection.update(selector, { $set: data });
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
                        collection.update(selector, { $set: data });
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
                        return collection.update(mongoFilters, { $set: data }, { multi: true });
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

}