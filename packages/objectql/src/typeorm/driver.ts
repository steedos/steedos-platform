import { JsonMap, Dictionary } from "@salesforce/ts-types";
import { SteedosDriver, SteedosColumnType, SteedosDriverConfig } from "../driver";
import { createConnection, QueryRunner, EntitySchema, ConnectionOptions } from "typeorm";
import { SteedosQueryOptions, SteedosQueryFilters } from "../types/query";
import { SteedosIDType, SteedosObjectType } from "../types";
import { formatFiltersToODataQuery } from "@steedos/filters";
import { executeQuery } from 'odata-v4-typeorm';
import { getEntities, getPrimaryKey } from "../typeorm";

import _ = require("underscore");

export abstract class SteedosTypeormDriver implements SteedosDriver {
    getSupportedColumnTypes() {
        return [
            SteedosColumnType.varchar,
            SteedosColumnType.text,
            SteedosColumnType.number,
            SteedosColumnType.date,
            SteedosColumnType.dateTime,
            SteedosColumnType.oneToOne
        ]
    }
    _url: string;
    _client: any;

    private _config: SteedosDriverConfig;

    public get config(): SteedosDriverConfig {
        return this._config;
    }

    _queryRunner: QueryRunner;
    _entities: Dictionary<EntitySchema>;

    constructor(config: SteedosDriverConfig) {
        this._config = config;
        this._url = config.url;
    }

    abstract getConnectionOptions(): ConnectionOptions;

    async connect() {
        if (!this._entities) {
            throw new Error("Entities must be registered before connect");
        }
        if (!this._client) {
            this._client = await createConnection(this.getConnectionOptions());
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

    getTypeormFieldsOptions(fields: string[] | string): JsonMap {
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

    getTypeormSortOptions(sort: string): JsonMap {
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
            if (stringSort) {
                result = {
                    $orderby: stringSort
                };
            }
        }
        return result;
    }

    getTypeormTopAndSkipOptions(top: number = 0, skip: number = 0): JsonMap {
        let result: JsonMap = {};
        let options: string[] = [];
        if (top > 0) {
            options.push(`limit ${top}`);
            result.$top = top;
        }
        if (skip > 0) {
            if (top == 0) {
                throw new Error("top must not be empty for skip");
            }
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
        let filterQuery: JsonMap = this.getTypeormFilters(query.filters);
        let projection: JsonMap = this.getTypeormFieldsOptions(query.fields);
        let sort: JsonMap = this.getTypeormSortOptions(query.sort);
        let topAndSkip: JsonMap = this.getTypeormTopAndSkipOptions(query.top, query.skip);
        let repository = this._client.getRepository(entity);
        const queryBuilder = repository.createQueryBuilder(tableName);
        let queryOptions = Object.assign(filterQuery, projection, sort, topAndSkip);
        let result = await executeQuery(queryBuilder, queryOptions, { alias: tableName });
        return result;
    }

    async count(tableName: string, query: SteedosQueryOptions) {
        await this.connect();
        let entity = this._entities[tableName];
        if (!entity) {
            throw new Error(`${tableName} is not exist or not registered in the connect`);
        }
        let filterQuery: JsonMap = this.getTypeormFilters(query.filters);
        let repository = this._client.getRepository(entity);
        const queryBuilder = repository.createQueryBuilder(tableName).select([]);
        let result = await executeQuery(queryBuilder, Object.assign(filterQuery, { $count: true }), { alias: tableName });
        return result.count;
    }

    async findOne(tableName: string, id: SteedosIDType, query: SteedosQueryOptions) {
        await this.connect();
        let entity = this._entities[tableName];
        if (!entity) {
            throw new Error(`${tableName} is not exist or not registered in the connect`);
        }
        let repository = this._client.getRepository(entity);
        let primaryKey: string = getPrimaryKey(repository);
        let filterQuery: JsonMap = this.getTypeormFilters([[primaryKey, "=", id]]);
        let projection: JsonMap = this.getTypeormFieldsOptions(query.fields);
        const queryBuilder = repository.createQueryBuilder(tableName);
        // 这里不可以用repository.findOne，也不可以用repository.createQueryBuilder(tableName).select(...).where(...).getOne();
        // 因为sqlserver/sqlite3不兼容
        let result = await executeQuery(queryBuilder, Object.assign(filterQuery, projection), { alias: tableName });
        return result ? result[0] : null;
    }

    async run(sql: string, param?: any) {
        const runner: QueryRunner = await this.createQueryRunner();
        return runner.query(sql, param);
    }

    async insert(tableName: string, data: JsonMap) {
        await this.connect();
        let entity = this._entities[tableName];
        if (!entity) {
            throw new Error(`${tableName} is not exist or not registered in the connect`);
        }
        let repository = this._client.getRepository(entity);
        let result = await repository.insert(data);
        if (result.identifiers && result.identifiers.length) {
            let primaryKey: string = getPrimaryKey(repository);
            let id = primaryKey && result.identifiers[0][primaryKey];
            if (id) {
                let queryWhere: string = `${tableName}.${primaryKey} = :${primaryKey}`;
                let queryParms: JsonMap = {};
                queryParms[primaryKey] = id;
                return await repository.createQueryBuilder(tableName).where(queryWhere, queryParms).getOne();
            }
        }
    }

    async update(tableName: string, id: SteedosIDType, data: JsonMap) {
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
        let primaryKey: string = getPrimaryKey(repository);
        let queryWhere: string = `${tableName}.${primaryKey} = :${primaryKey}`;
        let queryParms: JsonMap = {};
        queryParms[primaryKey] = id;
        return await repository.createQueryBuilder(tableName).where(queryWhere, queryParms).getOne();
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

    async dropEntities() {
        let objects = {};
        this._entities = getEntities(objects);
        await this.connect();
        await this._client.synchronize(true);
        await this.disconnect();
        this._entities = null;
    }

    registerEntities(objects: Dictionary<SteedosObjectType>) {
        if (!this._entities) {
            this._entities = getEntities(objects);
        }
    }

    async dropTables() {
        await this.dropEntities();
    }

    async createTables(objects: Dictionary<SteedosObjectType>) {
        this.registerEntities(objects);
        await this.connect();
        await this._client.synchronize();
    }
}