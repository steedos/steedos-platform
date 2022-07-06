/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-05 15:55:39
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-06 11:43:04
 * @Description: 
 */
import { fetchAPI } from './steedos.client';
import { getObjectList } from './converter/amis/index';

const _ = require('lodash');

export async function getUISchema(objectName){
    console.log(`getUISchema: ${objectName}`);
    const url = `/service/api/@${objectName.replace(/\./g, "_")}/uiSchema`;
    const uiSchema = await fetchAPI(url, {method: 'get'});
    return uiSchema ;
}

export async function getFormSchema(objectName){

}

export async function getViewSchema(objectName){

}

export async function getListSchema(objectName, listViewName = 'all'){
    const uiSchema = await getUISchema(objectName);

    const listView = _.find(uiSchema.list_views, listView => listView.name === listViewName);

    if(!listView){
        return {};
    }
    let fields = uiSchema.fields;
    const listViewFields = [];
    console.log('listView', listView)
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
    return await getObjectList(uiSchema, fields);
}