import { Dictionary, JsonMap } from '@salesforce/ts-types';
import { SteedosDriver, SteedosMongoDriver } from '../driver';

import _ = require('underscore');
import { SteedosQueryOptions } from './query';
import { SteedosIDType } from '.';
import { SteedosDriverConfig } from '../driver/driver';

export type SteedosDataSourceTypeConfig = {
    driver: string | SteedosDriver
    url: string
    username?: string
    pasword?: string
    options?: any
}

export class SteedosDataSourceType implements Dictionary {
    private _driver: string | SteedosDriver;
    private _adapter: any;

    private _url: string;
    private _username?: string;
    private _pasword?: string;
    private _options?: any;
    

    constructor(config: SteedosDataSourceTypeConfig) {
        this._driver = config.driver;
        this.url = config.url
        this.username = config.username
        this.pasword = config.pasword
        this.options = config.options

        let driverConfig: SteedosDriverConfig = {
            url: this.url,
            username: this.username,
            pasword: this.pasword,
            options: this.options
        }

        if(_.isString(this._driver)){
            if(this._driver == 'mongo'){
                this._adapter = new SteedosMongoDriver(driverConfig);
            }
        }else{
            this._adapter = config.driver
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

    async count(tableName: string, query: SteedosQueryOptions){
        return await this.adapter.count(tableName, query)
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

    public get adapter(): any {
        return this._adapter;
    }

    public get url(): string {
        return this._url;
    }
    public set url(value: string) {
        this._url = value;
    }

    
    public get username(): string {
        return this._username;
    }
    public set username(value: string) {
        this._username = value;
    }
    
    public get pasword(): string {
        return this._pasword;
    }
    public set pasword(value: string) {
        this._pasword = value;
    }
    
    public get options(): any {
        return this._options;
    }
    public set options(value: any) {
        this._options = value;
    }
}
