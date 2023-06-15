import { _t, exists, addResourceBundle } from '../index';
import * as _ from 'underscore';
import { SteedosTranslationPrefixKeys } from './';
import { appFallbackKeys } from '../i18n/i18n.app';

const clone = require("clone");

const NAMESPACE = 'translation';
const KEYSEPARATOR: string = '.';

const CUSTOMAPPLICATIONS_KEY = 'app';
const MENU_KEY = 'menu';
const CUSTOMTABS_KEY = 'tab';

const getPrefix = function(key?){
    switch (key) {
        case CUSTOMAPPLICATIONS_KEY:
            return SteedosTranslationPrefixKeys.Application
        case CUSTOMTABS_KEY:
            return SteedosTranslationPrefixKeys.Tab
        default:
            return 'CustomLabels';
    }
}

const getCustomLabelKey = function(key){
    const prefix = getPrefix();
    return [prefix, key].join(KEYSEPARATOR);
}

const translation = function(key , lng){
    let options: any = {lng: lng, ns: NAMESPACE}
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

const getAppGroupKey = function(appId, groupId){
    const prefix = getPrefix(CUSTOMAPPLICATIONS_KEY);
    const fixGroupId = groupId.toLocaleLowerCase().replace(/\%/g, '_').replace(/\./g, '_').replace(/\ /g, '_');
    return [prefix, appId, 'groups', fixGroupId].join(KEYSEPARATOR);
}

const getMenuLabelKey = function(menuId){
    const prefix = getPrefix(MENU_KEY);
    return [prefix, `menu_${menuId}`].join(KEYSEPARATOR);
}

const getTabLabelKey = function(tabId){
    const prefix = getPrefix(CUSTOMTABS_KEY);
    return [prefix, tabId].join(KEYSEPARATOR);
}

const translationAppName = function(lng, appId, def){
    let key = getAppNameKey(appId);
    let keys = [key];
    let fallbackKey = appFallbackKeys.getAppLabelKey(appId);
    if(fallbackKey){
        keys.push(fallbackKey);
    }
    return translation(keys, lng) || def || '' 
}

const translationAppDescription = function(lng, appId, def){
    let key = getAppDescriptionKey(appId);
    let keys = [key];
    let fallbackKey = appFallbackKeys.getAppDescriptionKey(appId);
    if(fallbackKey){
        keys.push(fallbackKey);
    }
    return translation(keys, lng) || def || '' 
}

export const translationTabGroup = function(lng, appId, groupId, def){
    let key = getAppGroupKey(appId, groupId);
    let keys = [key];
    let fallbackKey = appFallbackKeys.getAppGroupKey(appId, groupId);
    if(fallbackKey){
        keys.push(fallbackKey);
    }
    return translation(keys, lng) || def || '' 
}

const translationMenuLabel = function(lng, menuId, def){
    let key = getMenuLabelKey(menuId);
    let keys = [key];
    let fallbackKey = appFallbackKeys.getMenuLabelKey(menuId);
    if(fallbackKey){
        keys.push(fallbackKey);
    }
    return translation(keys, lng) || def || '' 
}

export const translationTabLabel = function(lng: string, tabId: string, def){
    let key = getTabLabelKey(tabId);
    let keys = [key];
    let fallbackKey = appFallbackKeys.getTabKey(tabId)
    if(fallbackKey){
        keys.push(fallbackKey);
    }
    return translation(keys, lng) || def || ''; 
}

export const translationApp = function(lng: string, appId: string, app: StringMap){
    app.label = translationAppName(lng, appId, app.label || app.name);
    // app.name = app.label
    app.description = translationAppDescription(lng, appId, app.description);
    _.each(app.tab_groups,function(tab_group, index){
        app.tab_groups[index].id = tab_group.group_name;
        app.tab_groups[index].group_name = translationTabGroup(lng, appId, tab_group.group_name, tab_group.group_name);
    })
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

let processChildren = (item, parentKey, object) => {
    if (_.isArray(object)) {
        _.each(object, function (_citem) {
            processChildren(_citem, '', _citem);
        })
    } else if(object){
        _.each(_.keys(object), function (k) {
            let childKey = parentKey ? `${parentKey}.${k}` : k;
            let childValue = object[k];
            if (typeof childValue === "object") {
                if (_.isArray(childValue)) {
                    _.each(childValue, function (_citem) {
                        processChildren(_citem, childKey, childValue);
                    })
                } else {
                    processChildren(item, childKey, childValue);
                }
            }
            else {
                item[childKey] = childValue;
            }
        })
    }
}

export function convertTranslationData(record) {
    for (let k in record) {
        if (typeof record[k] === "object") {
            processChildren(record, k, record[k]);
        }
    }
    return record;
}

export const convertTranslation = function(_translation){
    let translation = clone(_translation);
    let template = {};

    _.each(translation.CustomApplications, function(app, appId){
        template[getAppNameKey(appId)] = app.name;
        template[getAppDescriptionKey(appId)] = app.description;
        _.each(app.groups,function(group, groupId){
            template[getAppGroupKey(appId, groupId)] = group;
        })
    })

    _.each(translation.CustomTabs, function(tab, tabId){
        template[getTabLabelKey(tabId)] = tab;
    })

    // _.each(translation.CustomMenus, function(menu, menuId){
    //     template[getMenuLabelKey(menuId)] = menu.label;
    // })

    _.each(translation.CustomLabels, function(labelValue, labelKey){
        if(labelKey != 'simpleschema' && _.isObject(labelValue)){
            const levelData = convertTranslationData({[labelKey]: labelValue});
            _.each(levelData, function(value, key){
                if(!_.isObject(value)){
                    template[getCustomLabelKey(key)] = value;
                }
            })
        }else{
            template[getCustomLabelKey(labelKey)] = labelValue;
        }
    })
    return template;
}

export const addTranslations = function(translations){
    _.each(translations, function(item){
        let data = convertTranslation(item.data);
        addResourceBundle(item.lng, NAMESPACE, data, true, true);
    })
}