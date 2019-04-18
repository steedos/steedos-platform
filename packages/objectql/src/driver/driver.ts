import { Dictionary, JsonMap } from '@salesforce/ts-types';
import { SteedosQueryOptions } from "../types/query";
import { SteedosIDType, SteedosObjectType } from "../types";
import { SteedosColumnType } from './columnType';

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
     * Database options.
     */
    readonly options?: any
};




export interface SteedosDriver {

    //constructor(url:string): any;
    // new(config: SteedosDriverConfig): any;
    config?: SteedosDriverConfig;
    connect();
    disconnect();
    getSupportedColumnTypes(): SteedosColumnType[];
    find(tableName: string, query: SteedosQueryOptions, userId?: SteedosIDType): any;
    findOne(tableName: string, id: SteedosIDType, query: SteedosQueryOptions, userId?: SteedosIDType): any;
    insert(tableName: string, doc: JsonMap, userId?: SteedosIDType): any;
    update(tableName: string, id: SteedosIDType, doc: JsonMap, userId?: SteedosIDType): any;
    delete(tableName: string, id: SteedosIDType, userId?: SteedosIDType): any;
    count(tableName: string, query: SteedosQueryOptions, userId?: SteedosIDType): any;
    dropEntities?(): any;
    registerEntities?(objects: Dictionary<SteedosObjectType>): any;
}

