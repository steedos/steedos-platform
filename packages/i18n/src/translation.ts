import { t, exists } from './index';
const _ = require("underscore");

const OBJECTNS = 'objects';

const objectT = function(key , lng){
    let options = {lng: lng, ns: OBJECTNS, keySeparator: false}
    if(exists(key, options)){
        return t(key, options)
    }
}

const getObjectLabelKey = function(objectName){
    return objectName
}

const getObjectFieldLabelKey = function(objectName, name){
    return `${objectName}.field.${name}`
}

const getObjectFieldGroupKey = function(objectName, name){
    return `${objectName}.field.${name}.group`
}

//TODO 
const getObjectFieldOptionsLabelKey = function(objectName, name, value){
    return `${objectName}.field.${name}.options.${value}`
}


const getObjectActionLabelKey = function(objectName, name){
    return `${objectName}.action.${name}`
}

const getObjectListviewLabelKey = function(objectName, name){
    return `${objectName}.listview.${name}`
}

//TODO picklists,picklist_options objects
// const getObjectPicklistLabelKey = function(){

// }


const getObjectLabel = function(lng, name){
    let key = getObjectLabelKey(name);
    return objectT(key, lng)
}

const getObjectFieldLabel = function(lng, objectName, name){
    let key = getObjectFieldLabelKey(objectName, name);
    // if(objectName === 'accounts'){
    //     console.log('getObjectFieldLabel', lng, name, key, objectT(key, lng));
    // }
    return objectT(key, lng)
}

const getObjectFieldGroup = function(lng, objectName, name){
    let key = getObjectFieldGroupKey(objectName, name);
    return objectT(key, lng)
}

const getObjectFieldOptionsLabel = function(lng, objectName, name, value){
    let key = getObjectFieldOptionsLabelKey(objectName, name, value);
    return objectT(key, lng)
}


const getObjectActionLabel = function(lng, objectName, name){
    let key = getObjectActionLabelKey(objectName, name);
    return objectT(key, lng)
}

const getObjectListviewLabel = function(lng, objectName, name){
    let key = getObjectListviewLabelKey(objectName, name);
    return objectT(key, lng)
}

const translationObject = function(lng: string, objectName: string, object: StringMap){
    object.label = getObjectLabel(lng, objectName) || object.label;
    _.each(object.fields, function(field, fieldName){
        field.label = getObjectFieldLabel(lng, objectName, fieldName) || field.label;
        if(field.group){
            field.group = getObjectFieldGroup(lng, objectName, fieldName) || field.group;
        }
        if(field.options){
            let _options = [];
            _.each(field.options, function(op){
                if(_.has(op, 'value')){
                    let _label = getObjectFieldOptionsLabel(lng, objectName, fieldName, op.value) || op.label
                    _options.push({value: op.value, label: _label})
                }else{
                    _options.push(op)
                }
            })
            field.options = _options;
        }
    })

    _.each(object.actions, function(action, actionName){
        action.label = getObjectActionLabel(lng, objectName, actionName) || action.label;
    })

    _.each(object.list_views, function(list_view, viewName){
        list_view.label = getObjectListviewLabel(lng, objectName, viewName) || list_view.label;
    })
}

export const translationObjects = function(lng: string, objects: StringMap){
    _.each(objects, function(object, name){
        translationObject(lng, name, object);
    })
}