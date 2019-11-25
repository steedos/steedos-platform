import { SteedosListenerConfig, getObject, SteedosObjectTypeConfig } from '../types'
import { wrapAsync } from './index'
import _ = require("underscore");
const ENUM_WHEN = ['beforeInsert','beforeUpdate','beforeDelete','afterInsert','afterUpdate','afterDelete']

function getBaseContext(object: SteedosObjectTypeConfig){
    return {
        object_name: object.name,
        datasource_name: object.datasource,
        getObject
    }
}

function getTriggerWhen(when: string){
    switch (when) {
        case 'beforeInsert':
            return 'before.insert';
        case 'beforeUpdate':
            return 'before.update';
        case 'beforeDelete':
            return 'before.remove';
        case 'afterInsert':
            return 'after.insert';
        case 'afterUpdate':
            return 'after.update';
        case 'afterDelete':
            return 'after.remove';
        default:
            return when
    }
}

function transformListenerToTrigger(object: SteedosObjectTypeConfig, when: string, todo: Function){
    return {
        on: 'server',
        when: getTriggerWhen(when),
        todo: transformTrigger(object, when, todo)
    }
}

function proxyBeforeInsert(trigger: Function, baseContext){
    return function(userId, doc){
        return wrapAsync(trigger, Object.assign({userId, doc}, baseContext));
    }
}

function proxyBeforeUpdate(trigger: Function, baseContext){
    return function(userId, doc, fieldNames, modifier, options){
        return wrapAsync(trigger, Object.assign({userId: userId, id: doc._id, doc: modifier.$set, getObject: getObject}, baseContext))
    }
}

function proxyBeforeDelete(trigger: Function, baseContext){
    return function(userId, doc){
        return wrapAsync(trigger, Object.assign({userId, id: doc._id}, baseContext))
    }
}

function proxyAfterInsert(trigger: Function, baseContext){
    return function(userId, doc){
        return wrapAsync(trigger, Object.assign({userId, doc}, baseContext));
    }
}

function proxyAfterUpdate(trigger: Function, baseContext){
    return function(userId, doc, fieldNames, modifier, options){
        return wrapAsync(trigger, Object.assign({userId: userId, id: doc._id, doc: modifier.$set, previousDoc: this.previous}, baseContext))
    }
}

function proxyAfterDelete(trigger: Function, baseContext){
    return function(userId, doc){
        return wrapAsync(trigger, Object.assign({userId, id: doc._id, previousDoc: doc}, baseContext))
    }
}

function transformTrigger(object: SteedosObjectTypeConfig, when: string, trigger: Function){
    if(trigger.length == 0){
        let baseContext = getBaseContext(object);
        switch (when) {
            case 'beforeInsert':
                return proxyBeforeInsert(trigger, baseContext)
            case 'beforeUpdate':
                return proxyBeforeUpdate(trigger, baseContext)
            case 'beforeDelete':
                return proxyBeforeDelete(trigger, baseContext)
            case 'afterInsert':
                return proxyAfterInsert(trigger, baseContext)
            case 'afterUpdate':
                return proxyAfterUpdate(trigger, baseContext)
            case 'afterDelete':
                return proxyAfterDelete(trigger, baseContext)
            default:
                break;
        }
    }
    return trigger;
}

export function transformListenersToTriggers(object: SteedosObjectTypeConfig, json: SteedosListenerConfig){
    let triggerPrefix = json.name
    let triggers = {}
    _.each(ENUM_WHEN, (_when)=>{
        if(json[_when]){
            triggers[`${triggerPrefix}_${_when}`] = transformListenerToTrigger(object, _when, json[_when])
        }
    })
    return triggers;
}