import { JsonMap, Dictionary } from "@salesforce/ts-types";
import { SteedosDriver } from "./index"
import { MongoClient } from "mongodb";
import { SteedosQueryOptions, SteedosQueryFilters } from "../types/query";
import { SteedosIDType } from "../types";
import { SteedosDriverConfig } from "./driver";
import { formatFiltersToODataQuery } from "@steedos/filters";
import { createFilter } from 'odata-v4-mongodb';
import _ = require("underscore");

export class SteedosMongoDriver implements SteedosDriver {
    _url: string;
    _client: any;
    _collections: Dictionary<any>;
    
    constructor(config: SteedosDriverConfig){
        this._collections = {};
        this._url = config.url;
    }

    async connect(){
        this._client = await MongoClient.connect(this._url, {useNewUrlParser: true})
    }

    async disconnect(){
        return await this._client.disconnect();
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
        if (_.isUndefined(filters)){
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
            return {}
        }
        let fields: string[] = options.fields;
        if (_.isUndefined(fields)) {
            return {}
        }
        let result: JsonMap = {};
        let projection: JsonMap = {};
        fields.forEach((field)=>{
            projection[field] = 1;
        });
        result.projection = projection;
        result.limit = options.top;
        result.skip = options.skip;
        result.sort = options.sort;
        return result;
    }

    collection(name: string) {
        if (!this._collections[name]) {
            this._collections[name] = this._client.db().collection(name);
        }
        return this._collections[name];
    };

    async find(tableName: string, query: SteedosQueryOptions){
        let collection = this.collection(tableName);

        let mongoFilters = this.getMongoFilters(query.filters);
        let mongoOptions = this.getMongoOptions(query);
        let result = await collection.find(mongoFilters, mongoOptions).toArray();

        return result;
    }

    async count(tableName: string, query: SteedosQueryOptions) {
        let collection = this.collection(tableName);

        let mongoFilters = this.getMongoFilters(query.filters);
        let mongoOptions = this.getMongoOptions(query);
        let result = await collection.find(mongoFilters, mongoOptions).count();

        return result;
    }

    async findOne(tableName: string, id: SteedosIDType, query: SteedosQueryOptions) {
        let collection = this.collection(tableName);
        let mongoOptions = this.getMongoOptions(query);

        let result = await collection.findOne({_id: id}, mongoOptions);

        return result;
    }

    async insert(tableName: string, data: JsonMap){

        let collection = this.collection(tableName);
        return await collection.insert(data);
    }

    async update(tableName: string, id: SteedosIDType, data: JsonMap){
        let collection = this.collection(tableName);
        return await collection.upset({_id: id}, data)
    }

    async delete(tableName: string, id: SteedosIDType){
        let collection = this.collection(tableName);
        return await collection.remove({_id: id})
    }

}