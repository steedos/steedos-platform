var util = require("./util");
var _ = require("underscore");

import {Objects, ObjectManager} from './object';

import { Dictionary, JsonMap, getString } from '@salesforce/ts-types';

export const Triggers: Dictionary<JsonMap> = {}
export const TriggerManager = {
    
    loadFile: (filePath: string)=>{
        let json:JsonMap = util.loadFile(filePath);
        return TriggerManager.loadJSON(json);
    },

    loadJSON(trigger: JsonMap) {
        if (TriggerManager.validate(trigger)){
            let name = getString(trigger, "name");
            if (name)
                Triggers[name] = trigger

            var object_name: any = trigger.object_name
            if(!object_name){
                console.error(`load trigger error：Missing attribute 'object_name' /r ${name}`)
                return
            }

            let object: any = Objects[object_name]
            if(!object){
                console.error(`load trigger error：Invalid 'object_name' /r ${name}`)
                return
            }

            if(!object.triggers){
                object.triggers = {}
            }

            _.each(trigger, (attr: any, key: string)=>{
                let tm = triggerMapping[key]
                if(!_.isEmpty(tm)){
                    let tkey: string = `_${key}`.toLocaleUpperCase();
                    object.triggers[tkey] = _.extend({name: `_${trigger.type}_${tkey}`, object: object_name}, tm, {
                        todo: attr
                    })
                }
            })
            ObjectManager.loadJSON(object)
        }
    },
    
    //TODO 处理格式校验
    validate(json: JsonMap): boolean {
        let name = getString(json, "object_name");
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