import { JsonMap } from "@salesforce/ts-types";

export type SteedosDriverConfig = {
    name: string
    type: string
    connectionUri: string
}

/**
 * FindOptions is set of connection options shared by all database types.
 */
export type SteedosDriverFindOptions = {

    /**
     * Query options for top, fetch only the top number of data
     */
    readonly top?: number;

    /**
     * Query options for skip, fetch only the data after skip count
     */
    readonly skip?: number;

    /**
     * Query options for orderby, the sort of data for fetch
     */
    readonly orderby?: string;
    
}

export interface SteedosDriver {
    
    find(tableName: string, filters: [[String]], fields: [String], options: SteedosDriverFindOptions): any;
    findOne(tableName: string, id: string | number, fields: [String]): any;
    insert(tableName: string, doc: JsonMap): any;
    update(tableName: string, id: string | number, doc: JsonMap): any;
    delete(tableName: string, id: string | number): any;
}

