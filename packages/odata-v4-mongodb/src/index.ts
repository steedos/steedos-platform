/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-10 15:44:34
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-10 17:09:22
 * @Description: 
 */
import { Visitor } from "./visitor"
import { filter, query } from "@steedos/odata-v4-parser"

/**
 * Creates MongoDB collection, query, projection, sort, skip and limit from an OData URI string
 * @param {string} queryString - An OData query string
 * @return {Visitor} Visitor instance object with collection, query, projection, sort, skip and limit
 * @example
 * const query = createQuery("$filter=Size eq 4&$orderby=Orders&$skip=10&$top=5");
 * collections[query.collection].find(query.query).project(query.projection).sort(query.sort).skip(query.skip).limit(query.limit).toArray(function(err, data){ ... });
 */
export function createQuery(odataQuery:string);
export function createQuery(odataQuery:any);
export function createQuery(odataQuery:string | any){
    let ast:any = <any>(typeof odataQuery == "string" ? query(<string>odataQuery) : odataQuery);
    return new Visitor().Visit(ast);
}

/**
 * Creates a MongoDB query object from an OData filter expression string
 * @param {string} odataFilter - A filter expression in OData $filter format
 * @return {Object}  MongoDB query object
 * @example
 * const filter = createFilter("Size eq 4 and Age gt 18");
 * collection.find(filter, function(err, data){ ... });
 */
export function createFilter(odataFilter:string);
export function createFilter(odataFilter:any);
export function createFilter(odataFilter:string | any):Object{
    let context = { query: {} };
    let ast:any = <any>(typeof odataFilter == "string" ? filter(<string>odataFilter) : odataFilter);
    new Visitor().Visit(ast, context);
    return context.query;
}