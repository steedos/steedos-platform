import { addObjectFieldConfig } from './field'
import { addObjectButtonsConfig } from './button'
import { addAppConfig, loadObjectLayoutMetadata, SteedosDataSourceType } from '..';
import { addTabConfig } from './tabs';
import { registerRestrictionRules } from '../metadata-register/restrictionRules';
import { registerShareRules } from '../metadata-register/shareRules';
import { getSteedosSchema } from '../types/schema';

declare var Creator: any;

export const preloadDBObjectFields = async function(datasource: SteedosDataSourceType){
    const tableName = "object_fields";
    if(datasource.name === 'meteor'){
        Creator.Collections[tableName] = Creator.createCollection({name: tableName});
    }
    let fields: any = await datasource.find(tableName, {});
    fields.forEach(element => {
        addObjectFieldConfig(element.object, element);
    });
}

export const preloadDBObjectButtons = async function(datasource: SteedosDataSourceType){
    const tableName = "object_actions";
    if(datasource.name === 'meteor'){
        Creator.Collections[tableName] = Creator.createCollection({name: tableName});
    }
    let buttons: any = await datasource.find(tableName , {filters: ['is_enable','=',true]});
    buttons.forEach(element => {
        addObjectButtonsConfig(element.object, element);
    });
}

export const preloadDBApps = async function(datasource: SteedosDataSourceType){
    const tableName = "apps";
    if(datasource.name === 'meteor'){
        Creator.Collections[tableName] = Creator.createCollection({name: tableName});
    }
    let apps: any = await datasource.find(tableName , {filters: ['visible','=',true]});
    for await (const element of apps) {
        await addAppConfig(element, `~database-${tableName}`);
    }
}

export const preloadDBTabs = async function(datasource: SteedosDataSourceType){
    const tableName = "tabs";
    if(datasource.name === 'meteor'){
        Creator.Collections[tableName] = Creator.createCollection({name: tableName});
    }
    let tabs: any = await datasource.find(tableName, {});
    for await (const element of tabs) {
        await addTabConfig(element, `~database-${tableName}`);
    }
}

export const preloadDBObjectLayouts = async function(datasource: SteedosDataSourceType){
    const tableName = "object_layouts";
    if(datasource.name === 'meteor'){
        Creator.Collections[tableName] = Creator.createCollection({name: tableName});
    }
    let objectLayouts: any = await datasource.find(tableName, {});
    for await (const element of objectLayouts) {
        await loadObjectLayoutMetadata(element, `~database-${tableName}`);
    }
}


export const preloadDBRestrictionRules = async function (datasource: SteedosDataSourceType) {
    const schema = getSteedosSchema();
    const tableName = "restriction_rules";
    if (datasource.name === 'meteor') {
        Creator.Collections[tableName] = Creator.createCollection({ name: tableName });
    }
    let records: any = await datasource.find(tableName, {});

    for await (const element of records) {
        await registerRestrictionRules.register(schema.broker, `~database-${tableName}`, element);
    }
}

export const preloadDBShareRules = async function (datasource: SteedosDataSourceType) {
    const schema = getSteedosSchema();
    const tableName = "share_rules";
    if (datasource.name === 'meteor') {
        Creator.Collections[tableName] = Creator.createCollection({ name: tableName });
    }
    let records: any = await datasource.find(tableName, {});

    for await (const element of records) {
        await registerShareRules.register(schema.broker, `~database-${tableName}`, element);
    }
}