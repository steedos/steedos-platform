var util = require("./util");

import { Dictionary, JsonMap, getString } from '@salesforce/ts-types';

export const Triggers: Dictionary<JsonMap> = {}
export const TriggerManager = {
    
    loadFile: (filePath: string)=>{
        let json:JsonMap = util.loadFile(filePath);
        return TriggerManager.loadJSON(json);
    },

    loadJSON(json: JsonMap) {
        console.log('TriggerManager loadJSON', json);
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

    remove(name: string) {
        if (Triggers.name)
            delete Triggers.name
    },

    loadStandardTriggers() {
    }

}