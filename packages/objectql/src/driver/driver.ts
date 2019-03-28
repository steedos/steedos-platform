import { JsonMap } from "@salesforce/ts-types";
import { SteedosQueryOptions } from "../types/query";
import { SteedosIDType } from "../types";

export type SteedosDriverConfig = {
    url: string
    username?: string
    pasword?: string
    options?: any
};

export interface SteedosDriver {
    
    //constructor(url:string): any;
    // new(config: SteedosDriverConfig): any;
    connect();
    disconnect();
    find(tableName: string, query: SteedosQueryOptions): any;
    findOne(tableName: string, id: SteedosIDType, query: SteedosQueryOptions): any;
    insert(tableName: string, doc: JsonMap): any;
    update(tableName: string, id: SteedosIDType, doc: JsonMap): any;
    delete(tableName: string, id: SteedosIDType): any;
    count(tableName: string, query: SteedosQueryOptions): any;
}

