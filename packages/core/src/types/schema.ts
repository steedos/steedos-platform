import { SteedosDataSource, SteedosTrigger, SteedosAction } from ".";
import ObjectConfig from "../object/ObjectConfig"

export type SteedosSchemaConfig = {
    datasources: SteedosDataSource[]
    objects: ObjectConfig[]
    actions: SteedosAction[]
    triggers: SteedosTrigger[]
}

export class SteedosSchema {
    _datasources: SteedosDataSource[]
    _objects: ObjectConfig[]
    _actions: SteedosAction[]
    _triggers: SteedosTrigger[]

    constructor(config: SteedosSchemaConfig) {
        this._datasources = config.datasources
        this._objects = config.objects
        this._actions = config.actions
        this._triggers = config.triggers
    }

    addObject(object: ObjectConfig) {
    }

}
