/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-05-29 11:01:45
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-29 14:58:54
 * @Description: 
 */
import { addObjectFieldConfig } from './field'
import { addObjectButtonsConfig } from './button'
import { loadObjectLayoutMetadata } from './layout';
import { addTabConfig } from './tabs';
import { registerRestrictionRules } from '../metadata-register/restrictionRules';
import { registerShareRules } from '../metadata-register/shareRules';
import { registerPermissionFields } from '../metadata-register/permissionFields';
import { MetadataRegister } from '../metadata-register';

declare var Creator: any;

export const preloadDBObjectFields = async function(datasource: any){
    const tableName = "object_fields";
    if(datasource.name === 'meteor'){
        Creator.Collections[tableName] = Creator.createCollection({name: tableName});
    }
    let fields: any = await datasource.find(tableName, {});
    fields.forEach(element => {
        addObjectFieldConfig(element.object, element);
    });
}

export const preloadDBObjectButtons = async function(datasource: any){
    const tableName = "object_actions";
    if(datasource.name === 'meteor'){
        Creator.Collections[tableName] = Creator.createCollection({name: tableName});
    }
    let buttons: any = await datasource.find(tableName , {filters: ['is_enable','=',true]});
    buttons.forEach(element => {
        addObjectButtonsConfig(element.object, element);
    });
}

export const preloadDBApps = async function(datasource: any){
    const tableName = "apps";
    if(datasource.name === 'meteor'){
        Creator.Collections[tableName] = Creator.createCollection({name: tableName});
    }
    let apps: any = await datasource.find(tableName , {}); // 此处不过滤禁用的app , 支持通过db中的app禁用元数据中定义的app filters: ['visible','=',true]
    for await (const element of apps) {
        MetadataRegister.addApp(`~database-${tableName}`, element);
    }
}

export const preloadDBTabs = async function(datasource: any){
    const tableName = "tabs";
    if(datasource.name === 'meteor'){
        Creator.Collections[tableName] = Creator.createCollection({name: tableName});
    }
    let tabs: any = await datasource.find(tableName, {});
    for await (const element of tabs) {
        await addTabConfig(element, `~database-${tableName}`);
    }
}

export const preloadDBObjectLayouts = async function(datasource: any){
    const tableName = "object_layouts";
    if(datasource.name === 'meteor'){
        Creator.Collections[tableName] = Creator.createCollection({name: tableName});
    }
    let objectLayouts: any = await datasource.find(tableName, {});
    for await (const element of objectLayouts) {
        await loadObjectLayoutMetadata(element, `~database-${tableName}`);
    }
}


export const preloadDBRestrictionRules = async function (datasource: any) {
    const tableName = "restriction_rules";
    if (datasource.name === 'meteor') {
        Creator.Collections[tableName] = Creator.createCollection({ name: tableName });
    }
    let records: any = await datasource.find(tableName, {});

    for await (const element of records) {
        await registerRestrictionRules.register(broker, `~database-${tableName}`, element);
    }
}

export const preloadDBShareRules = async function (datasource: any) {
    const tableName = "share_rules";
    if (datasource.name === 'meteor') {
        Creator.Collections[tableName] = Creator.createCollection({ name: tableName });
    }
    let records: any = await datasource.find(tableName, {});

    for await (const element of records) {
        await registerShareRules.register(broker, `~database-${tableName}`, element);
    }
}

export const preloadDBPermissionFields = async function (datasource: any) {
    const tableName = "permission_fields";
    if (datasource.name === 'meteor') {
        Creator.Collections[tableName] = Creator.createCollection({ name: tableName });
    }
    let records: any = await datasource.find(tableName, {});
    if (records && records.length > 0) {
        await registerPermissionFields.mregister(broker, `~database-${tableName}`, records);
    }
}