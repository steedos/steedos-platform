import { _t, exists } from '../index';
import * as _ from 'underscore';
import { SteedosMetadataTypeInfoKeys } from '@steedos/metadata-core';

const clone = require("clone");

const APP_NS = 'translation';
const KEYSEPARATOR: string = '_';

const CUSTOMAPPLICATIONS_KEY = 'app';
const MENU_KEY = 'menu';

const getPrefix = function(key){
    switch (key) {
        case CUSTOMAPPLICATIONS_KEY:
            return SteedosMetadataTypeInfoKeys.Application
        case MENU_KEY:
            return 'CustomMenus'
        default:
            return 'CustomLabels';
    }
}

const translation = function(key , lng){
    let options: any = {lng: lng, ns: APP_NS}
    if(KEYSEPARATOR === '.'){
        options.keySeparator = false
    }
    if(exists(key, options)){
        return _t(key, options)
    }
}

const getAppNameKey = function(appId){
    const prefix = getPrefix(CUSTOMAPPLICATIONS_KEY);
    return [prefix, appId, 'name'].join(KEYSEPARATOR);
}

const getAppDescriptionKey = function(appId){
    const prefix = getPrefix(CUSTOMAPPLICATIONS_KEY);
    return [prefix, appId, 'description'].join(KEYSEPARATOR);
}

const getMenuLabelKey = function(menuId){
    const prefix = getPrefix(MENU_KEY);
    return [prefix, menuId].join(KEYSEPARATOR);
}

const translationAppName = function(lng, appId, def){
    let key = getAppNameKey(appId);
    return translation(key, lng) || def || '' 
}

const translationAppDescription = function(lng, appId, def){
    let key = getAppDescriptionKey(appId);
    return translation(key, lng) || def || '' 
}

const translationMenuLabel = function(lng, menuId, def){
    let key = getMenuLabelKey(menuId);
    return translation(key, lng) || def || '' 
}

export const translationApp = function(lng: string, appId: string, app: StringMap){
    app.label = translationAppName(lng, appId, app.label || app.name);
    // app.name = app.label
    app.description = translationAppDescription(lng, appId, app.description);
    translationMenus(lng, app.admin_menus);
}

export const translationMenus = function(lng: string, menus: Array<any>){
    _.each(menus, function(menu){
        let label = translationMenuLabel(lng, menu._id, menu.label || menu.name);
        menu.label = label;
        menu.name = label;
    })
}

export const translationApps = function(lng: string, apps: StringMap){
    _.each(apps, function(app, name){
        translationApp(lng, name, app);
    })
}

export const getAppTranslationTemplate = function(lng: string, appId: string, _app: StringMap){
    let app = clone(_app);
    let template = {};
    template[getAppNameKey(appId)] = translationAppName(lng, appId, app.label || app.name);
    template[getAppDescriptionKey(appId)] = translationAppDescription(lng, appId, app.description);

    _.each(app.admin_menus, function(menu){
        template[getMenuLabelKey( menu._id)] = translationMenuLabel(lng, menu._id, menu.label || menu.name);
    })
    return template;
}