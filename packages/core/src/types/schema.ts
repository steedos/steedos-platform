import { Dictionary } from "@salesforce/ts-types";
import { SteedosObjectType } from ".";

export type SteedosSchemaConfig = {
    objects: Dictionary<SteedosObjectType>
}

export class SteedosSchema {
    _objects: Dictionary<SteedosObjectType>

    constructor(config: SteedosSchemaConfig) {
        this._objects = config.objects
    }

    getObject(name: string) {
        return this._objects[name]
    }

    setObject(name: string, object: SteedosObjectType) {
        this._objects[name] = object;
    }

    removeObject(name: string) {
        delete this._objects[name]
    }

}
