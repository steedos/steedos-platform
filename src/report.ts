var util = require("./util");

import { Dictionary, JsonMap, getString } from '@salesforce/ts-types';

export const Reports: Dictionary<JsonMap> = {}
export const ReportManager = {
    
    loadFile: (filePath: string)=>{
        let json:JsonMap = util.loadFile(filePath);
        return ReportManager.loadJSON(json);
    },

    loadJSON(json: JsonMap) {
        if (ReportManager.validate(json)){
            let _id = getString(json, "_id");
            if (_id)
                Reports[_id] = json
        }
    },
    
    validate(json: JsonMap): boolean {
        let name = getString(json, "name");
        if (name)
            return true
        else
            return false
    },

    remove(_id: string) {
        if (Reports[_id])
            delete Reports[_id]
    },

    loadStandardReports() {
    }

}