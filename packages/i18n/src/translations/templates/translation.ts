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

function getTabGroupsTemplate(groups){
    const template = {groups:{}};
    if(groups){
        _.each(groups, function(group){
            let groupKey = group.group_name.toLocaleLowerCase().replace(/\%/g, '_').replace(/\./g, '_').replace(/\ /g, '_');
            template.groups[groupKey] = group.group_name;
        })
        return template;
    }else{
        return {};
    }
}

const getAppTranslationTemplate = function(app){
    return Object.assign({},keysToJSON(['name', 'description'], app),getTabGroupsTemplate(app.tab_groups));
}

const getTabItemTranslationTemplate = function(tabs){
    const template = {};
    _.each(tabs, function(tab,tabId){
        template[tabId] = tabId;
    })
    return template;
}

const getTabTranslationTemplate = function(tabs){
    const template = {};
    _.each(tabs, function(tab){
        let tabKey = tab.toLocaleLowerCase().replace(/\%/g, '_').replace(/\./g, '_').replace(/\ /g, '_');
        template[tabKey] = tab;
    })
    return template;
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
    let CustomTabs = {};
    if(app.tab_items){
        CustomTabs = getTabItemTranslationTemplate(app.tab_items);
    }else if(app.tabs){
        CustomTabs = getTabTranslationTemplate(app.tabs);
    }
    let template = Object.assign({}, {CustomApplications: {[appId]: getAppTranslationTemplate(app)}}, {CustomTabs});
    // template = Object.assign({}, template, {CustomMenus: getMenuTranslationTemplate(app.admin_menus)});
    return template;
}

