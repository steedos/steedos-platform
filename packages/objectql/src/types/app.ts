import { JsonMap } from '@salesforce/ts-types';
import { SteedosSchema } from './schema';
export type SteedosAppTypeConfig = {
    _id: string,
    name: string,
    description: string,
    icon_slds: string,
    objects: string[]
}

export class SteedosAppType{
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
    private _icon_slds: string;
    public get icon_slds(): string {
        return this._icon_slds;
    }
    public set icon_slds(value: string) {
        this._icon_slds = value;
    }
    private _objects: string[];
    public get objects(): string[] {
        return this._objects;
    }
    public set objects(value: string[]) {
        this._objects = value;
    }

    private _is_creator: boolean;
    public get is_creator(): boolean {
        return this._is_creator;
    }

    private _schema: SteedosSchema;
    public get schema(): SteedosSchema {
        return this._schema;
    }
    
    constructor(config: SteedosAppTypeConfig, schema: SteedosSchema){
        this._schema = schema
        this._is_creator = true
        this._id = config._id
        this.name = config.name
        this.description = config.description
        this.icon_slds = config.icon_slds
        this.objects = config.objects
    }

    toConfig(){
        let config:JsonMap = {}
        config._id = this._id
        config.name = this.name
        config.description = this.description
        config.icon_slds = this.icon_slds
        config.objects = this.objects
        config.is_creator = this.is_creator
        return config
    }
}