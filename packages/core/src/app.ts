var util = require("./util");

import { Dictionary, JsonMap, getString } from '@salesforce/ts-types';
import { Validators } from './validator';

declare var Creator: any;

export const Apps: Dictionary<JsonMap> = {}
export const AppManager = {

    loadFile: (filePath: string)=>{
        let json:JsonMap = util.loadFile(filePath);
        return AppManager.loadJSON(json);
    },

    loadJSON(json: JsonMap) {
        if (AppManager.validate(json)){
            let _id = getString(json, "_id") || getString(json, "name") ;
            if (_id) {
                Apps[_id] = json
                if ((typeof Creator !== "undefined") && Creator.Apps) {
                    Creator.Apps[_id] = json;
                }
            }
        }
        return json;
    },

    validate(json: JsonMap): boolean {
        var validate = Validators.steedosAppSchema;
        if (!validate) {
            console.log('缺少steedosAppSchema');
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

    remove(name: string) {
        if (Apps.name)
            delete Apps.name
    },

    loadStandardApps() {
    }

}

export default AppManager;