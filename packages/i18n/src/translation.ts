import { t, exists } from './index';
const yaml = require('js-yaml')
const _ = require("underscore");

const KEYSEPARATOR: string = '_';

const OBJECTNS = 'objects';

const objectT = function(key , lng){
    let options: any = {lng: lng, ns: OBJECTNS} // TODO remove ns
    if(KEYSEPARATOR === '.'){
        options.keySeparator = false
    }
    if(exists(key, options)){
        return t(key, options)
    }
}

const getObjectLabelKey = function(objectName){
    return `${objectName}_object`;
}

const getObjectFieldLabelKey = function(objectName, name){
    return `${objectName}${KEYSEPARATOR}field${KEYSEPARATOR}${name}`
}

//TODO ${objectName}_group_${key}
const getObjectFieldGroupKey = function(objectName, name){
    return `${objectName}${KEYSEPARATOR}field${KEYSEPARATOR}${name}${KEYSEPARATOR}group`
}

const getObjectFieldOptionsLabelKey = function(objectName, name, value){
    return `${objectName}${KEYSEPARATOR}field${KEYSEPARATOR}${name}${KEYSEPARATOR}options${KEYSEPARATOR}${value}`
}

const getObjectActionLabelKey = function(objectName, name){
    return `${objectName}${KEYSEPARATOR}action${KEYSEPARATOR}${name}`
}

const getObjectListviewLabelKey = function(objectName, name){
    return `${objectName}${KEYSEPARATOR}listview${KEYSEPARATOR}${name}`
}

//TODO picklists,picklist_options objects
// const getObjectPicklistLabelKey = function(){

// }


const getObjectLabel = function(lng, name, def){
    let key = getObjectLabelKey(name);
    return objectT(key, lng) || def || ''
}

const getObjectFieldLabel = function(lng, objectName, name, def){
    let key = getObjectFieldLabelKey(objectName, name);
    return objectT(key, lng) || def || ''
}

const getObjectFieldGroup = function(lng, objectName, name, def){
    let key = getObjectFieldGroupKey(objectName, name);
    return objectT(key, lng) || def || ''
}

const getObjectFieldOptionsLabel = function(lng, objectName, name, value, def){
    let key = getObjectFieldOptionsLabelKey(objectName, name, value);
    return objectT(key, lng) || def || ''
}


const getObjectActionLabel = function(lng, objectName, name, def){
    let key = getObjectActionLabelKey(objectName, name);
    return objectT(key, lng) || def || ''
}

const getObjectListviewLabel = function(lng, objectName, name, def){
    let key = getObjectListviewLabelKey(objectName, name);
    return objectT(key, lng) || def || ''
}

const translationObject = function(lng: string, objectName: string, object: StringMap){
    object.label = getObjectLabel(lng, objectName, object.label);
    _.each(object.fields, function(field, fieldName){
        field.label = getObjectFieldLabel(lng, objectName, fieldName, field.label);
        if(field.group){
            field.group = getObjectFieldGroup(lng, objectName, fieldName, field.group);
        }
        if(field.options){
            let _options = [];
            _.each(field.options, function(op){
                if(_.has(op, 'value')){
                    let _label = getObjectFieldOptionsLabel(lng, objectName, fieldName, op.value, op.label) 
                    _options.push({value: op.value, label: _label})
                }else{
                    _options.push(op)
                }
            })
            field.options = _options;
        }
    })

    _.each(object.actions, function(action, actionName){
        action.label = getObjectActionLabel(lng, objectName, actionName, action.label);
    })

    _.each(object.list_views, function(list_view, viewName){
        list_view.label = getObjectListviewLabel(lng, objectName, viewName, list_view.label);
    })
}

export const translationObjects = function(lng: string, objects: StringMap){
    _.each(objects, function(object, name){
        translationObject(lng, name, object);
    })
}

export const getObjectI18nTemplate = function(lng: string ,objectName: string, object: StringMap){
    let template = {};
    template[getObjectLabelKey(objectName)] = getObjectLabel(lng, objectName, object.label);
    _.each(object.fields, function(field, fieldName){
        template[getObjectFieldLabelKey(objectName, fieldName)] = getObjectFieldLabel(lng, objectName, fieldName, field.label);
        if(field.group){
            template[getObjectFieldGroupKey(objectName, fieldName)] = getObjectFieldGroup(lng, objectName, fieldName, field.group);
        }
        if(field.options){
            _.each(field.options, function(op){
                if(_.has(op, 'value')){
                    template[getObjectFieldOptionsLabelKey(objectName, fieldName, op.value)] = getObjectFieldOptionsLabel(lng, objectName, fieldName, op.value, op.label);
                }
            })
        }
    })

    _.each(object.actions, function(action, actionName){
        template[getObjectActionLabelKey( objectName, actionName)] = getObjectActionLabel(lng, objectName, actionName, action.label);
    })

    _.each(object.list_views, function(list_view, viewName){
        template[getObjectListviewLabelKey(objectName, viewName)] = getObjectListviewLabel(lng, objectName, viewName, list_view.label);
    })

    return yaml.dump(template).replace(/: ''/g, ': ');
}