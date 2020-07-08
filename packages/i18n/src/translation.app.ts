import { _t, exists } from './index';
const _ = require("underscore");

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

const getMenuLabelKey = function(menuId){
    return `menu${KEYSEPARATOR}${menuId}`
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

const translationApp = function(lng: string, appId: string, app: StringMap){
    app.label = getAppLabel(lng, appId, app.label || app.name);
    // app.name = app.label
    app.description = getAppDescription(lng, appId, app.description);
    translationMenus(lng, app.admin_menus);
}

export const translationMenus = function(lng: string, menus: Array<any>){
    _.each(menus, function(menu){
        let label = getMenuLabel(lng, menu._id, menu.label || menu.name);
        menu.label = label;
        menu.name = label;
    })
}

export const translationApps = function(lng: string, apps: StringMap){
    _.each(apps, function(app, name){
        translationApp(lng, name, app);
    })
}
