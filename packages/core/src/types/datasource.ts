import { Dictionary, JsonMap } from '@salesforce/ts-types';

export interface SteedosDataSourceTypeConfig extends JsonMap {
    name?: string
    url: string
    type: string
}

export class SteedosDataSourceType implements Dictionary {
    _name: string
    _type: string
    _url: string

    constructor(config: SteedosDataSourceTypeConfig) {
        this._name = config.name;
        this._url = config.url;
        this._type = config.type
    }
}
