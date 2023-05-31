/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:35:34
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-30 10:35:06
 * @Description: 
 */
import { addConfig, addConfigFiles, getConfig, getConfigs } from '@steedos/metadata-registrar';
import { SteedosDataSourceType} from '.';
import _ = require('underscore');
export type SteedosDashboardTypeConfig = {
    _id: string,
    name: string,
    apps: string[],
    widgets: object[],
    description: string
}

export class SteedosDashboardType{
    private _datasource: SteedosDataSourceType;
    public get datasource(): SteedosDataSourceType {
        return this._datasource;
    }
    private __id: string;
    public get _id(): string {
        return this.__id;
    }
    public set _id(value: string) {
        this.__id = value;
    }
    private _name: string;
    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }
    private _description: string;
    public get description(): string {
        return this._description;
    }
    public set description(value: string) {
        this._description = value;
    }

    private _apps: string[];
    public get apps(): string[] {
        return this._apps;
    }
    public set apps(value: string[]) {
        this._apps = value;
    }

    private _widgets: object[];
    public get widgets(): object[] {
        return this._widgets;
    }
    public set widgets(value: object[]) {
        this._widgets = value;
    }

    private properties: string[] = []
    
    constructor(config: SteedosDashboardTypeConfig, datasource: SteedosDataSourceType){
        this._datasource = datasource
        this._id = config._id
        _.each(config, (value: any, key: string)=>{
            if(key != 'is_creator'){
                this[key] = value
                this.properties.push(key)
            }
        })
    }

    toConfig(){
        let config = {}
        this.properties.forEach((property)=>{
            config[property] = this[property]
        })
        return config
    }
}

export function addDashboardConfigFiles(filePath: string){
    addConfigFiles('dashboard', filePath);
}

export const addDashboardConfig = (dashboardConfig: SteedosDashboardTypeConfig) => {
    addConfig('dashboard', dashboardConfig);
}

export const getDashboardConfigs = () => {
    return getConfigs('dashboard')
}

export const getDashboardConfig = (_id: string):SteedosDashboardTypeConfig => {
    return getConfig('dashboard', _id);
}
