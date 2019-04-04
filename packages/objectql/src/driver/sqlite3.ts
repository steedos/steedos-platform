import { JsonMap, Dictionary } from "@salesforce/ts-types";
import { SteedosDriver } from "./index";
import Sqlite3Client = require("sqlite3");
import { SteedosQueryOptions, SteedosQueryFilters } from "../types/query";
import { SteedosIDType, SteedosObjectType } from "../types";
import { SteedosDriverConfig } from "./driver";
import { formatFiltersToODataQuery } from "@steedos/filters";
import { createFilter, createQuery } from 'odata-v4-sql'

import _ = require("underscore");

export class SteedosSqlite3Driver implements SteedosDriver {
    _url: string;
    _client: any;
    _collections: Dictionary<any>;

    constructor(config: SteedosDriverConfig) {
        this._collections = {};
        this._url = config.url;
        this.connect();
    }

    async connect() {
        if (!this._client) {
            let sqlite3 = Sqlite3Client.verbose();
            this._client = new sqlite3.Database(this._url);
            return true;
        }
    }

    async disconnect() {
        if (this._client) {
            await this._client.close();
            this._client = null;
            return true;
        }
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
            throw new Error("fields must not be undefined or empty");
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
        return await this.all(sql, filterQuery.parameters);
    }

    async count(tableName: string, query: SteedosQueryOptions) {
        let sort: string = this.getSqlite3SortOptions(query.sort);
        let filterQuery: JsonMap = this.getSqlite3Filters(query.filters);
        let where: string = <string>filterQuery.where;
        let sql = `SELECT count(*) as count FROM ${tableName} ${where} ${sort}`;
        let result: any = await this.get(sql, filterQuery.parameters);
        return result ? result.count : 0
    }

    async findOne(tableName: string, id: SteedosIDType, query: SteedosQueryOptions) {
        let projection: string = this.getSqlite3FieldsOptions(query.fields);
        return await this.get(`SELECT ${projection} FROM ${tableName} WHERE id=?;`, id);
    }

    async run(sql: string, param?: any) {
        // console.log("runing sqlite4 sql...", sql);
        return await new Promise((resolve, reject) => {
            this._client.run(sql, param, function(error:any) {
                if (error) {
                    reject(error);
                }
                else {
                    resolve({
                        changes: this.changes, 
                        lastID: this.lastID
                    });
                }
            });
        });
    }

    async get(sql: string, param?: any) {
        // console.log("geting sqlite4 sql...", sql);
        return await new Promise((resolve, reject)=> {
            this._client.get(sql, param, (error:any, row:any)=> {
                if (error){
                    reject(error);
                }
                else{
                    resolve(row); 
                }
            });
        });
    }

    async all(sql: string, param?: any) {
        // console.log("alling sqlite4 sql...", sql);
        return await new Promise((resolve, reject) => {
            this._client.all(sql, param, (error: any, row: any) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(row);
                }
            });
        });
    }

    async insert(tableName: string, data: JsonMap) {
        let fields: any[] = Object.keys(data);
        let projection: string = this.getSqlite3FieldsOptions(fields);
        let placeholders: string = Object.keys(data).map((n) => { return `?`; }).join(",");
        let values: any[] = Object.values(data);

        return await this.run(`INSERT INTO ${tableName}(${projection}) VALUES(${placeholders})`, values);
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

    //TODO:引用typeorm，使用queryRunner.createTable函数，根据传入的objects，生成各个表结构
    async buildDatabase(objects: Dictionary<SteedosObjectType>) {
    }
}