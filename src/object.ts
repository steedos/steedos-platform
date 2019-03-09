var path = require("path");
var util = require("./util");

import { Dictionary, JsonMap, getString } from '@salesforce/ts-types';
import { Validators } from './validator';

declare var Creator: any;

export const Objects: Dictionary<JsonMap> = {}
export const ObjectManager = {

    loadFile: (filePath: string) => {
        let json: JsonMap = util.loadFile(filePath);
        return ObjectManager.loadJSON(json);
    },

    loadJSON(json: JsonMap) {
        if (ObjectManager.validate(json)) {
            let _id = getString(json, "_id") || getString(json, "name");
            if (_id) {
                Objects[_id] = json
                if ((typeof Creator !== "undefined") && Creator.Objects) {
                    Creator.Objects[_id] = json;
                    if (typeof Creator.fiberLoadObjects == 'function') {
                        Creator.fiberLoadObjects(json);
                    }
                }
            }
        }
        return json;
    },

    validate(json: JsonMap): boolean {
        var validate = Validators.steedosObjectSchema;
        if (!validate) {
            console.log('缺少steedosObjectSchema');
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

export class SteedosObject {

}