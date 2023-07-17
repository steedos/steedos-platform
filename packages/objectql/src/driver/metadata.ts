import { Dictionary } from "@salesforce/ts-types";
import { SteedosDriver } from ".";
import { SteedosQueryOptions, SteedosIDType, SteedosObjectType } from "../types";
import { SteedosDriverConfig } from "./driver";
import { SteedosFieldDBType } from "./fieldDBType";
import mingo = require('mingo');
import steedosFilters = require('@steedos/filters');
import odataV4Mongodb = require('@steedos/odata-v4-mongodb');
import clone = require("clone");
import _ = require('underscore');

export class MetadataDriver implements SteedosDriver {
    databaseVersion?: string;
    config?: SteedosDriverConfig;
    connect() {
        
    }
    close() {
        
    }

    formatFiltersToMongoQuery(filters) {
        let emptyFilters = {};
        let odataQuery = "";
        if (_.isString(filters)) {
            odataQuery = filters;
        }
        else {
            odataQuery = steedosFilters.formatFiltersToODataQuery(filters)
        }
        if(!odataQuery){
            return emptyFilters;
        }
        let query = odataV4Mongodb.createFilter(odataQuery);
        return query;
    }
    
    getMongoFilters(filters) {
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
        let mongoFilters = this.formatFiltersToMongoQuery(filters);
        return mongoFilters
    }
    
    getMongoFieldsOptions(fields) {
        if (typeof fields == "string") {
            fields = (fields).split(",").map((n) => { return n.trim(); });
        }
        if (!(fields && fields.length)) {
            return {}
        }
        let projection = {
            record_permissions: 1, 
            is_system: 1, 
        };
        (fields).forEach((field) => {
            if (field) {
                projection[field] = 1;
            }
        });
        return projection;
    }
    
    getMongoOptions(options) {
        if (_.isUndefined(options)) {
            return {};
        }
        let result: any = {};
        let projection = this.getMongoFieldsOptions(options.fields);
        let sort = this.getMongoSortOptions(options.sort);
        result.projection = projection;
        result.sort = sort;
        result.limit = options.top;
        result.skip = options.skip;
        return result;
    }
    
    getMongoSortOptions(sort) {
        let result = undefined;
        if (sort && typeof sort === "string") {
            let arraySort= sort.split(",").map((n) => { return n.trim(); });
            let stringSort = "";
            arraySort.forEach((n) => {
                if (n) {
                    stringSort += `${n},`
                }
            });
            stringSort = stringSort.replace(/,$/g, "");
            result = odataV4Mongodb.createQuery(`$orderby=${stringSort}`).sort;
        }
        return result;
    }
    
    getAggregateOptions(options){
        if (_.isUndefined(options)) {
            return [];
        }
        let result = [];
        let projection = this.getMongoFieldsOptions(options.fields);
        let sort = this.getMongoSortOptions(options.sort);
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
    
    queryMetadata(collection, queryOptions, spaceId){
        let mongoFilters = this.getMongoFilters(queryOptions.filters);
        if (!spaceId) {
            // 如果没有传spaceId，从filters中获取
            const str = JSON.stringify(mongoFilters);
            const regex = /"space":"([^"]+)"/;
            const match = regex.exec(str);
            const space = match ? match[1] : null;
            if (space) {
                spaceId = space;
            }
        }
        const _collection = clone(collection);
        _.each(_collection, function(item) {
            try {
                if (!item.space && spaceId) {
                    item.space = spaceId;
                }
            } catch (error) {
                console.error(`metadata driver queryMetadata: ${item} is not json data`);
            }
        });
        let mongoOptions = this.getMongoOptions(queryOptions);
        // console.log(`mongoFilters`, JSON.stringify(mongoFilters));
        // console.log(`mongoOptions`, mongoOptions);
        let query = new mingo.Query(mongoFilters)
        let projection = queryOptions.projection ? Object.assign({}, queryOptions.projection, {
            record_permissions: 1, 
            is_system: 1, 
        }) : null;
        let cursor = query.find(_collection, projection); //, mongoOptions.projection
        if(mongoOptions.sort){
            cursor.sort(mongoOptions.sort)
        }
        // if(mongoOptions.skip){
        //     cursor.skip(mongoOptions.skip)
        // }
        // if(mongoOptions.limit){
        //     cursor.limit(mongoOptions.limit)
        // }
        return cursor;
    }


    getSupportedColumnTypes(): SteedosFieldDBType[] {
        throw new Error("Method not implemented.");
    }
    find(collection: any, query: SteedosQueryOptions, spaceId?: SteedosIDType) {
        const result = this.queryMetadata(collection, query, spaceId).all();
        return result;
    }
    aggregate(collection: any, query: SteedosQueryOptions, externalPipeline: any, spaceId?: SteedosIDType) {
        const result = this.queryMetadata(collection, query, spaceId).all();
        return result;
    }
    findOne(collection: any, id: SteedosIDType, query: SteedosQueryOptions, spaceId?: SteedosIDType) {
        throw new Error("Method not implemented.");
    }
    insert(collection: any, doc: Dictionary<any>, spaceId?: SteedosIDType) {
        throw new Error("Method not implemented.");
    }
    update(collection: any, id: SteedosQueryOptions | SteedosIDType, doc: Dictionary<any>, spaceId?: SteedosIDType) {
        throw new Error("Method not implemented.");
    }
    updateOne(collection: any, id: SteedosQueryOptions | SteedosIDType, doc: Dictionary<any>, spaceId?: SteedosIDType) {
        throw new Error("Method not implemented.");
    }
    updateMany?(collection: any, queryFilters: any, doc: Dictionary<any>, spaceId?: SteedosIDType) {
        throw new Error("Method not implemented.");
    }
    delete(collection: any, id: SteedosQueryOptions | SteedosIDType, spaceId?: SteedosIDType) {
        throw new Error("Method not implemented.");
    }
    directUpdate(collection: any, id: SteedosQueryOptions | SteedosIDType, doc: Dictionary<any>, spaceId?: SteedosIDType) {
        throw new Error("Method not implemented.");
    }
    directFind(collection: any, query: SteedosQueryOptions, spaceId?: SteedosIDType) {
        throw new Error("Method not implemented.");
    }
    directInsert(collection: any, doc: Dictionary<any>, spaceId?: SteedosIDType) {
        throw new Error("Method not implemented.");
    }
    directDelete(collection: any, id: SteedosQueryOptions | SteedosIDType, spaceId?: SteedosIDType) {
        throw new Error("Method not implemented.");
    }
    directAggregate?(collection: any, query: SteedosQueryOptions, externalPipeline: any, spaceId?: SteedosIDType) {
        throw new Error("Method not implemented.");
    }
    directAggregatePrefixalPipeline?(collection: any, query: SteedosQueryOptions, prefixalPipeline: any, spaceId?: SteedosIDType) {
        throw new Error("Method not implemented.");
    }
    count(collection: any, query: SteedosQueryOptions, spaceId?: SteedosIDType) {
        const result = this.queryMetadata(collection, query, spaceId).count();
        return result;
    }
    dropEntities?() {
        throw new Error("Method not implemented.");
    }
    registerEntities?(objects: Dictionary<SteedosObjectType>) {
        throw new Error("Method not implemented.");
    }
    dropTables?() {
        throw new Error("Method not implemented.");
    }
    createTables?(objects: Dictionary<SteedosObjectType>) {
        throw new Error("Method not implemented.");
    }
    init(objects: Dictionary<SteedosObjectType>) {
        throw new Error("Method not implemented.");
    }
    _makeNewID?(tableName?: string) {
        throw new Error("Method not implemented.");
    }

}