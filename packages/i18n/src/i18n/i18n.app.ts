import { _t, exists } from '../index';
const _ = require("underscore");
const clone = require("clone");

const APP_NS = 'translation';
const KEYSEPARATOR: string = '_';

const appT = function(key , lng){
    let options: any = {lng: lng, ns: APP_NS}
    if(KEYSEPARATOR === '.'){
        options.keySeparator = false
    }
    if(exists(key, options)){
        return _t(key, options)
    }
}

const getAppLabelKey = function(appId){
    return `app${KEYSEPARATOR}${appId}${KEYSEPARATOR}name`
}

const getAppDescriptionKey = function(appId){
    return `app${KEYSEPARATOR}${appId}${KEYSEPARATOR}description`
}

const getAppGroupKey = function(appId, groupId){
    let groupKey = groupId.toLocaleLowerCase().replace(/\%/g, '_').replace(/\./g, '_').replace(/\ /g, '_')
    return `${appId}${KEYSEPARATOR}tab_group${KEYSEPARATOR}${groupKey}`
}

const getMenuLabelKey = function(menuId){
    return `menu${KEYSEPARATOR}${menuId}`
}

const getTabKey = function(tabId){
    return `tab${KEYSEPARATOR}${tabId}`
}

const getAppLabel = function(lng, appId, def){
    let key = getAppLabelKey(appId);
    return appT(key, lng) || def || '' 
}

const getAppDescription = function(lng, appId, def){
    let key = getAppDescriptionKey(appId);
    return appT(key, lng) || def || '' 
}

const getMenuLabel = function(lng, menuId, def){
    let key = getMenuLabelKey(menuId);
    return appT(key, lng) || def || '' 
}

const translationI18nApp = function(lng: string, appId: string, app: StringMap){
    app.label = getAppLabel(lng, appId, app.label || app.name);
    // app.name = app.label
    app.description = getAppDescription(lng, appId, app.description);
    translationI18nMenus(lng, app.admin_menus);
}

export const translationI18nMenus = function(lng: string, menus: Array<any>){
    _.each(menus, function(menu){
        let label = getMenuLabel(lng, menu._id, menu.label || menu.name);
        menu.label = label;
        menu.name = label;
    })
}

export const translationI18nApps = function(lng: string, apps: StringMap){
    _.each(apps, function(app, name){
        translationI18nApp(lng, name, app);
    })
}

export const getAppI18nTemplate = function(lng: string, appId: string, _app: StringMap){
    let app = clone(_app);
    let template = {};
    template[getAppLabelKey(appId)] = getAppLabel(lng, appId, app.label || app.name);
    template[getAppDescriptionKey(appId)] = getAppDescription(lng, appId, app.description);

    _.each(app.admin_menus, function(menu){
        template[getMenuLabelKey( menu._id)] = getMenuLabel(lng, menu._id, menu.label || menu.name);
    })
    return template;
}

export const appFallbackKeys = {
    getAppLabelKey,
    getAppDescriptionKey,
    getAppGroupKey,
    getMenuLabelKey,
    getTabKey
}