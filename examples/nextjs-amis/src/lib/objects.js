/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-05 15:55:39
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-13 18:13:17
 * @Description: 
 */
import { fetchAPI } from './steedos.client';
import { getObjectList, getObjectDetail, getObjectForm } from './converter/amis/index';

const _ = require('lodash');

const UI_SCHEMA_CACHE = {};

const setUISchemaCache = (key, value)=>{
    UI_SCHEMA_CACHE[key] = value;
}

const getUISchemaCache = (key)=>{
    return _.cloneDeep(UI_SCHEMA_CACHE[key]);
}

const hasUISchemaCache = (key)=>{
    return _.has(UI_SCHEMA_CACHE, key);
}

export async function getUISchema(objectName){
    if(!objectName){
        return ;
    }
    if(hasUISchemaCache(objectName)){
        return getUISchemaCache(objectName);
    }
    const url = `/service/api/@${objectName.replace(/\./g, "_")}/uiSchema`;
    let uiSchema = null;
    try {
        uiSchema = await fetchAPI(url, {method: 'get'});
        setUISchemaCache(objectName, uiSchema);
        for(const fieldName in uiSchema.fields){
            if(uiSchema.fields){
                const field = uiSchema.fields[fieldName];

                if((field.type === 'lookup' || field.type === 'master_detail') && field.reference_to){
                    const refUiSchema = await getUISchema(field.reference_to);
                    if(!refUiSchema){
                        delete uiSchema.fields[fieldName];
                    }
                }
            }
        }
    } catch (error) {
        console.error(`getUISchema`, objectName, error);
        setUISchemaCache(objectName, null);
    }
    return getUISchemaCache(objectName) ;
}

export async function getFormSchema(objectName, ctx){
    const uiSchema = await getUISchema(objectName);
    const amisSchema = await getObjectForm(uiSchema, ctx);
    return {
        uiSchema,
        amisSchema
    }
}

export async function getViewSchema(objectName, recordId){
    const uiSchema = await getUISchema(objectName);
    const amisSchema = await getObjectDetail(uiSchema, recordId);
    return {
        uiSchema,
        amisSchema
    }
}

export async function getListSchema(appName, objectName, listViewName = 'all', options = {}){
    const uiSchema = await getUISchema(objectName);

    const listView = _.find(uiSchema.list_views, (listView, name) => name === listViewName);

    if(!listView){
        return {};
    }
    let fields = uiSchema.fields;
    const listViewFields = [];
    if(listView && listView.columns){
        _.each(listView.columns, function(column){
            if(uiSchema.fields[column.field]){
                if(_.isString(column)){
                    listViewFields.push(uiSchema.fields[column])
                }else if(_.isObject(column)){
                    listViewFields.push(Object.assign({}, uiSchema.fields[column.field], {width: column.width, wrap: column.wrap}))
                }
            }
        })
    }
    fields = listViewFields;
    const amisSchema = await getObjectList(uiSchema, fields, {tabId: objectName, appId: appName, ...options});
    return {
        uiSchema,
        amisSchema
    }
}

export async function getField(objectName, fieldName){
    const uiSchema = await getUISchema(objectName);
    return uiSchema?.fields[fieldName];
}

export async function getObjectRelateds(appName, objectName, recordId){
    const uiSchema = await getUISchema(objectName);

    const related = [];

    const details = [].concat(uiSchema.details || [])

    if(uiSchema.enable_files){
        details.push(`cms_files.parent`)
    }

    for (const detail of details) {
        const arr = detail.split('.');

        let filter = null;
        const refField = await getField(arr[0], arr[1]);
        if(refField._reference_to || (refField.reference_to && !_.isString(refField.reference_to))){
            filter =  [[`${arr[1]}/o`, '=', objectName], [`${arr[1]}/ids`, 'eq', recordId]];
        }else{
            filter = [`${arr[1]}`, '=', recordId] ;
        }

        related.push({
            object_name: arr[0], 
            foreign_key: arr[1],
            schema: await getListSchema(appName, arr[0], 'all', {filter: filter})
        })
    }
    console.log(related);
    return related;
}