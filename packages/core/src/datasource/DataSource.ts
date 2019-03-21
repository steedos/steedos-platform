import { JsonMap } from "@salesforce/ts-types";
import DataSourceConfig from "./DataSourceConfig";
import DataSourceQueryOptions from "./DataSourceQueryOptions";

export default abstract class DataSource {
    config: DataSourceConfig;
    connected: boolean;
    
    constructor(config: DataSourceConfig){
        this.config = config;
    }
    
    abstract find(filters: [[String]], fields: [String], options: DataSourceQueryOptions): any;
    abstract insert(doc: JsonMap): any;
    abstract update(id: string | number, doc: JsonMap): any;
    abstract delete(id: string | number): any;
}

