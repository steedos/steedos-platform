import { Dictionary, JsonMap } from '@salesforce/ts-types';
import { SteedosDriver, SteedosMongoDriver } from '../driver';

import _ = require('underscore');
import { SteedosQueryOptions } from './query';
import { SteedosIDType } from '.';
import { SteedosDriverConfig } from '../driver';

export type SteedosDataSourceTypeConfig = {
    driver: string | SteedosDriver
    url: string
    username?: string
    pasword?: string
    options?: any
}

export class SteedosDataSourceType implements Dictionary {
    private _adapter: SteedosDriver;

    private _url: string;
    private _username?: string;
    private _pasword?: string;
    private _options?: any;

    private _isConnected: boolean;
    

    constructor(config: SteedosDataSourceTypeConfig) {
        this._isConnected = false;
        this._url = config.url
        this._username = config.username
        this._pasword = config.pasword
        this._options = config.options

        let driverConfig: SteedosDriverConfig = {
            url: this._url,
            username: this._username,
            pasword: this._pasword,
            options: this._options
        }

        if(_.isString(config.driver)){
            if(config.driver == 'mongo'){
                this._adapter = new SteedosMongoDriver(driverConfig);
            }
        }else{
            this._adapter = config.driver
        }
    }

    async connect(){
        if (this._isConnected)
            return
        await this._adapter.connect()
        this._isConnected = true;
    }
    
    async find(tableName: string, query: SteedosQueryOptions){
        await this.connect();
        return await this._adapter.find(tableName, query)
    }
    
    async findOne(tableName: string, id: SteedosIDType, query: SteedosQueryOptions){
        await this.connect();
        return await this._adapter.findOne(tableName, id, query)
    }

    async insert(tableName: string, doc: JsonMap){
        await this.connect();
        return await this._adapter.insert(tableName, doc)
    }

    async update(tableName: string, id: SteedosIDType, doc: JsonMap){
        await this.connect();
        return await this._adapter.update(tableName, id, doc)
    }

    async delete(tableName: string, id: SteedosIDType){
        await this.connect();
        return await this._adapter.delete(tableName, id)
    }

    async count(tableName: string, query: SteedosQueryOptions){
        await this.connect();
        return await this._adapter.count(tableName, query)
    }

}
