import DataSource from "../datasource/DataSource";
import { ObjectConfig } from "..";

export default class SteedosObject {
    
    config: ObjectConfig;
    datasource: DataSource;
    
    constructor(config: ObjectConfig, datasource: DataSource){
        this.config = config;
        this.datasource = datasource;
    }
}