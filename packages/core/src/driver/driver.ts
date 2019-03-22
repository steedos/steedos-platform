import { JsonMap } from "@salesforce/ts-types";
import { SteedosQueryOptions } from "../types/query";


export interface SteedosDriver {
    
    find(tableName: string, query: SteedosQueryOptions): any;
    findOne(tableName: string, id: string | number, fields: [String]): any;
    insert(tableName: string, doc: JsonMap): any;
    update(tableName: string, id: string | number, doc: JsonMap): any;
    delete(tableName: string, id: string | number): any;
}

