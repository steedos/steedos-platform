import { JsonMap } from '@salesforce/ts-types';
import { SteedosQueryFilters} from '.';
import { SteedosDataSourceType } from '.';
import { addConfig, addConfigFiles, getConfig, getConfigs } from '@steedos/metadata-registrar';

export const LOADED_REPORTS_CONFIGS: Array<SteedosReportTypeConfig> = [];

export type SteedosReportTypeConfig = {
    _id: string,
    name: string,
    object_name: string,
    fields: Array<string>,
    filters: SteedosQueryFilters,
    description: string,
    mrt_file: string,
    graphql: string
}

export class SteedosReportType{
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

    private _object_name: string;
    public get object_name(): string {
        return this._object_name;
    }
    public set object_name(value: string) {
        this._object_name = value;
    }

    private _fields: Array<string>;
    public get fields(): Array<string> {
        return this._fields;
    }
    public set fields(value: Array<string>) {
        this._fields = value;
    }

    private _filters: SteedosQueryFilters;
    public get filters(): SteedosQueryFilters {
        return this._filters;
    }
    public set filters(value: SteedosQueryFilters) {
        this._filters = value;
    }

    private _description: string;
    public get description(): string {
        return this._description;
    }
    public set description(value: string) {
        this._description = value;
    }

    private _mrt_file: string;
    public get mrt_file(): string {
        return this._mrt_file;
    }
    public set mrt_file(value: string) {
        this._mrt_file = value;
    }

    private _graphql: string;
    public get graphql(): string {
        return this._graphql;
    }
    public set graphql(value: string) {
        this._graphql = value;
    }
    
    constructor(config: SteedosReportTypeConfig, datasource: SteedosDataSourceType){
        this._datasource = datasource
        this._id = config._id
        this.name = config.name
        this.object_name = config.object_name
        this.fields = config.fields
        this.filters = config.filters
        this.description = config.description
        this.mrt_file = config.mrt_file
        this.graphql = config.graphql
    }

    toConfig(){
        let config:JsonMap = {}
        config._id = this._id
        config.name = this.name
        config.object_name = this.object_name
        config.fields = this.fields
        config.filters = this.filters
        config.description = this.description
        config.mrt_file = this.mrt_file
        config.graphql = this.graphql
        return config
    }
}

export function addReportConfigFiles(filePath: string){
    addConfigFiles('report', filePath);
}

export const addReportConfig = (appConfig: SteedosReportTypeConfig) => {
    addConfig('report', appConfig);
}

export const getReportConfigs = () => {
    return getConfigs('report')
}

export const getReportConfig = (_id: string):SteedosReportTypeConfig => {
    return getConfig('report', _id);
}
