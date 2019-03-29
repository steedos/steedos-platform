import { JsonMap, Dictionary } from "@salesforce/ts-types";
import { SteedosDriver } from "./index"
import Sqlite3Client from "sqlite3";
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
            // this._client = await Sqlite3Client.connect(this._url, { useNewUrlParser: true });
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
        return {};
        // let odataQuery: string = formatFiltersToODataQuery(filters)
        // let query: JsonMap = createFilter(odataQuery)
        // return query;
    }

    /* TODO： */
    getSqlite3Filters(filters: SteedosQueryFilters): JsonMap {
        // if (_.isUndefined(filters)) {
        //     return {}
        // }
        // if (_.isString(filters))
        //     return createFilter(filters)
        let mongoFilters: JsonMap = this.formatFiltersToSqlite3Query(filters);
        return mongoFilters
    }

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

    /* TODO： */
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

    collection(name: string) {
        if (!this._collections[name]) {
            this._collections[name] = this._client.db().collection(name);
        }
        return this._collections[name];
    };

    async find(tableName: string, query: SteedosQueryOptions) {
        let collection = this.collection(tableName);

        let mongoFilters = this.getSqlite3Filters(query.filters);
        let mongoOptions = this.getSqlite3Options(query);
        let result = await collection.find(mongoFilters, mongoOptions).toArray();

        return result;
    }

    async count(tableName: string, query: SteedosQueryOptions) {
        this.connect();
        let collection = this.collection(tableName);

        let mongoFilters = this.getSqlite3Filters(query.filters);
        let mongoOptions = this.getSqlite3Options(query);
        let result = await collection.find(mongoFilters, mongoOptions).count();

        return result;
    }

    async findOne(tableName: string, id: SteedosIDType, query: SteedosQueryOptions) {
        this.connect();
        let collection = this.collection(tableName);
        let mongoOptions = this.getSqlite3Options(query);

        let result = await collection.findOne({ _id: id }, mongoOptions);

        return result;
    }

    async insert(tableName: string, data: JsonMap) {
        // this.connect();
        // data._id = data._id || new ObjectId().toHexString();
        // let collection = this.collection(tableName);
        // let result = await collection.insertOne(data);
        // return result.ops[0];

        // this._client.run("");
    }

    async update(tableName: string, id: SteedosIDType, data: JsonMap) {
        this.connect();
        let collection = this.collection(tableName);
        let result = await collection.updateOne({ _id: id }, data);
        return result.result.ok;
    }

    async delete(tableName: string, id: SteedosIDType) {
        this.connect();
        let collection = this.collection(tableName);
        let result = await collection.deleteOne({ _id: id })
        return result.deletedCount;
    }

}