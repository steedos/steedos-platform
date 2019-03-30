import { JsonMap, Dictionary } from "@salesforce/ts-types";
import { SteedosDriver } from "./index";
import Sqlite3Client = require("sqlite3");
import { SteedosQueryOptions, SteedosQueryFilters } from "../types/query";
import { SteedosIDType } from "../types";
import { SteedosDriverConfig } from "./driver";
// import { formatFiltersToODataQuery } from "@steedos/filters";
// import { createFilter } from 'odata-v4-mongodb';
// import { createQuery } from 'odata-v4-mongodb';
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
        return {};
        // let odataQuery: string = formatFiltersToODataQuery(filters)
        // let query: JsonMap = createFilter(odataQuery)
        // return query;
    }

    //TODO:
    getSqlite3Filters(filters: SteedosQueryFilters): JsonMap {
        // if (_.isUndefined(filters)) {
        //     return {}
        // }
        // if (_.isString(filters))
        //     return createFilter(filters)
        let mongoFilters: JsonMap = this.formatFiltersToSqlite3Query(filters);
        return mongoFilters
    }

    //TODO:
    getSqlite3FieldsOptions(fields: string[] | string): JsonMap {
        if (typeof fields == "string") {
            fields = (<string>fields).split(",").map((n) => { return n.trim(); });
        }
        if (!(fields && fields.length)) {
            throw new Error("fields must not be undefined or empty");
        }
        let projection: JsonMap = {};
        (<string[]>fields).forEach((field) => {
            if (field) {
                projection[field] = 1;
            }
        });
        return projection;
    }

    //TODO:
    getSqlite3SortOptions(sort: string): JsonMap {
        let result: JsonMap = undefined;
        // if (sort && typeof sort === "string") {
        //     let arraySort: string[] = sort.split(",").map((n) => { return n.trim(); });
        //     let stringSort: string = "";
        //     arraySort.forEach((n) => {
        //         if (n) {
        //             stringSort += `${n},`
        //         }
        //     });
        //     stringSort = stringSort.replace(/,$/g, "");
        //     result = createQuery(`$orderby=${stringSort}`).sort;
        // }
        return result;
    }

    //TODO:
    getSqlite3Options(options: SteedosQueryOptions): JsonMap {
        if (_.isUndefined(options)) {
            return {};
        }
        let result: JsonMap = {};
        let projection: JsonMap = this.getSqlite3FieldsOptions(options.fields);
        let sort: JsonMap = this.getSqlite3SortOptions(options.sort);
        result.projection = projection;
        result.sort = sort;
        result.limit = options.top;
        result.skip = options.skip;
        return result;
    }

    //TODO:
    async find(tableName: string, query: SteedosQueryOptions) {
        // let collection = this.collection(tableName);

        // let mongoFilters = this.getSqlite3Filters(query.filters);
        // let mongoOptions = this.getSqlite3Options(query);
        // let result = await collection.find(mongoFilters, mongoOptions).toArray();

        // return result;
    }

    //TODO:
    async count(tableName: string, query: SteedosQueryOptions) {
        // let collection = this.collection(tableName);

        // let mongoFilters = this.getSqlite3Filters(query.filters);
        // let mongoOptions = this.getSqlite3Options(query);
        // let result = await collection.find(mongoFilters, mongoOptions).count();

        // return result;
    }

    //TODO:
    async findOne(tableName: string, id: SteedosIDType, query: SteedosQueryOptions) {
        // let collection = this.collection(tableName);
        // let mongoOptions = this.getSqlite3Options(query);

        // let result = await collection.findOne({ _id: id }, mongoOptions);

        // return result;

        let sql = `select * from ${tableName} where id = '${id}'`;
        return await this.get(sql);
    }

    async run(sql: string) {
        console.log("runing sql...", sql);
        return await new Promise((resolve, reject) => {
            this._client.run(sql, function(error:any) {
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

    async get(sql: string) {
        console.log("geting sql...", sql);
        return await new Promise((resolve, reject)=> {
            this._client.get(sql, (error:any, row:any)=> {
                if (error){
                    reject(error);
                }
                else{
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