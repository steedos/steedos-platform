var path = require("path");
var util = require("./util");

import { Dictionary, JsonMap, getString } from '@salesforce/ts-types';


export const Schemas: Dictionary<JsonMap> = {}
export const SchemaManager = {
    
    loadFile: (filePath: string)=>{
        let json:JsonMap = util.loadFile(filePath);
        return SchemaManager.loadJSON(json);
    },

    loadJSON(json: JsonMap) {
        if (SchemaManager.validate(json)){
            let _id = getString(json, "_id") || getString(json, "name") ;
            if (_id){
                Schemas[_id] = new SimpleSchema(json)
            }
        }
    },
    
    validate(json: JsonMap): boolean {
        let name = getString(json, "name");
        if (name)
            return true
        else
            return false
    },

    remove(name: string) {
        if (Schemas.name)
            delete Schemas.name
    }
}