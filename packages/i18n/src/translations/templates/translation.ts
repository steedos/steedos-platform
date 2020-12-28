import * as _ from 'underscore';
import { translationApp } from '../index';
const clone = require("clone");

function keysToJSON(keys, source){
    const json = {};
    _.each(keys, function(key){
        json[key] = source[key] || '';
    })
    return json;
}

const getAppTranslationTemplate = function(app){
    return keysToJSON(['name', 'description'], app);
}

// const getMenuTranslationKeys = function(menu){
//     return keysToJSON(['label'], menu);
// }

// const getMenuTranslationTemplate = function(menus){
//     const template = {};
//     _.each(menus, function(menu){
//         template[menu._id] = getMenuTranslationKeys(menu);
//     })
//     return template;
// }

export const getAppMetadataTranslationTemplate = function(lng: string, appId: string, _app: StringMap){
    let app = clone(_app);
    translationApp(lng, appId, app);
    let template = Object.assign({}, {CustomApplications: {[appId]: getAppTranslationTemplate(app)}});
    // template = Object.assign({}, template, {CustomMenus: getMenuTranslationTemplate(app.admin_menus)});
    return template;
}

