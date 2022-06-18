import * as _ from 'underscore';
import { translationObject } from '../index';
const clone = require("clone");

function keysToJSON(keys, source){
    const json = {};
    _.each(keys, function(key){
        if(key === 'help'){
            json[key] = source['inlineHelpText'] || '';
        }else{
            json[key] = source[key] || '';
        }
    })
    return json;
}

function getObjectTranslationTemplate(object){
    return keysToJSON(['label', 'description'], object);
}

function getFieldTranslationKeys(field){
    switch (field.type) {
        case 'select':
            return keysToJSON(['label', 'help', 'options', 'description'], field);
        default:
            return keysToJSON(['label', 'help', 'description'], field);
    }
}

function getListViewTranslationKeys(listView){
    return keysToJSON(['label'], listView);
}

function getActionTranslationKeys(action){
    return keysToJSON(['label'], action);
}

function getFieldsTranslationTemplate(fields){
    const template = {};
    _.each(fields, function(field, fieldName){
        template[fieldName] = getFieldTranslationKeys(field);
    })
    return template;
}

function getActionsTranslationTemplate(actions){
    const template = {};
    _.each(actions, function(action, actionName){
        template[actionName] = getActionTranslationKeys(action);
    })
    return template;
}

function getListviewsTranslationTemplate(listviews){
    const template = {};
    _.each(listviews, function(list_view, viewName){
        template[viewName] = getListViewTranslationKeys(list_view);
    })
    return template;
}

function getFieldGroupsTemplate(fields, tFields){
    const template = {};
    _.each(fields, function(field, fieldName){
        if(field.group){
            let groupKey = field.group.toLocaleLowerCase().replace(/\%/g, '_').replace(/\./g, '_').replace(/\ /g, '_')
            template[groupKey] = tFields[fieldName].group;
        }
    })
    return template;
}

export const getObjectMetadataTranslationTemplate = function(lng: string , objectName: string, _object: StringMap, ignoreBase = false){
    let object = clone(_object);
    if( ignoreBase != true){
        translationObject(lng, objectName, object, true, ignoreBase);
    }
    let template = Object.assign({}, getObjectTranslationTemplate(object));
    template = Object.assign({}, template, {fields: getFieldsTranslationTemplate(object.fields)});
    const groupsTemplate = getFieldGroupsTemplate(_object.fields, object.fields);
    if(!_.isEmpty(groupsTemplate)){
        template = Object.assign({}, template, {groups: groupsTemplate});
    }
    const listViewsTemplate = getListviewsTranslationTemplate(object.list_views);
    if(!_.isEmpty(listViewsTemplate)){
        template = Object.assign({}, template, {listviews: listViewsTemplate});
    }
    const actionsTemplate = getActionsTranslationTemplate(object.actions);
    if(!_.isEmpty(actionsTemplate)){
        template = Object.assign({}, template, {actions: actionsTemplate});
    }
    return Object.assign({name: objectName}, template)
}