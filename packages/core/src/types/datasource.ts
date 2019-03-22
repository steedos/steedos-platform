import { Dictionary } from '@salesforce/ts-types';
import { SteedosDriver, SteedosMongoDriver } from '../driver';

export type SteedosDataSourceTypeConfig = {
    name?: string
    url: string
    driver?: string | SteedosDriver
}

export class SteedosDataSourceType implements Dictionary {
    _name: string
    _type: string
    _url: string
    _driver: SteedosDriver

    constructor(config: SteedosDataSourceTypeConfig) {
        this._name = config.name;
        this._url = config.url;
        if (config.driver){
            if (typeof config.driver  ===  "string") {
                if (config.driver === "mongo"){
                    this._driver = new SteedosMongoDriver(this._url);
                }
            }      
        }
    }
}
