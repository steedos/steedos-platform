/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2021-06-03 15:11:52
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2023-05-06 10:05:52
 * @Description: 
 */
import { Dictionary } from '@salesforce/ts-types';
import { SteedosQueryOptions, SteedosQueryFilters } from "../types/query";
import { SteedosIDType, SteedosObjectType } from "../types";
import { SteedosFieldDBType } from './fieldDBType';

export type SteedosDriverConfig = {
    /**
     * Connection url where perform connection to.
     */
    readonly url?: string;
    /**
     * Database host.
     */
    readonly host?: string;
    /**
     * Database host port.
     */
    readonly port?: number;
    /**
     * Database username.
     */
    readonly username?: string;
    /**
     * Database password.
     */
    readonly password?: string;
    /**
     * Database name to connect to.
     */
    readonly database?: string;
    /**
     * Once you set domain, driver will connect to SQL Server using domain login.
     */
    readonly domain?: string;
    /**
     * The timezone configured on the MySQL server.
     * This is used to type cast server date/time values to JavaScript Date object and vice versa.
     * This can be 'local', 'Z', or an offset in the form +HH:MM or -HH:MM. (Default: 'local')
     */
    readonly timezone?: string;
    /**
     * Database options.
     */
    readonly connectString?: string;
    /**
     * Database options.
     */
    options?: any;
    /**
     * Print sql log for driver.
     */
    readonly logging?: boolean | Array<any>;
    /**
     * collection locale.
     */
    readonly locale?: string;

};




export interface SteedosDriver {

    //constructor(url:string): any;
    // new(config: SteedosDriverConfig): any;
    databaseVersion?: string;
    config?: SteedosDriverConfig;
    connect();
    close();
    getSupportedColumnTypes(): SteedosFieldDBType[];
    find(tableName: string, query: SteedosQueryOptions, userId?: SteedosIDType): any;
    aggregate?(tableName: string, query: SteedosQueryOptions, externalPipeline: any, userId?: SteedosIDType): any;
    findOne(tableName: string, id: SteedosIDType, query: SteedosQueryOptions, userId?: SteedosIDType): any;
    insert(tableName: string, doc: Dictionary<any>, userId?: SteedosIDType): any;
    update(tableName: string, id: SteedosIDType | SteedosQueryOptions, doc: Dictionary<any>, userId?: SteedosIDType): any;
    updateOne(tableName: string, id: SteedosIDType | SteedosQueryOptions, doc: Dictionary<any>, userId?: SteedosIDType): any;
    updateMany?(tableName: string, queryFilters: SteedosQueryFilters, doc: Dictionary<any>, userId?: SteedosIDType): any;
    delete(tableName: string, id: SteedosIDType | SteedosQueryOptions, userId?: SteedosIDType): any;
    directUpdate(tableName: string, id: SteedosIDType | SteedosQueryOptions, doc: Dictionary<any>, userId?: SteedosIDType): any;
    directFind(tableName: string, query: SteedosQueryOptions, userId?: SteedosIDType): any;
    directInsert(tableName: string, doc: Dictionary<any>, userId?: SteedosIDType): any;
    directDelete(tableName: string, id: SteedosIDType | SteedosQueryOptions, userId?: SteedosIDType): any;
    directAggregate?(tableName: string, query: SteedosQueryOptions, externalPipeline: any, userId?: SteedosIDType): any;
    directAggregatePrefixalPipeline?(tableName: string, query: SteedosQueryOptions, prefixalPipeline: any, userId?: SteedosIDType): any;
    count(tableName: string, query: SteedosQueryOptions, userId?: SteedosIDType): any;
    formatRecord?(doc: Dictionary<any>, objectConfig: SteedosObjectType): any;
    dropEntities?(): any;
    registerEntities?(objects: Dictionary<SteedosObjectType>): any;
    dropTables?(): any;
    createTables?(objects: Dictionary<SteedosObjectType>): any;
    init(objects: Dictionary<SteedosObjectType>): any;
    _makeNewID?(tableName?: string): any;
    encryptValue?(value: any): any;
    decryptValue?(value: any): any;
}

