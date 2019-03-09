var util = require("./util");
var jsen = require("jsen");
var path = require("path");

import { Dictionary, JsonMap, getString } from '@salesforce/ts-types';


export const Validators: Dictionary<any> = {}
export const ValidatorManager = {

    loadFile: (filePath: string) => {
        let json: JsonMap = util.loadFile(filePath);
        return ValidatorManager.loadJSON(json);
    },

    loadJSON(schema: JsonMap) {
        let _id = getString(schema, "id") || getString(schema, "name");
        if (_id) {
            Validators[_id] = jsen(schema);
        }
        return schema;
    },

    remove(id: string) {
        if (Validators.id)
            delete Validators.id
    },

    loadCoreValidators() {
        ValidatorManager.loadFile(path.resolve(__dirname, "../standard/schemas/object.yml"));
        ValidatorManager.loadFile(path.resolve(__dirname, "../standard/schemas/report.yml"));
    }
}