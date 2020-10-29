import { JsonMap, Dictionary } from "@salesforce/ts-types";
import { SteedosDriver, SteedosFieldDBType } from "./index"
import { MongoClient, ObjectId } from "mongodb";
import { SteedosQueryOptions, SteedosQueryFilters } from "../types/query";
import { SteedosIDType } from "../types";
import { SteedosDriverConfig } from "./driver";
import { formatFiltersToODataQuery } from "@steedos/filters";
import { createFilter, createQuery } from 'odata-v4-mongodb';
import _ = require("underscore");
import { wrapAsync } from '../util';

export class SteedosMongoDriver implements SteedosDriver {
    _url: string;
    _client: any;
    _config: SteedosDriverConfig;
    _collections: Dictionary<any>;

    constructor(config: SteedosDriverConfig) {
        this._collections = {};
        this._config = config;
        this._url = this.buildConnectionUrl();
    }

    /**
     * Builds connection url that is passed to underlying driver to perform connection to the mongodb database.
     */
    protected buildConnectionUrl(): string {
        if (this._config.url)
            return this._config.url;

        const credentialsUrlPart = (this._config.username && this._config.password)
            ? `${this._config.username}:${this._config.password}@`
            : "";
        if (!this._config.database) {
            throw new Error('Not find database');
        }
        return `mongodb://${credentialsUrlPart}${this._config.host || "127.0.0.1"}:${this._config.port || "27017"}/${this._config.database}`;
    }

    async init() {

    }

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

    async connect() {
        if (!this._client) {
            this._client = await MongoClient.connect(this._url, { useNewUrlParser: true, useUnifiedTopology: true });
            return true;
        }
    }

    async close() {
        if (this._client) {
            await this._client.close();
            this._client = null;
            return true;
        }
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
        if(!odataQuery){
            return emptyFilters;
        }
        let query: JsonMap = createFilter(odataQuery);
        return query;
    }

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

    getMongoOptions(options: SteedosQueryOptions): JsonMap {
        if (_.isUndefined(options)) {
            return {};
        }
        let result: JsonMap = {};
        let projection: JsonMap = this.getMongoFieldsOptions(options.fields);
        let sort: JsonMap = this.getMongoSortOptions(options.sort);
        result.projection = projection;
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

    collection(name: string) {
        if (!this._collections[name]) {
            let db = this._client.db();
            let locale = this._config.locale;
            if (locale) {
                wrapAsync(function () {
                    return db.createCollection(name, {
                        'collation': { 'locale': locale }
                    })
                }, {})
            }

            this._collections[name] = db.collection(name);
        }
        return this._collections[name];
    };

    async find(tableName: string, query: SteedosQueryOptions) {
        await this.connect();
        let collection = this.collection(tableName);

        let mongoFilters = this.getMongoFilters(query.filters);
        let mongoOptions = this.getMongoOptions(query);
        let result = await collection.find(mongoFilters, mongoOptions).toArray();

        return result;
    }

    async aggregate(tableName: string, query: SteedosQueryOptions, externalPipeline: any[]) {
        await this.connect();
        let collection = this.collection(tableName);
        let pipeline = [];

        let mongoFilters = this.getMongoFilters(query.filters);
        let aggregateOptions = this.getAggregateOptions(query);

        pipeline.push({ $match: mongoFilters });

        pipeline = pipeline.concat(aggregateOptions).concat(externalPipeline);

        let result = await collection.aggregate(pipeline).toArray();

        return result;
    }

    async count(tableName: string, query: SteedosQueryOptions) {
        await this.connect();
        let collection = this.collection(tableName);

        let mongoFilters = this.getMongoFilters(query.filters);
        let mongoOptions = this.getMongoOptions(query);
        let result = await collection.find(mongoFilters, mongoOptions).count();

        return result;
    }

    async findOne(tableName: string, id: SteedosIDType, query: SteedosQueryOptions) {
        await this.connect();
        let collection = this.collection(tableName);
        let mongoOptions = this.getMongoOptions(query);
        let mongoFilters = this.getMongoFilters(query.filters);
        let selector = { _id: id };
        if (!_.isEmpty(mongoFilters)) {
            selector = Object.assign(mongoFilters, selector);
        }
        let result = await collection.findOne(selector, mongoOptions);

        return result;
    }

    async insert(tableName: string, data: Dictionary<any>) {
        await this.connect();
        data._id = data._id || new ObjectId().toHexString();
        let collection = this.collection(tableName);
        let result = await collection.insertOne(data);
        return result.ops[0];
    }

    async update(tableName: string, id: SteedosIDType | SteedosQueryOptions, data: Dictionary<any>) {
        if (_.isEmpty(data)) {
            throw new Error("the params 'data' must not be empty");
        }
        await this.connect();
        let collection = this.collection(tableName);
        let selector;
        if (_.isObject(id)) {
            selector = this.getMongoFilters(id['filters']);
        } else {
            selector = { _id: id };
        }
        let result = await collection.updateOne(selector, { $set: data });
        if (result.result.ok) {
            result = await collection.findOne(selector);
            return result;
        }
    }

    async updateOne(tableName: string, id: SteedosIDType | SteedosQueryOptions, data: Dictionary<any>) {
        if (_.isEmpty(data)) {
            throw new Error("the params 'data' must not be empty");
        }
        await this.connect();
        let collection = this.collection(tableName);
        let selector;
        if (_.isObject(id)) {
            selector = this.getMongoFilters(id['filters']);
        } else {
            selector = { _id: id };
        }
        let result = await collection.updateOne(selector, { $set: data });
        if (result.result.ok) {
            result = await collection.findOne(selector);
            return result;
        }
    }

    async updateMany(tableName: string, queryFilters: SteedosQueryFilters, data: Dictionary<any>) {
        if (_.isEmpty(data)) {
            throw new Error("the params 'data' must not be empty");
        }
        await this.connect();
        let collection = this.collection(tableName);
        let mongoFilters = this.getMongoFilters(queryFilters);
        return await collection.update(mongoFilters, { $set: data }, { multi: true });
    }

    async delete(tableName: string, id: SteedosIDType | SteedosQueryOptions) {
        await this.connect();
        let collection = this.collection(tableName);
        let selector;
        if (_.isObject(id)) {
            selector = this.getMongoFilters(id['filters']);
        } else {
            selector = { _id: id };
        }
        await collection.deleteOne(selector);
    }

    async directInsert(tableName: string, data: Dictionary<any>) {
        return this.insert(tableName, data)
    }

    async directUpdate(tableName: string, id: SteedosIDType | SteedosQueryOptions, data: Dictionary<any>) {
        return this.update(tableName, id, data)
    }

    async directDelete(tableName: string, id: SteedosIDType | SteedosQueryOptions) {
        return this.delete(tableName, id)
    }

}