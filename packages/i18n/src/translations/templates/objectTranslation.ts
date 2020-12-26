import * as _ from 'underscore';
import { translationObject } from '../index';
const clone = require("clone");

function keysToJSON(keys, source){
    const json = {};
    _.each(keys, function(key){
        json[key] = source[key] || '';
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

export const getObjectMetadataTranslationTemplate = function(lng: string , objectName: string, _object: StringMap){
    let object = clone(_object);
    translationObject(lng, objectName, object);
    let template = Object.assign({}, getObjectTranslationTemplate(object));
    template = Object.assign({}, template, {fields: getFieldsTranslationTemplate(object.fields)});
    template = Object.assign({}, template, {listviews: getListviewsTranslationTemplate(object.list_views)});
    template = Object.assign({}, template, {actions: getActionsTranslationTemplate(object.actions)});
    return Object.assign({name: objectName}, template)
}