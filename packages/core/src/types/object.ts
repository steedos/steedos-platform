import { Dictionary } from "@salesforce/ts-types";
import { SteedosActionType, SteedosTriggerType, SteedosFieldType, SteedosFieldTypeConfig, SteedosSchema } from ".";
import _ = require("underscore");


export type SteedosObjectTypeConfig = {
    name?: String
    fields: Dictionary<SteedosFieldTypeConfig>
    actions?: Dictionary<SteedosActionType>
    triggers?: Dictionary<SteedosTriggerType>
}

export class SteedosObjectType {

    private _schema: SteedosSchema;
    private _name: String;
    private _fields: Dictionary<SteedosFieldType> = {};
    private _actions: Dictionary<SteedosActionType> = {};
    private _triggers: Dictionary<SteedosTriggerType> = {};

    constructor(object_name: string, schema: SteedosSchema, config: SteedosObjectTypeConfig) {
        this._name = object_name
        this._schema = schema

        _.each(config.fields, (field, field_name) => {
            this.setField(field_name, field)
        })

       
        this._actions = config.actions
        this._actions = config.triggers

    }

    setField(field_name: string, fieldConfig: SteedosFieldTypeConfig) {
        let field = new SteedosFieldType(field_name, this, fieldConfig)
        this.fields[field_name] = field
    }

    getField(field_name: string) {
        return this.fields[field_name]
    }

    extend(config: SteedosObjectTypeConfig) {
        if (this.name != config.name)
            throw new Error("You can not extend on different object");

        // override each fields
        _.each(config.fields, (field, field_name) => {
            this.setField(field_name, field)
        })

        // override each actions
        if (config.actions) {
            _.each(config.actions, (action) => {
                this.actions[action.name] = action
            })
        }

        // override each triggers
        if (config.triggers) {
            _.each(config.triggers, (trigger) => {
                this.triggers[trigger.name] = trigger
            })
        }
    }

    getRepository() {

    }

    /***** get/set *****/
    public get schema(): SteedosSchema {
        return this._schema;
    }

    public get name(): String {
        return this._name;
    }
    

    public get fields(): Dictionary<SteedosFieldType> {
        return this._fields;
    }
    
    public get actions(): Dictionary<SteedosActionType> {
        return this._actions;
    }
    
    public get triggers(): Dictionary<SteedosTriggerType> {
        return this._triggers;
    }
}
