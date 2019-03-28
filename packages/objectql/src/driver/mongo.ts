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
        console.log("formatFiltersToMongoQuery==filters====", filters);
        // let query: JsonMap;
        // let selector: Array<JsonMap> = [];
        // if (!filters.length) {
        //     return;
        // }
        // filters.forEach((filter: any) => {
        //     let field: string, option: string, reg: RegExp, sub_selector: JsonMap, value: any;
        //     field = filter[0];
        //     option = filter[1];
        //     value = filter[2];
        //     sub_selector = {};
        //     sub_selector[field] = {};
        //     if (option === "=") {
        //         sub_selector[field]["$eq"] = value;
        //     } else if (option === "<>") {
        //         sub_selector[field]["$ne"] = value;
        //     } else if (option === ">") {
        //         sub_selector[field]["$gt"] = value;
        //     } else if (option === ">=") {
        //         sub_selector[field]["$gte"] = value;
        //     } else if (option === "<") {
        //         sub_selector[field]["$lt"] = value;
        //     } else if (option === "<=") {
        //         sub_selector[field]["$lte"] = value;
        //     } else if (option === "startswith") {
        //         reg = new RegExp("^" + value, "i");
        //         sub_selector[field]["$regex"] = reg;
        //     } else if (option === "contains") {
        //         reg = new RegExp(value, "i");
        //         sub_selector[field]["$regex"] = reg;
        //     } else if (option === "notcontains") {
        //         reg = new RegExp("^((?!" + value + ").)*$", "i");
        //         sub_selector[field]["$regex"] = reg;
        //     }
        //     return selector.push(sub_selector);
        // });
        // selector.forEach((item) => {
        //     query = { ...item, ...query }
        // });
        let odataQuery: string = formatFiltersToODataQuery(filters)
        let query: JsonMap = createFilter(odataQuery)
        console.log("formatFiltersToMongoQuery==query====", query);
        return query;
        // return {}
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
    getMongoOptions(filters: SteedosQueryOptions){
        return {
            //projection: {_id: 1}
        }
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