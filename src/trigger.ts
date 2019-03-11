var util = require("./util");
var _ = require("underscore");

import { Dictionary, JsonMap, getString } from '@salesforce/ts-types';
import { Validators } from './validator';
import { getObjectSchemaManager } from "./index";

export const Triggers: Dictionary<JsonMap> = {}
export const TriggerManager = {

    loadFile: (filePath: string) => {
        let json: JsonMap = util.loadFile(filePath);
        return TriggerManager.loadJSON(json);
    },

    loadJSON(trigger: JsonMap) {
        if (TriggerManager.validate(trigger)) {
            let name = getString(trigger, "name");
            if (name)
                Triggers[name] = trigger

            var object_name: any = trigger.object_name
            if (!object_name) {
                console.error(`load trigger error：Missing attribute 'object_name' /r ${name}`)
                return
            }

            let options: any = getObjectSchemaManager().get(object_name).options
            if (!options) {
                console.error(`load trigger error：Invalid 'object_name' /r ${name}`)
                return
            }

            if (!options.triggers) {
                options.triggers = {}
            }

            _.each(trigger, (attr: any, key: string) => {
                let tm = triggerMapping[key]
                if (!_.isEmpty(tm)) {
                    let tkey: string = `_${key}`.toLocaleUpperCase();
                    options.triggers[tkey] = _.extend({ name: `_${trigger.type}_${tkey}`, object: object_name }, tm, {
                        todo: attr
                    })
                }
            })
            getObjectSchemaManager().registerCreator(options)
        }
    },

    _convertFunctionToString(obj: JsonMap) {
        var objStr = JSON.stringify(obj, function (key, val) {
            if (typeof val === 'function') {
                return val + '';
            }
            return val;
        })
        return JSON.parse(objStr);
    },

    validate(json: JsonMap): boolean {
        var newJson = TriggerManager._convertFunctionToString(json);
        var validate = Validators.steedosTriggerSchema;
        if (!validate) {
            console.log('缺少steedosTriggerSchema');
            return false;
        }
        if (validate(newJson)) {
            return true;
        } else {
            console.log(newJson);
            console.log(validate.errors);
            throw new Error('数据校验未通过,请查看打印信息')
        }
    },

    remove(name: string) {
        if (Triggers.name)
            delete Triggers.name
    },

    loadStandardTriggers() {
    }

}

//TODO afterUndelete，beforeSubmit
const triggerMapping: JsonMap = {
    beforeInsert: {
        on: 'server',
        when: 'before.insert'
    },
    beforeUpdate: {
        on: 'server',
        when: 'before.update'
    },
    beforeDelete: {
        on: 'server',
        when: 'before.remove'
    },
    afterInsert: {
        on: 'server',
        when: 'after.insert'
    },
    afterUpdate: {
        on: 'server',
        when: 'after.update'
    },
    afterDelete: {
        on: 'server',
        when: 'after.remove'
    }
}