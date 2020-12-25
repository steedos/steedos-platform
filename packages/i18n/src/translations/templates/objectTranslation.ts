import * as _ from 'underscore';
// import { _t, exists } from '../index';

const clone = require("clone");


// const KEYSEPARATOR: string = '.';

// const BASE_OBJECT = 'base';
// const CORE_OBJECT = 'core';

// const OBJECT_NS = 'translation';

// const objectTranslation = function(key , lng){
//     let options: any = {lng: lng, ns: OBJECT_NS}
//     if(KEYSEPARATOR === '.'){
//         options.keySeparator = false
//     }
//     if(exists(key, options)){
//         return _t(key, options)
//     }
// }

// const getObjectLabelKey = function(objectName){
//     return `${objectName}__object`;
// }

function keysToJSON(keys){
    const json = {};
    _.each(keys, function(key){
        json[key] = '';
    })
}

function getObjectTranslationKeys(){
    return keysToJSON(['label', 'description']);
}

function getFieldTranslationKeys(field){
    switch (field.type) {
        case 'select':
            //TODO 考虑选择项
            return {}
            // break;
        default:
            return keysToJSON(['label', 'help', 'description']);
    }
}

function getListViewTranslationKeys(){
    return keysToJSON(['label']);
}

function getActionsTranslationKeys(){
    return keysToJSON(['label']);
}

function getFieldsTranslationTemplate(lng: string, fields){
    const template = {};
    _.each(fields, function(field, fieldName){
        template[fieldName] = getFieldTranslationKeys(field);
    })
    return template;
}

function getActionsTranslationTemplate(lng: string, actions){
    const template = {};
    _.each(actions, function(action, actionName){
        template[actionName] = getActionsTranslationKeys();
    })
    return template;
}

function getListviewsTranslationTemplate(lng: string, listviews){
    const template = {};
    _.each(listviews, function(list_view, viewName){
        template[viewName] = getListViewTranslationKeys();
    })
    return template;
}

export const getObjectMetadataTranslationTemplate = function(lng: string , objectName: string, _object: StringMap){
    let template = Object.assign({}, getObjectTranslationKeys());
    let object = clone(_object);
    template = Object.assign({}, template, {fields: getFieldsTranslationTemplate(lng, object.fields)});
    template = Object.assign({}, template, {listviews: getListviewsTranslationTemplate(lng, object.list_views)});
    template = Object.assign({}, template, {actions: getActionsTranslationTemplate(lng, object.actions)});
    return Object.assign({name: objectName}, template)
}