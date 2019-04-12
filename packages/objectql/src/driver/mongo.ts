import { JsonMap, Dictionary } from "@salesforce/ts-types";
import { SteedosDriver, SteedosColumnType } from "./index"
import { MongoClient, ObjectId } from "mongodb";
import { SteedosQueryOptions, SteedosQueryFilters } from "../types/query";
import { SteedosIDType } from "../types";
import { SteedosDriverConfig } from "./driver";
import { formatFiltersToODataQuery } from "@steedos/filters";
import { createFilter, createQuery } from 'odata-v4-mongodb';
import _ = require("underscore");

export class SteedosMongoDriver implements SteedosDriver {
    _url: string;
    _client: any;
    _collections: Dictionary<any>;

    constructor(config: SteedosDriverConfig) {
        this._collections = {};
        this._url = config.url;
    }

    getSupportedColumnTypes() {
        return [
            SteedosColumnType.varchar, 
            SteedosColumnType.text, 
            SteedosColumnType.number,
            SteedosColumnType.money,
            SteedosColumnType.boolean,
            SteedosColumnType.date,
            SteedosColumnType.dateTime,
            SteedosColumnType.json,
            SteedosColumnType.array,
            SteedosColumnType.oneToOne,
            SteedosColumnType.oneToMany,
            SteedosColumnType.manyToOne,
            SteedosColumnType.manyToMany
        ]
    }

    async connect() {
        if (!this._client) {
            this._client = await MongoClient.connect(this._url, { useNewUrlParser: true });
            return true;
        }
    }

    async disconnect() {
        if (this._client) {
            await this._client.disconnect();
            this._client = null;
            return true;
        }
    }

    formatFiltersToMongoQuery(filters: any): JsonMap {
        let odataQuery: string = formatFiltersToODataQuery(filters)
        let query: JsonMap = createFilter(odataQuery)
        return query;
    }

    getMongoFilters(filters: SteedosQueryFilters): JsonMap {
        if (_.isUndefined(filters)) {
            return {}
        }
        if (_.isString(filters))
            return createFilter(filters)
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

    collection(name: string) {
        if (!this._collections[name]) {
            this._collections[name] = this._client.db().collection(name);
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

        let result = await collection.findOne({ _id: id }, mongoOptions);

        return result;
    }

    async insert(tableName: string, data: JsonMap) {
        await this.connect();
        data._id = data._id || new ObjectId().toHexString();
        let collection = this.collection(tableName);
        let result = await collection.insertOne(data);
        return result.ops[0];
    }

    async update(tableName: string, id: SteedosIDType, data: JsonMap) {
        await this.connect();
        let collection = this.collection(tableName);
        let result = await collection.updateOne({ _id: id }, {$set: data});
        return result.result.ok;
    }

    async delete(tableName: string, id: SteedosIDType) {
        await this.connect();
        let collection = this.collection(tableName);
        let result = await collection.deleteOne({ _id: id })
        return result.deletedCount;
    }

}