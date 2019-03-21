import { JsonMap } from "@salesforce/ts-types";
import DataSourceConfig from "./DataSourceConfig";
import DataSourceQueryOptions from "./DataSourceQueryOptions";

export default abstract class DataSource {
    config: DataSourceConfig;
    connected: boolean;
    
    constructor(config: DataSourceConfig){
        this.config = config;
    }
    
    abstract find(tableName: string, filters: [[String]], fields: [String], options: DataSourceQueryOptions): any;
    abstract findOne(tableName: string, id: string | number, fields: [String]): any;
    abstract insert(tableName: string, doc: JsonMap): any;
    abstract update(tableName: string, id: string | number, doc: JsonMap): any;
    abstract delete(tableName: string, id: string | number): any;
}

