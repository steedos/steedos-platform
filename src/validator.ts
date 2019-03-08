var util = require("./util");
var jsen = require("jsen");

import { Dictionary, JsonMap, getString } from '@salesforce/ts-types';


export const Validators: Dictionary<JsonMap> = {}
export const ValidatorManager = {
    
    loadFile: (filePath: string)=>{
        let json:JsonMap = util.loadFile(filePath);
        return ValidatorManager.loadJSON(json);
    },

    loadJSON(schema: JsonMap) {
        let _id = getString(schema, "id") || getString(schema, "name") ;
        if (_id){
            Validators[_id] = jsen(schema)
        }
    },

    remove(id: string) {
        if (Validators.id)
            delete Validators.id
    }
}