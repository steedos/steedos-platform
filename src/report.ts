var util = require("./util");

import { Dictionary, JsonMap, getString } from '@salesforce/ts-types';

export const Reports: Dictionary<JsonMap> = {}
export const ReportManager = {
    
    loadFile: (filePath: String)=>{
        let json:JsonMap = util.loadFile(filePath);
        return ReportManager.loadJSON(json);
    },

    loadJSON(json: JsonMap) {
        if (ReportManager.validate(json)){
            let name = getString(json, "name");
            if (name)
                Reports[name] = json
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
        if (Reports.name)
            delete Reports.name
    },

    loadStandardReports() {
    }

}