import { JsonMap, Dictionary } from "@salesforce/ts-types";
import { SteedosDriver, SteedosColumnType } from "./index";
import { createConnection, QueryRunner, EntitySchema } from "typeorm";
import { SteedosQueryOptions, SteedosQueryFilters } from "../types/query";
import { SteedosIDType, SteedosObjectType, SteedosSchema } from "../types";
import { SteedosDriverConfig } from "./driver";
import { formatFiltersToODataQuery } from "@steedos/filters";
// import { createFilter, createQuery } from 'odata-v4-sql';
import { executeQuery } from 'odata-v4-typeorm';
import { getEntities } from "../typeorm";

import _ = require("underscore");

export class SteedosSqlite3Driver implements SteedosDriver {
    getSupportedColumnTypes() {
        return [
            SteedosColumnType.varchar, 
            SteedosColumnType.text, 
            SteedosColumnType.number,
            SteedosColumnType.oneToOne
        ]
    }
    _url: string;
    _client: any;
    
    _queryRunner: QueryRunner;
    _entities: Dictionary<EntitySchema>;

    constructor(config: SteedosDriverConfig) {
        this._url = config.url;
    }

    async connect() {
        if (!this._entities) {
            throw new Error("Entities must be registered before connect");
        }
        if (!this._client) {
            this._client = await createConnection({
                type: "sqlite",
                database: this._url,
                name: (new Date()).getTime().toString(),
                entities: Object.values(this._entities)
            });
            return true;
        }
    }

    async disconnect() {
        if (this._client) {
            await this._client.close();
            this._client = null;
            this._queryRunner = null;
            return true;
        }
    }

    async createQueryRunner() {
        if (this._queryRunner){
            return this._queryRunner;
        }
        if (!this._client) {
            await this.connect();
        }
        this._queryRunner = await this._client.driver.createQueryRunner("master");
        return this._queryRunner;
    }

    formatFiltersToSqlite3Query(filters: any): JsonMap {
        let odataQuery: string = "";
        if (_.isString(filters)){
            odataQuery = filters;
        }
        else{
            odataQuery = formatFiltersToODataQuery(filters)
        }
        return {
            $filter: odataQuery
        };
    }

    getSqlite3Filters(filters: SteedosQueryFilters): JsonMap {
        let emptyFilters = {
        };
        if (_.isUndefined(filters)) {
            return emptyFilters;
        }
        if (_.isString(filters) && !filters.length) {
            return emptyFilters
        }
        if (_.isArray(filters) && !filters.length) {
            return emptyFilters
        }
        let mongoFilters: JsonMap = this.formatFiltersToSqlite3Query(filters);
        return mongoFilters
    }

    getSqlite3FieldsOptions(fields: string[] | string): JsonMap {
        if (typeof fields == "string") {
            fields = (<string>fields).split(",").map((n) => { return n.trim(); });
        }
        if (!(fields && fields.length)) {
            // throw new Error("fields must not be undefined or empty");
            return {}
        }
        let projection: string = "";
        (<string[]>fields).forEach((field) => {
            if (field) {
                projection += `${field},`
            }
        });
        projection = projection.replace(/,$/g, "");
        return {
            $select: projection
        };
    }

    getSqlite3SortOptions(sort: string): JsonMap {
        let result: JsonMap = {};
        if (sort && typeof sort === "string") {
            let arraySort: string[] = sort.split(",").map((n) => { return n.trim(); });
            let stringSort: string = "";
            arraySort.forEach((n) => {
                if (n) {
                    stringSort += `${n},`
                }
            });
            stringSort = stringSort.replace(/,$/g, "");
            if (stringSort){
                result = {
                    $orderby: stringSort
                };
            }
        }
        return result;
    }

    getSqlite3TopAndSkipOptions(top: number = 0, skip: number = 0): JsonMap {
        let result: JsonMap = {};
        let options: string[] = [];
        if (top > 0){
            options.push(`limit ${top}`);
            result.$top = top;
        }
        if (skip > 0) {
            if (top == 0){
                throw new Error("top must not be empty for skip");
            }
            result.$skip = skip;
        }
        return result;
    }

    async find(tableName: string, query: SteedosQueryOptions) {
        let entity = this._entities[tableName];
        if (!entity) {
            throw new Error(`${tableName} is not exist or not registered in the connect`);
        }
        let filterQuery: JsonMap = this.getSqlite3Filters(query.filters);
        let projection: JsonMap = this.getSqlite3FieldsOptions(query.fields);
        let sort: JsonMap = this.getSqlite3SortOptions(query.sort);
        let topAndSkip: JsonMap = this.getSqlite3TopAndSkipOptions(query.top, query.skip);
        let repository = this._client.getRepository(entity);
        const queryBuilder = repository.createQueryBuilder(tableName);
        let result = await executeQuery(queryBuilder, Object.assign(filterQuery, projection, sort, topAndSkip), { alias: tableName });
        return result;
    }

    async count(tableName: string, query: SteedosQueryOptions) {
        let entity = this._entities[tableName];
        if (!entity) {
            throw new Error(`${tableName} is not exist or not registered in the connect`);
        }
        let filterQuery: JsonMap = this.getSqlite3Filters(query.filters);
        let repository = this._client.getRepository(entity);
        const queryBuilder = repository.createQueryBuilder(tableName).select([]);
        let result = await executeQuery(queryBuilder, Object.assign(filterQuery, { $count: true }), { alias: tableName });
        return result.count;
    }

    async findOne(tableName: string, id: SteedosIDType, query: SteedosQueryOptions) {
        let entity = this._entities[tableName];
        if (!entity) {
            throw new Error(`${tableName} is not exist or not registered in the connect`);
        }
        let fields:string[] = [];
        if (typeof query.fields == "string") {
            fields = (<string>query.fields).split(",").map((n) => { return n.trim(); });
        }
        else{
            fields = <string[]>query.fields;
        }
        if (fields && fields.length === 0){
            // fields为空时返回所有数据
            fields = null;
        }
        let repository = this._client.getRepository(entity);
        let result: any = await repository.findOne(id,{
            select: fields
        });
        return result;
    }

    async run(sql: string, param?: any) {
        const runner: QueryRunner = await this.createQueryRunner();
        return runner.query(sql, param);
    }

    async insert(tableName: string, data: JsonMap) {
        let entity = this._entities[tableName];
        if (!entity){
            throw new Error(`${tableName} is not exist or not registered in the connect`);
        }
        let repository = this._client.getRepository(entity);
        let result = await repository.insert(data);
        if (result.identifiers && result.identifiers.length){
            let primaryColumns: any = repository.metadata.primaryColumns;
            let primaryKey: string;
            if (primaryColumns && primaryColumns.length){
                primaryKey = primaryColumns[0].propertyPath;
            }
            let id = primaryKey && result.identifiers[0][primaryKey];
            if(id){
                return await repository.findOne(id);
            }
        }
    }

    async update(tableName: string, id: SteedosIDType, data: JsonMap) {
        let entity = this._entities[tableName];
        if (!entity) {
            throw new Error(`${tableName} is not exist or not registered in the connect`);
        }
        let fields: any[] = Object.keys(data);
        if (!fields.length){
            throw new Error("the params 'data' must not be empty");
        }
        let repository = this._client.getRepository(entity);
        let result = await repository.update(id, data);
        result = await repository.findOne(id);
        return result;
    }

    async delete(tableName: string, id: SteedosIDType) {
        let entity = this._entities[tableName];
        if (!entity) {
            throw new Error(`${tableName} is not exist or not registered in the connect`);
        }
        let repository = this._client.getRepository(entity);
        await repository.delete(id);
    }

    async dropEntities() {
        let objects = {};
        this._entities = getEntities(objects, null);
        await this.connect();
        await this._client.synchronize(true);
        await this.disconnect();
        this._entities = null;
    }

    async registerEntities(objects: Dictionary<SteedosObjectType>, schema: SteedosSchema) {
        if (!this._entities) {
            this._entities = getEntities(objects, schema);
            await this.connect();
            await this._client.synchronize();
        }
    }
}