
function proxyBeforeInsert(trigger: Function){
    return function(userId, doc){
        trigger.call({userId, doc});
    }
}

function proxyBeforeUpdate(trigger: Function){
    return function(userId, doc, fieldNames, modifier, options){
        trigger.call({userId, doc: modifier.$set})
    }
}

function proxyBeforeDelete(trigger: Function){
    return function(userId, doc){
        trigger.call({userId, id: doc._id})
    }
}

export function transformTrigger(when: string, trigger: Function){
    if(trigger.length == 0){
        switch (when) {
            case 'beforeInsert':
                return proxyBeforeInsert(trigger)
            case 'beforeUpdate':
                return proxyBeforeUpdate(trigger)
            case 'beforeDelete':
                return proxyBeforeDelete(trigger)
            default:
                break;
        }
    }
    return trigger;
}