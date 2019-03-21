import DataSource from "../object/DataSource";
import { ObjectConfig } from "..";

export default class SteedosObject {
    
    config: ObjectConfig;
    datasource: DataSource;
    
    constructor(config: ObjectConfig, datasource: DataSource){
        this.config = config;
        if (datasource)
            this.datasource = datasource;
        else
            this.datasource = DataSource.getDefaultDataSource();
    }
}