import DataSource from "../object/DataSource";
import { ObjectConfig } from "..";

export default class SteedosObject {
    
    schema: ObjectConfig;
    datasource: DataSource;
    
    constructor(schema: ObjectConfig, datasource: DataSource){
        this.schema = schema;
        if (datasource)
            this.datasource = datasource;
        else
            this.datasource = DataSource.getDefaultDataSource();
    }
}