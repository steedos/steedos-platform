import { Dictionary } from "@salesforce/ts-types";
import { SteedosObjectType } from ".";

export type SteedosSchemaConfig = {
    object: Dictionary<SteedosObjectType>
}

export class SteedosSchema {
    _object: Dictionary<SteedosObjectType>

    constructor(config: SteedosSchemaConfig) {
        this._object = config.object
    }

    getObject(name: string) {
        return this._object[name]
    }

    setObject(name: string, object: SteedosObjectType) {
        this._object[name] = object;
    }

    removeObject(name: string) {
        delete this._object[name]
    }


}
