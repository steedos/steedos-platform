import { Dictionary, JsonMap } from '@salesforce/ts-types';
import { SteedosDriver, SteedosMongoDriver } from '../driver';

import _ = require('underscore');
import { SteedosQueryOptions } from './query';
import { SteedosIDType } from '.';

export type SteedosDataSourceTypeConfig = {
    driver: string | SteedosDriver
    settings: Object
}

export class SteedosDataSourceType implements Dictionary {
    private _driver: string | SteedosDriver;
    private _settings: Object;
    
    private _adapter: any;
    public get adapter(): any {
        return this._adapter;
    }
    public set adapter(value: any) {
        this._adapter = value;
    }

    constructor(config: SteedosDataSourceTypeConfig) {
        this._driver = config.driver;
        this._settings = config.settings
        if(_.isString(this._driver)){
            if(this._driver == 'mongo'){
                this.adapter = new SteedosMongoDriver(this.settings);
            }
        }else{
            this.adapter = config.driver
        }
    }

    async connect(){
        await this.adapter.connect()
    }
    
    async find(tableName: string, query: SteedosQueryOptions){
        return await this.adapter.find(tableName, query)
    }
    
    async findOne(tableName: string, id: SteedosIDType, query: SteedosQueryOptions){
        return await this.adapter.findOne(tableName, id, query)
    }

    async insert(tableName: string, doc: JsonMap){
        return await this.adapter.insert(tableName, doc)
    }

    async update(tableName: string, id: SteedosIDType, doc: JsonMap){
        return await this.adapter.update(tableName, id, doc)
    }

    async delete(tableName: string, id: SteedosIDType){
        return await this.adapter.delete(tableName, id)
    }

    
    // async callAdapter(method, ...args) {
    //     const adapterMethod = this.adapter[method];
    //     if (typeof adapterMethod !== 'function') {
    //         throw new Error('Adapted does not support "' + method + '" method');
    //     }
    //     return await adapterMethod.apply(this.adapter, args);
    // };

    public get driver(): string | SteedosDriver {
        return this._driver;
    }
    public set driver(value: string | SteedosDriver) {
        this._driver = value;
    }
   
    public get settings(): Object {
        return this._settings;
    }
    public set settings(value: Object) {
        this._settings = value;
    }
}
