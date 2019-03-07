var util = require("./util");

import { Dictionary, JsonMap, getString } from '@salesforce/ts-types';

export const Triggers: Dictionary<JsonMap> = {}
export const TriggerManager = {
    
    loadFile: (filePath: String)=>{
        let json:JsonMap = util.loadFile(filePath);
        return TriggerManager.loadJSON(json);
    },

    loadJSON(json: JsonMap) {
        if (TriggerManager.validate(json)){
            let name = getString(json, "name");
            if (name)
                Triggers[name] = json
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
        if (Triggers.name)
            delete Triggers.name
    },

    loadStandardTriggers() {
    }

}