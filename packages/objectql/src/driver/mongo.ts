import { JsonMap, Dictionary } from "@salesforce/ts-types";
import { SteedosDriver } from "./index"
import { MongoClient, ObjectId } from "mongodb";
import { SteedosQueryOptions, SteedosQueryFilters } from "../types/query";
import { SteedosIDType } from "../types";
import { SteedosDriverConfig } from "./driver";
import { formatFiltersToODataQuery } from "@steedos/filters";
import { createFilter } from 'odata-v4-mongodb';
import { createQuery } from 'odata-v4-mongodb';
import _ = require("underscore");

export class SteedosMongoDriver implements SteedosDriver {
    _url: string;
    _client: any;
    _collections: Dictionary<any>;

    constructor(config: SteedosDriverConfig) {
        this._collections = {};
        this._url = config.url;
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

    formatFiltersToDev(filters: SteedosQueryFilters) {
        return filters;
    }

    formatFiltersToMongoQuery(filters: any): JsonMap {
        let odataQuery: string = formatFiltersToODataQuery(filters)
        let query: JsonMap = createFilter(odataQuery)
        return query;
    }

    /* TODO： */
    getMongoFilters(filters: SteedosQueryFilters): JsonMap {
        if (_.isUndefined(filters)) {
            return {}
        }
        if (_.isString(filters))
            return createFilter(filters)
        let mongoFilters: JsonMap = this.formatFiltersToMongoQuery(filters);
        return mongoFilters
    }

    /* TODO： */
    getMongoOptions(options: SteedosQueryOptions): JsonMap {
        if (_.isUndefined(options)) {
            return {};
        }
        let result: JsonMap = {};
        let fields: string[] | string = options.fields;
        if (typeof fields == "string"){
            fields = (<string>fields).split(",").map((n) => { return n.trim(); });
        }
        if (!(fields && fields.length)) {
            throw new Error("fields must not be undefined or empty");
        }
        let projection: JsonMap = {};
        (<string[]>fields).forEach((field) => {
            if (field){
                projection[field] = 1;
            }
        });
        let sort: JsonMap = undefined;
        if (options.sort && typeof options.sort === "string") {
            let arraySort: string[] = options.sort.split(",").map((n) => { return n.trim(); });
            let stringSort: string = "";
            arraySort.forEach((n) => {
                if (n) {
                    stringSort += `${n},`
                }
            });
            stringSort = stringSort.replace(/,$/g, "");
            sort = createQuery(`$orderby=${stringSort}`).sort;
        }
        result.projection = projection;
        result.limit = options.top;
        result.skip = options.skip;
        result.sort = sort;
        return result;
    }

    collection(name: string) {
        if (!this._collections[name]) {
            this._collections[name] = this._client.db().collection(name);
        }
        return this._collections[name];
    };

    async find(tableName: string, query: SteedosQueryOptions) {
        this.connect();
        let collection = this.collection(tableName);

        let mongoFilters = this.getMongoFilters(query.filters);
        let mongoOptions = this.getMongoOptions(query);
        let result = await collection.find(mongoFilters, mongoOptions).toArray();

        return result;
    }

    async count(tableName: string, query: SteedosQueryOptions) {
        this.connect();
        let collection = this.collection(tableName);

        let mongoFilters = this.getMongoFilters(query.filters);
        let mongoOptions = this.getMongoOptions(query);
        let result = await collection.find(mongoFilters, mongoOptions).count();

        return result;
    }

    async findOne(tableName: string, id: SteedosIDType, query: SteedosQueryOptions) {
        this.connect();
        let collection = this.collection(tableName);
        let mongoOptions = this.getMongoOptions(query);

        let result = await collection.findOne({ _id: id }, mongoOptions);

        return result;
    }

    async insert(tableName: string, data: JsonMap) {
        this.connect();
        data._id = data._id || new ObjectId().toHexString();
        let collection = this.collection(tableName);
        let result = await collection.insertOne(data);
        return result.ops[0];
    }

    async update(tableName: string, id: SteedosIDType, data: JsonMap) {
        this.connect();
        let collection = this.collection(tableName);
        let result = await collection.updateOne({ _id: id }, data);
        return result.result.ok;
    }

    async delete(tableName: string, id: SteedosIDType) {
        this.connect();
        let collection = this.collection(tableName);
        let result = await collection.deleteOne({ _id: id })
        return result.deletedCount;
    }

}