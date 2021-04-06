import { addObjectFieldConfig } from './field'
import { addObjectButtonsConfig } from './button'
import { addAppConfig, SteedosDataSourceType } from '..';

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

export const preloadDBApps = async function(datasource: SteedosDataSourceType, serviceName: string){
    const tableName = "apps";
    if(datasource.name === 'meteor'){
        Creator.Collections[tableName] = Creator.createCollection({name: tableName});
    }
    let apps: any = await datasource.find(tableName , {filters: ['visible','=',true]});
    apps.forEach(element => {
        addAppConfig(element, serviceName);
    });
}
