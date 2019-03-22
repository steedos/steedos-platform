import { Dictionary } from "@salesforce/ts-types";
import { SteedosActionType, SteedosTriggerType, SteedosFieldType } from ".";
import _ = require("underscore");
import { SteedosFieldTypeConfig } from "./field";
import { SteedosSchema } from "./schema";


export type SteedosObjectTypeConfig = {
    name?: String
    fields: Dictionary<SteedosFieldTypeConfig>
    actions?: Dictionary<SteedosActionType>
    triggers?: Dictionary<SteedosTriggerType>
}

export class SteedosObjectType {

    _schema: SteedosSchema
    _name: String
    private _fields: Dictionary<SteedosFieldType> = {};
    private _actions: Dictionary<SteedosActionType> = {};
    private _triggers: Dictionary<SteedosTriggerType> = {};

    constructor(object_name: string, schema: SteedosSchema, config: SteedosObjectTypeConfig) {
        this._name = object_name

        _.each(config.fields, (field, field_name) => {
            this.setField(field_name, field)
        })

        this._actions = config.actions
        this._triggers = config.triggers
    }

    setField(field_name: string, fieldConfig: SteedosFieldTypeConfig) {
        let field = new SteedosFieldType(field_name, this, fieldConfig)
        this._fields[field_name] = field
    }

    getField(field_name: string) {
        return this._fields[field_name]
    }

    extend(config: SteedosObjectTypeConfig) {
        if (this._name != config.name)
            throw new Error("You can not extend on different object");

        // override each fields
        _.each(config.fields, (field, field_name) => {
            this.setField(field_name, field)
        })

        // override each actions
        if (config.actions) {
            _.each(config.actions, (action) => {
                this._actions[action.name] = action
            })
        }

        // override each triggers
        if (config.triggers) {
            _.each(config.triggers, (trigger) => {
                this._triggers[trigger.name] = trigger
            })
        }
    }

    getSchema() {
        return this._schema;
    }

    getRepository() {

    }
    
    /***** get/set *****/
    public get fields(): Dictionary<SteedosFieldType> {
        return this._fields;
    }
    public set fields(value: Dictionary<SteedosFieldType>) {
        this._fields = value;
    }
    
    public get actions(): Dictionary<SteedosActionType> {
        return this._actions;
    }
    public set actions(value: Dictionary<SteedosActionType>) {
        this._actions = value;
    }
    
    public get triggers(): Dictionary<SteedosTriggerType> {
        return this._triggers;
    }
    public set triggers(value: Dictionary<SteedosTriggerType>) {
        this._triggers = value;
    }
}
