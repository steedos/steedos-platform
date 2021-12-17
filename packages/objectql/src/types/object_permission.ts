import _ = require('underscore')

abstract class SteedosObjectPermissionTypeProperties {
    name?: string
    object_name?: string
    allowRead?: boolean
    allowCreate?: boolean
    allowEdit?: boolean
    allowDelete?: boolean
    viewAllRecords?: boolean
    modifyAllRecords?: boolean
    viewCompanyRecords?: boolean
    modifyCompanyRecords?: boolean
    allowReadFiles?: boolean
    allowEditFiles?: boolean
    allowCreateFiles?: boolean
    allowDeleteFiles?: boolean
    viewAllFiles?: boolean
    modifyAllFiles?: boolean
    disabled_list_views?: []
    disabled_actions?: []
    unreadable_fields?: string[]
    uneditable_fields?: string[]
    unrelated_objects?: string[]
    field_permissions?: any
}

export interface SteedosObjectPermissionTypeConfig extends SteedosObjectPermissionTypeProperties { }

export class SteedosObjectPermissionType extends SteedosObjectPermissionTypeProperties {
    private _name: string;

    private properties: string[] = ['name']

    constructor(object_name: string, config: SteedosObjectPermissionTypeConfig) {
        super()
        if (!config.name) {
            throw new Error('name is required');
        }

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
        if (this.modifyCompanyRecords) {
            this.allowRead = true;
            this.allowEdit = true;
            this.allowDelete = true;
            this.viewCompanyRecords = true;
        }
        if (this.viewCompanyRecords) {
            this.allowRead = true;
        }

        this.object_name = object_name
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
}