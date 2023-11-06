/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-08-06 15:09:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-08-06 15:13:35
 * @Description: 
 */
import mingo = require('mingo');
import steedosFilters = require('@steedos/filters');
import odataV4Mongodb = require('@steedos/odata-v4-mongodb');
import clone = require("clone");
import _ = require('underscore');
import { SteedosIDType, SteedosQueryOptions } from './types';

class MetadataDriver {
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

    find(collection: any, query: SteedosQueryOptions, spaceId?: SteedosIDType) {
        const result = this.queryMetadata(collection, query, spaceId).all();
        return result;
    }
}

export const metadataDriver = new MetadataDriver();