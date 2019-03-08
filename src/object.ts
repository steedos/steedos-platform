var path = require("path");
var util = require("./util");

import { Dictionary, JsonMap, getString } from '@salesforce/ts-types';

declare var Creator: any;

export const Objects: Dictionary<JsonMap> = {}
export const ObjectManager = {
    
    loadFile: (filePath: String)=>{
        let json:JsonMap = util.loadFile(filePath);
        return ObjectManager.loadJSON(json);
    },

    loadJSON(json: JsonMap) {
        if (ObjectManager.validate(json)){
            let _id = getString(json, "_id") || getString(json, "name") ;
            if (_id){
                Objects[_id] = json
                if ((typeof Creator !== "undefined") && Creator.Objects) {
                    Creator.Objects[_id] = json;
                    Creator.fiberLoadObjects(json);
                }
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

    remove(name: String) {
        if (Objects.name)
            delete Objects.name
    },

    loadStandardObjects() {
        ObjectManager.loadFile(path.resolve(__dirname, "../standard/objects/spaces.yml"))
        ObjectManager.loadFile(path.resolve(__dirname, "../standard/objects/users.yml"))
        ObjectManager.loadFile(path.resolve(__dirname, "../standard/objects/organizations.yml"))
        ObjectManager.loadFile(path.resolve(__dirname, "../standard/objects/space_users.yml"))
        ObjectManager.loadFile(path.resolve(__dirname, "../standard/objects/apps.yml"))
    }

}