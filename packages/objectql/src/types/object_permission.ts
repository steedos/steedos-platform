import { SteedosObjectType } from ".";
import _ = require('underscore')

abstract class SteedosObjectPermissionTypeProperties {
    name?: string
    allowRead?: boolean
    allowCreate?: boolean
    allowEdit?: boolean
    allowDelete?: boolean
    viewAllRecords?: boolean
    modifyAllRecords?: boolean
    viewCompanyRecords?: boolean
    modifyCompanyRecords?: boolean
    disabled_list_views?: []
    disabled_actions?: []
    unreadable_fields?: []
    uneditable_fields?: []
    unrelated_objects?: []
}

export interface SteedosObjectPermissionTypeConfig extends SteedosObjectPermissionTypeProperties { }

export class SteedosObjectPermissionType extends SteedosObjectPermissionTypeProperties {
    private _name: string;

    private _object: SteedosObjectType;

    private properties: string[] = ['name']

    constructor(name: string, object: SteedosObjectType, config: SteedosObjectPermissionTypeConfig) {
        super()
        if (!name) {
            throw new Error('name is required');
        }

        this.object = object

        _.each(config, (value: any, key: string) => {
            this[key] = value
            this.properties.push(key)
        })
        
        if (this.allowCreate) {
            this.allowRead = true;
        }
        if (this.allowEdit) {
            this.allowRead = true;
        }
        if (this.allowDelete) {
            this.allowEdit = true;
            this.allowRead = true;
        }
        if (this.viewAllRecords) {
            this.allowRead = true;
        }
        if (this.modifyAllRecords) {
            this.allowRead = true;
            this.allowEdit = true;
            this.allowDelete = true;
            this.viewAllRecords = true;
        }
        if (this.viewCompanyRecords) {
            this.allowRead = true;
        }
        if (this.modifyCompanyRecords) {
            this.allowRead = true;
            this.allowEdit = true;
            this.allowDelete = true;
            this.viewCompanyRecords = true;
        }
        this.name = name
    }

    toConfig() {
        let config = {}
        this.properties.forEach((property) => {
            config[property] = this[property]
        })
        return config
    }

    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }

    public get object(): SteedosObjectType {
        return this._object;
    }
    public set object(value: SteedosObjectType) {
        this._object = value;
    }
}