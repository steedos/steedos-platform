import _ = require('underscore')

abstract class SteedosObjectPermissionTypeProperties {
    abstract name?: string
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
    allowCreateListViews?: boolean
    viewAllFiles?: boolean
    modifyAllFiles?: boolean
    disabled_list_views?: []
    disabled_actions?: []
    unreadable_fields?: string[]
    uneditable_fields?: string[]
    unrelated_objects?: string[]
    field_permissions?: any
    viewAssignCompanysRecords?: string[]
    modifyAssignCompanysRecords?: string[]
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
        
        this.allowCreateListViews = this.allowCreateListViews == false ? false : true;

        if (!_.isEmpty(this.viewAssignCompanysRecords)) {
            this.allowRead = true;
        }

        if (!_.isEmpty(this.modifyAssignCompanysRecords)) {
            this.allowRead = true;
            this.allowEdit = true;
        }

        if (this.allowRead) {
            typeof this.allowReadFiles !== "boolean" && (this.allowReadFiles = true);
            typeof this.viewAllFiles !== "boolean" && (this.viewAllFiles = true);
        }
        if (this.allowEdit) {
            typeof this.allowCreateFiles !== "boolean" && (this.allowCreateFiles = true);
            typeof this.allowEditFiles !== "boolean" && (this.allowEditFiles = true);
            typeof this.allowDeleteFiles !== "boolean" && (this.allowDeleteFiles = true);
        }
        if (this.modifyAllRecords) {
            typeof this.modifyAllFiles !== "boolean" && (this.modifyAllFiles = true);
        }
        if (this.allowCreateFiles) {
            this.allowReadFiles = true;
        }
        if (this.allowEditFiles) {
            this.allowReadFiles = true;
        }
        if (this.allowDeleteFiles) {
            this.allowEditFiles = true;
            this.allowReadFiles = true;
        }
        if (this.viewAllFiles) {
            this.allowReadFiles = true;
        }
        if (this.modifyAllFiles) {
            this.allowReadFiles = true;
            this.allowEditFiles = true;
            this.allowDeleteFiles = true;
            this.viewAllFiles = true;
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