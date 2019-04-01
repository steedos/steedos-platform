import { JsonMap, Dictionary } from "@salesforce/ts-types";
import { SteedosDriver } from "./index";
import Sqlite3Client = require("sqlite3");
import { SteedosQueryOptions, SteedosQueryFilters } from "../types/query";
import { SteedosIDType } from "../types";
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

    //TODO:
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
        return {
            where: query.where,
            parameters: parameters
        }
    }

    //TODO:
    getSqlite3Filters(filters: SteedosQueryFilters): JsonMap {
        if (_.isUndefined(filters)) {
            return {}
        }
        let mongoFilters: JsonMap = this.formatFiltersToSqlite3Query(filters);
        return mongoFilters
    }

    //TODO:
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
        return projection;
    }

    //TODO:
    getSqlite3SortOptions(sort: string): string {
        // let result: string = "";
        // if (sort && typeof sort === "string") {
        //     let arraySort: string[] = sort.split(",").map((n) => { return n.trim(); });
        //     let stringSort: string = "";
        //     arraySort.forEach((n) => {
        //         if (n) {
        //             stringSort += `${n},`
        //         }
        //     });
        //     stringSort = stringSort.replace(/,$/g, "");
        //     if (stringSort){
        //         result = `ORDER BY ${stringSort}`;
        //     }
        // }
        // return result;


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

    //TODO:
    async find(tableName: string, query: SteedosQueryOptions) {
        let projection: string = this.getSqlite3FieldsOptions(query.fields);
        let sort: string = this.getSqlite3SortOptions(query.sort);
        let filterQuery: JsonMap = this.getSqlite3Filters(query.filters);
        let where: string = <string>filterQuery.where;
        if(where){
            where = `where ${where}`;
        }
        let sql = `select ${projection} from ${tableName} ${where} ${sort}`;
        return await this.all(sql, filterQuery.parameters);
    }

    //TODO:
    async count(tableName: string, query: SteedosQueryOptions) {
        let sort: string = this.getSqlite3SortOptions(query.sort);
        let filterQuery: JsonMap = this.getSqlite3Filters(query.filters);
        let where: string = <string>filterQuery.where;
        if (where) {
            where = `where ${where}`;
        }
        let sql = `select count(*) as count from ${tableName} ${where} ${sort}`;
        let result: any = await this.get(sql, filterQuery.parameters);
        return result ? result.count : 0
    }

    //TODO:
    async findOne(tableName: string, id: SteedosIDType, query: SteedosQueryOptions) {
        let projection: string = this.getSqlite3FieldsOptions(query.fields);
        let sql = `select ${projection} from ${tableName} where id = '${id}'`;
        return await this.get(sql);
    }

    async run(sql: string, param?: any) {
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
        let fields: string = Object.keys(data).join(",");
        let values: string = Object.values(data).map((n)=>{return `'${n}'`;}).join(",");

        return await this.run(`INSERT INTO ${tableName}(${fields}) VALUES(${values})`);
    }

    async update(tableName: string, id: SteedosIDType, data: JsonMap) {
        let fields: any[] = Object.keys(data);
        let values: any[] = Object.values(data).map((n) => { return `'${n}'`; });
        let sets: string = fields.map((n,i)=>{
            return `${n}=${values[i]}`;
        }).join(",");

        return await this.run(`UPDATE ${tableName} SET ${sets} WHERE id='${id}';`);
    }

    async delete(tableName: string, id: SteedosIDType) {
        return await this.run(`DELETE FROM ${tableName} WHERE id='${id}';`);
    }
}