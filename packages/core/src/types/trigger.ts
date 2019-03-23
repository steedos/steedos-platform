import { Dictionary } from "@salesforce/ts-types";

import _ = require('underscore')

export type SteedosTriggerTypeConfig = {
    name: string,
    on?: string,
    when: string,
    todo: Function
}

const ENUM_ON = ["client","server"]
const ENUM_WHEN = ['beforeInsert','beforeUpdate','beforeDelete','afterInsert','afterUpdate','afterDelete']

export class SteedosTriggerType implements Dictionary {
    private _name: string;
    
    private _on: string;
    
    private _when: string;
    
    private _todo: Function;
    
    constructor(config: SteedosTriggerTypeConfig) {
        this.name = config.name
        this.on = config.on
        this.when = config.when
        this.todo = config.todo
    }

    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        if(!value)
            throw new Error("You must specify name for this trigger.")
        this._name = value;
    }

    public get on(): string {
        return this._on;
    }
    public set on(value: string) {
        if(!_.contains(ENUM_ON, value))
            throw new Error(`on must be a ${ENUM_ON.join(' or ')}.`)
        this._on = value;
    }

    public get when(): string {
        return this._when;
    }

    public set when(value: string) {
        if(!_.contains(ENUM_WHEN, value))
            throw new Error(`on must be a ${ENUM_WHEN.join(' or ')}.`)
        this._when = value;
    }
    
    public get todo(): Function {
        return this._todo;
    }
    public set todo(value: Function) {
        this._todo = value;
    }
}