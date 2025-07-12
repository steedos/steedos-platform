import { JsonMap, Dictionary } from "@salesforce/ts-types";
import { SteedosDriver, SteedosFieldDBType, SteedosDriverConfig } from "../driver";
import { createConnection, QueryRunner, EntitySchema, ConnectionOptions } from "typeorm";
import { SteedosQueryOptions, SteedosQueryFilters } from "../types/query";
import { SteedosIDType, SteedosObjectType } from "../types";
import { formatFiltersToODataQuery } from "@steedos/filters";
import { executeQuery, executeCountQuery, SqlOptions } from '@steedos/odata-v4-typeorm';
import { SQLLang } from '@steedos/odata-v4-sql';
import { getPrimaryKeys } from "../typeorm";

import _ = require("underscore");

export abstract class SteedosTypeormDriver implements SteedosDriver {
    getSupportedColumnTypes() {
        return [
            SteedosFieldDBType.varchar,
            SteedosFieldDBType.text,
            SteedosFieldDBType.number,
            SteedosFieldDBType.date,
            SteedosFieldDBType.dateTime
        ]
    }
    _url: string;
    _client: any;
    databaseVersion?: string;

    private _config: SteedosDriverConfig;

    public get config(): SteedosDriverConfig {
        return this._config;
    }

    _queryRunner: QueryRunner;
    _entities: Dictionary<EntitySchema>;

    abstract readonly sqlLang: SQLLang;

    constructor(config: SteedosDriverConfig) {
        this._config = config;
        this._url = config.url;
    }

    abstract getConnectionOptions(): ConnectionOptions;

    async connect(reconnect?) {
        if (!this._entities) {
            throw new Error("Entities must be registered before connect");
        }
        if (!this._client || reconnect) {
            let options = this.getConnectionOptions();
            this._client = await createConnection(options);
            this.databaseVersion = await this.getDatabaseVersion();
            return true;
        }
    }

    async close() {
        if (this._client) {
            await this._client.close();
            this._client = null;
            this._queryRunner = null;
            return true;
        }
    }

    async createQueryRunner() {
        if (this._queryRunner) {
            return this._queryRunner;
        }
        if (!this._client) {
            await this.connect();
        }
        this._queryRunner = await this._client.driver.createQueryRunner("master");
        return this._queryRunner;
    }

    formatFiltersToTypeormQuery(filters: any): JsonMap {
        let odataQuery: string = "";
        if (_.isString(filters)) {
            odataQuery = filters;
        }
        else {
            odataQuery = formatFiltersToODataQuery(filters)
        }
        if(!odataQuery){
            return {}
        }
        return {
            $filter: odataQuery
        };
    }

    getTypeormFilters(filters: SteedosQueryFilters): JsonMap {
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
        let typeormFilters: JsonMap = this.formatFiltersToTypeormQuery(filters);
        return typeormFilters
    }

    getTypeormFieldsOptions(fields: string[] | string, primaryKeys: string[]): JsonMap {
        if (typeof fields === "string") {
            fields = (<string>fields).split(",").map((n) => { return n.trim(); });
        }
        if (!(fields && fields.length)) {
            return {}
        }
        let projection: string = "";
        (<string[]>fields).forEach((field) => {
            if (field && primaryKeys.indexOf(field) < 0) {
                projection += `${field},`
            }
        });
        projection = projection.replace(/,$/g, "");
        if (primaryKeys && primaryKeys.length){
            if (projection){
                projection = `${primaryKeys.join(",")},${projection}`;
            }
            else{
                projection = primaryKeys.join(",");
            }
        }
        return {
            $select: projection
        };
    }

    getTypeormSortOptions(sort: string, defaultSort?: string): JsonMap {
        let result: JsonMap = {};
        if (!(sort && typeof sort === "string" && sort.length)) {
            if (defaultSort){
                sort = defaultSort;
            }
            else{
                return result;
            }
        }
        let arraySort: string[] = sort.split(",").map((n) => { return n.trim(); });
        let stringSort: string = "";
        arraySort.forEach((n) => {
            if (n) {
                stringSort += `${n},`
            }
        });
        stringSort = stringSort.replace(/,$/g, "");
        if (stringSort) {
            result = {
                $orderby: stringSort
            };
        }
        return result;
    }

    getTypeormTopAndSkipOptions(top: number = 0, skip: number = 0): JsonMap {
        let result: JsonMap = {};
        if (top > 0) {
            result.$top = top;
        }
        if (skip > 0) {
            result.$skip = skip;
        }
        return result;
    }

    async find(tableName: string, query: SteedosQueryOptions) {
        await this.connect();
        let entity = this._entities[tableName];
        if (!entity) {
            throw new Error(`${tableName} is not exist or not registered in the connect`);
        }
        let repository = this._client.getRepository(entity);
        let primaryKeys: string[] = getPrimaryKeys(repository);
        let filterQuery: JsonMap = this.getTypeormFilters(query.filters);
        let projection: JsonMap = this.getTypeormFieldsOptions(query.fields, primaryKeys);
        let sort: JsonMap = this.getTypeormSortOptions(query.sort);
        let topAndSkip: JsonMap = this.getTypeormTopAndSkipOptions(query.top, query.skip);
        const queryBuilder = repository.createQueryBuilder(tableName);
        let queryOptions = Object.assign(filterQuery, projection, sort, topAndSkip);
        let sqlOptions: SqlOptions = { alias: tableName, type: this.sqlLang, version: this.databaseVersion };
        let result = await executeQuery(queryBuilder, queryOptions, sqlOptions);
        return result.map((item:any)=>{
            if (primaryKeys){
                if (primaryKeys.length === 1){
                    let key = primaryKeys[0];
                    item['_id'] = item[key] ? item[key] : "";
                }
                else if (primaryKeys.length > 1){
                    item['_ids'] = {};
                    primaryKeys.forEach((key) => {
                        item['_ids'][key] = item[key] ? item[key] : "";
                    });
                }
            }
            return item;
        });
    }

    async count(tableName: string, query: SteedosQueryOptions) {
        await this.connect();
        let entity = this._entities[tableName];
        if (!entity) {
            throw new Error(`${tableName} is not exist or not registered in the connect`);
        }
        let filterQuery: JsonMap = this.getTypeormFilters(query.filters);
        let repository = this._client.getRepository(entity);
        const queryBuilder = repository.createQueryBuilder(tableName);
        let result = await executeCountQuery(queryBuilder, filterQuery, { alias: tableName, type: this.sqlLang });
        return result;
    }

    async findOne(tableName: string, id: SteedosIDType, query?: SteedosQueryOptions) {
        await this.connect();
        let entity = this._entities[tableName];
        if (!entity) {
            throw new Error(`${tableName} is not exist or not registered in the connect`);
        }
        let repository = this._client.getRepository(entity);
        let primaryKeys: string[] = getPrimaryKeys(repository);
        let filterQuery: JsonMap = this.getTypeormFilters([[primaryKeys[0], "=", id]]);
        let projection: JsonMap = this.getTypeormFieldsOptions(query ? query.fields : [], primaryKeys);
        const queryBuilder = repository.createQueryBuilder(tableName);
        // 这里不可以用repository.findOne，也不可以用repository.createQueryBuilder(tableName).select(...).where(...).getOne();
        // 因为sqlserver/sqlite3不兼容
        let result = await executeQuery(queryBuilder, Object.assign(filterQuery, projection), { alias: tableName, type: this.sqlLang });
        if (result && result[0]){
            if (primaryKeys){
                if (primaryKeys.length === 1){
                    let key = primaryKeys[0];
                    result[0]['_id'] = result[0][key] ? result[0][key] : "";
                }
                else if (primaryKeys.length > 1){
                    result[0]['_ids'] = {};
                    primaryKeys.forEach((key) => {
                        result[0]['_ids'][key] = result[0][key] ? result[0][key] : "";
                    });
                }
            }
            return result[0];
        }
        else{
            return null;
        }
    }

    async run(sql: string, param?: any) {
        const queryRunner: QueryRunner = await this.createQueryRunner();
        try {
            return queryRunner.query(sql, param);
        } finally {
            // release函数会根据不同的数据为类型执行不同的操作，比如close数据库
            if (queryRunner !== this._queryRunner) {
                await queryRunner.release();
            }
            if (this._client.driver.options.type === "sqljs") {
                // driver instanceof SqljsDriver
                // SqljsDriver is not export from typeorm,so we user driver.options.type to check the SqljsDriver instance
                await this._client.driver.autoSave();
            }
        }
    }

    async insert(tableName: string, data: Dictionary<any>) {
        await this.connect();
        let entity = this._entities[tableName];
        if (!entity) {
            throw new Error(`${tableName} is not exist or not registered in the connect`);
        }
        let repository = this._client.getRepository(entity);
        let result = await repository.insert(data);
        if (result.identifiers && result.identifiers.length) {
            let primaryKeys: string[] = getPrimaryKeys(repository);
            if (primaryKeys && primaryKeys.length === 1) {
                let id = primaryKeys[0] && result.identifiers[0][primaryKeys[0]];
                if (id) {
                    return await this.findOne(tableName, id);
                }
            }
        }
    }

    async update(tableName: string, id: SteedosIDType, data: Dictionary<any>) {
        await this.connect();
        let entity = this._entities[tableName];
        if (!entity) {
            throw new Error(`${tableName} is not exist or not registered in the connect`);
        }
        let fields: any[] = Object.keys(data);
        if (!fields.length) {
            throw new Error("the params 'data' must not be empty");
        }
        let repository = this._client.getRepository(entity);
        await repository.update(id, data);
        return await this.findOne(tableName, id);
    }

    async updateOne(tableName: string, id: SteedosIDType, data: Dictionary<any>) {
        await this.connect();
        let entity = this._entities[tableName];
        if (!entity) {
            throw new Error(`${tableName} is not exist or not registered in the connect`);
        }
        let fields: any[] = Object.keys(data);
        if (!fields.length) {
            throw new Error("the params 'data' must not be empty");
        }
        let repository = this._client.getRepository(entity);
        await repository.update(id, data);
        return await this.findOne(tableName, id);
    }

    async delete(tableName: string, id: SteedosIDType) {
        await this.connect();
        let entity = this._entities[tableName];
        if (!entity) {
            throw new Error(`${tableName} is not exist or not registered in the connect`);
        }
        let repository = this._client.getRepository(entity);
        await repository.delete(id);
    }

    async directFind(tableName: string, query: SteedosQueryOptions) {
        return this.find(tableName, query)
    }

    async directInsert(tableName: string, data: Dictionary<any>) {
        return this.insert(tableName, data)
    }

    async directUpdate(tableName: string, id: SteedosIDType, data: Dictionary<any>) {
       return this.update(tableName, id, data)
    }

    async directDelete(tableName: string, id: SteedosIDType) {
       return this.delete(tableName, id)
    }

    async getDatabaseVersion() {
        // 各个driver层可以通过重写该函数来设置databaseVersion值
        return "";
    }

    async dropEntities() {
        let objects = {};
        this._entities = this.getEntities(objects);
        await this.connect();
        await this._client.synchronize(true);
        await this.close();
        this._entities = null;
    }

    registerEntities(objects: Dictionary<SteedosObjectType>) {
        // if (!this._entities) {
        //     this._entities = this.getEntities(objects);
        // }
        this._entities = this.getEntities(objects);
    }

    async dropTables() {
        await this.dropEntities();
    }

    async createTables(objects: Dictionary<SteedosObjectType>) {
        await this.init(objects);
        await this._client.synchronize();
    }

    async init(objects: Dictionary<SteedosObjectType>) {
        this.registerEntities(objects);
        await this.connect(true);
    }

    abstract getEntities(objects: Dictionary<SteedosObjectType>): Dictionary<EntitySchema>;
}