import { JsonMap, Dictionary } from "@salesforce/ts-types";
import { SteedosDriver } from "./index";
import { createConnection, QueryRunner } from "typeorm";
import { SteedosQueryOptions, SteedosQueryFilters } from "../types/query";
import { SteedosIDType, SteedosObjectType } from "../types";
import { SteedosDriverConfig } from "./driver";
import { formatFiltersToODataQuery } from "@steedos/filters";
import { createFilter, createQuery } from 'odata-v4-sql';
import { createTable, createTables, dropTable, dropTables} from "../typeorm";

import _ = require("underscore");

export class SteedosSqlite3Driver implements SteedosDriver {
    _url: string;
    _client: any;
    
    _queryRunner: QueryRunner;

    constructor(config: SteedosDriverConfig) {
        this._url = config.url;
    }

    async connect() {
        if (!this._client) {
            this._client = await createConnection({
                type: "sqlite",
                database: this._url,
                name: (new Date()).getTime().toString()
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
        let query: any;
        let odataQuery: string = "";
        if (_.isString(filters)){
            odataQuery = filters;
        }
        else{
            odataQuery = formatFiltersToODataQuery(filters)
        }
        query = createFilter(odataQuery);
        let parameters: any[] = [];
        query.parameters.forEach((param: any)=>{
            parameters.push(param);
        });
        let where: string = <string>query.where;
        if (where) {
            where = `WHERE ${where}`;
        }
        else{
            where = "";
        }
        return {
            where: where,
            parameters: parameters
        }
    }

    getSqlite3Filters(filters: SteedosQueryFilters): JsonMap {
        if (_.isUndefined(filters)) {
            return {
                where: "",
                parameters: undefined
            }
        }
        let mongoFilters: JsonMap = this.formatFiltersToSqlite3Query(filters);
        return mongoFilters
    }

    getSqlite3FieldsOptions(fields: string[] | string): string {
        if (typeof fields == "string") {
            fields = (<string>fields).split(",").map((n) => { return n.trim(); });
        }
        if (!(fields && fields.length)) {
            // throw new Error("fields must not be undefined or empty");
            return '*'
        }
        let projection: string = "";
        (<string[]>fields).forEach((field) => {
            if (field) {
                projection += `${field},`
            }
        });
        projection = projection.replace(/,$/g, "");
        if (projection) {
            projection = `${createQuery(`$select=${projection}`).select}`;
        }
        return projection;
    }

    getSqlite3SortOptions(sort: string): string {
        let result: string = "";
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
                result = `ORDER BY ${createQuery(`$orderby=${stringSort}`).orderby}`;
            }
        }
        return result;
    }

    getSqlite3TopAndSkipOptions(top: number = 0, skip: number = 0): string {
        let result: string = "";
        let options: string[] = [];
        if (top > 0){
            options.push(`limit ${top}`);
        }
        if (skip > 0) {
            if (top == 0){
                throw new Error("top must not be empty for skip");
            }
            options.push(`offset ${skip}`);
        }
        result = options.join(" ");
        return result;
    }

    async find(tableName: string, query: SteedosQueryOptions) {
        let projection: string = this.getSqlite3FieldsOptions(query.fields);
        let sort: string = this.getSqlite3SortOptions(query.sort);
        let filterQuery: JsonMap = this.getSqlite3Filters(query.filters);
        let where: string = <string>filterQuery.where;
        let limitAndOffset: string = this.getSqlite3TopAndSkipOptions(query.top, query.skip);
        let sql = `SELECT ${projection} FROM ${tableName} ${where} ${sort} ${limitAndOffset}`;
        return await this.run(sql, filterQuery.parameters);
    }

    async count(tableName: string, query: SteedosQueryOptions) {
        let sort: string = this.getSqlite3SortOptions(query.sort);
        let filterQuery: JsonMap = this.getSqlite3Filters(query.filters);
        let where: string = <string>filterQuery.where;
        let sql = `SELECT count(*) as count FROM ${tableName} ${where} ${sort}`;
        let result: any = await this.run(sql, filterQuery.parameters);
        return result ? result[0].count : 0;
    }

    async findOne(tableName: string, id: SteedosIDType, query: SteedosQueryOptions) {
        let projection: string = this.getSqlite3FieldsOptions(query.fields);
        let result: any = await this.run(`SELECT ${projection} FROM ${tableName} WHERE id=?;`, id);
        return result ? result[0] : null;
    }

    async run(sql: string, param?: any) {
        const runner: QueryRunner = await this.createQueryRunner();
        return runner.query(sql, param);
    }

    async insert(tableName: string, data: JsonMap) {
        let fields: any[] = Object.keys(data);
        let projection: string = this.getSqlite3FieldsOptions(fields);
        let placeholders: string = Object.keys(data).map((n) => { return `?`; }).join(",");
        let values: any[] = Object.values(data);

        let id = await this.run(`INSERT INTO ${tableName}(${projection}) VALUES(${placeholders})`, values);
        let results = await this.run(`SELECT * FROM ${tableName} WHERE rowid=?;`, id);
        if (results){
            return results[0];
        }
    }

    async update(tableName: string, id: SteedosIDType, data: JsonMap) {
        let fields: any[] = Object.keys(data);
        let projection: string = this.getSqlite3FieldsOptions(fields);
        let sets: string = projection.split(",").map((n)=>{
            return `${n}=?`;
        }).join(",");

        let values: any[] = Object.values(data);
        values.push(id);

        return await this.run(`UPDATE ${tableName} SET ${sets} WHERE id=?;`, values);
    }

    async delete(tableName: string, id: SteedosIDType) {
        return await this.run(`DELETE FROM ${tableName} WHERE id=?;`, id);
    }

    async createTable(object: SteedosObjectType) {
        const runner: QueryRunner = await this.createQueryRunner();
        await createTable(runner, object);
    }

    async createTables(objects: Dictionary<SteedosObjectType>) {
        const runner: QueryRunner = await this.createQueryRunner();
        await createTables(runner, objects);
    }

    async dropTable(tableName: string) {
        const runner: QueryRunner = await this.createQueryRunner();
        await dropTable(runner, tableName);
    }

    async dropTables(objects: Dictionary<SteedosObjectType>) {
        const runner: QueryRunner = await this.createQueryRunner();
        await dropTables(runner, objects);
    }
}