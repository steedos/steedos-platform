var util = require("./util");

import { Dictionary, JsonMap, getString } from '@salesforce/ts-types';
import { Validators } from './validator';


export const Reports: Dictionary<JsonMap> = {}
export const ReportManager = {

    loadFile: (filePath: string) => {
        let json: JsonMap = util.loadFile(filePath);
        return ReportManager.loadJSON(json);
    },

    loadJSON(json: JsonMap) {
        if (ReportManager.validate(json)) {
            let _id = getString(json, "_id");
            if (_id)
                Reports[_id] = json
        }
        return json;
    },

    validate(json: JsonMap): boolean {
        var validate = Validators.steedosReportSchema;
        if (!validate) {
            console.log('缺少steedosReportSchema');
            return false;
        }
        if (validate(json)) {
            return true;
        } else {
            console.log(json);
            console.log(validate.errors);
            throw new Error('数据校验未通过,请查看打印信息')
        }
    },

    remove(_id: string) {
        if (Reports[_id])
            delete Reports[_id]
    },

    loadStandardReports() {
    }

}