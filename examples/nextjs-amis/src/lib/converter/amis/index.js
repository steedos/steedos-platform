import { getAuthToken , getTenantId } from '@/lib/steedos.client.js';
import { getReadonlyFormInitApi, getSaveApi, getEditFormInitApi } from '@/lib/converter/amis/api';
import { getTableSchema, getTableApi } from '@/lib/converter/amis/fields/table';
import { getFormBody } from '@/lib/converter/amis/form';
import { map } from 'lodash';

const ROOT_URL = process.env.NEXT_PUBLIC_STEEDOS_ROOT_URL

function getBulkActions(){
    return [
        {
          "label": "批量删除",
          "actionType": "ajax",
          "api": "delete:https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/sample/${ids|raw}",
          "confirmText": "确定要批量删除?"
        },
        {
          "label": "批量修改",
          "actionType": "dialog",
          "dialog": {
            "title": "批量编辑",
            "name": "sample-bulk-edit",
            "body": {
              "type": "form",
              "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/sample/bulkUpdate2",
              "controls": [
                {
                  "type": "hidden",
                  "name": "ids"
                },
                {
                  "type": "text",
                  "name": "name",
                  "label": "Name"
                }
              ]
            }
          }
        }
      ]
}

function getHeaderToolbar(mainObject){
    return [
        "filter-toggler",
        "bulkActions",
        {
            "type": "export-excel",
            "align": "right"
        },
        {
            "type": "reload",
            "align": "right"
        },
        {
            "type": "columns-toggler",
            "align": "right"
        },
        {
            "type": "drag-toggler",
            "align": "right"
        },
        {
            "type": "pagination",
            "align": "right"
        }
    ]
}

function getToolbar(){
    return [
        
      ]
}

function footerToolbar(){
    return [
        "statistics",
        "switch-per-page",
        "pagination"
      ]
}

function getFilter(){
    return {
        "title": "条件搜索",
        "submitText": "",
        "body": [
          {
            "type": "input-text",
            "name": "name",
            "placeholder": "合同名称",
            "addOn": {
              "label": "搜索",
              "type": "submit"
            }
          }
        ]
      }
}

export function getObjectList(objectSchema, fields, options){
    const table = getTableSchema(fields, Object.assign({idFieldName: objectSchema.idFieldName}, options));
    delete table.mode;
    const bulkActions = getBulkActions()
    return {
        type: 'page',
        bodyClassName: 'm-4 bg-white rounded-lg',
        name: `page_list_${objectSchema.name}`,
        data: {context: {rootUrl: ROOT_URL, tenantId: getTenantId(), authToken: getAuthToken()}},
        body: Object.assign({}, table, {type: 'crud',  primaryField: '_id', keepItemSelectionOnPageChange: true, api: getTableApi(objectSchema, fields)}, {toolbar: getToolbar(), footerToolbar: footerToolbar(), headerToolbar: getHeaderToolbar(objectSchema), "bulkActions": bulkActions, filter: getFilter()})
    }
    return 
}




export function getObjectForm(objectSchema, recordId){
    const fields = _.values(objectSchema.fields);
    return {
        type: 'page',
        bodyClassName: 'p-4',
        regions: [
            "body"
        ],
        name: `page_edit_${recordId}`,
        data: {recordId: recordId, objectName: objectSchema.name, context: {rootUrl: ROOT_URL, tenantId: getTenantId(), authToken: getAuthToken()}},
        initApi: null,
        initFetch: null ,
        body: [
            {
                type: "form",
                mode: "horizontal",
                persistData: false,
                promptPageLeave: true,
                name: `form_edit_${recordId}`,
                debug: false,
                title: "",
                api: getSaveApi(objectSchema, recordId, fields, {}),
                initApi: getEditFormInitApi(objectSchema, recordId, fields),
                initFetch: true,
                body: getFormBody(fields, objectSchema),
                panelClassName:'m-0 rounded-lg',
                bodyClassName: 'p-4',
                className: 'steedos-amis-form',
                reload: 'window'
            }
        ]
    }
}

export function getObjectDetail(objectSchema, recordId){
    const fields = _.values(objectSchema.fields);
    return {
        type: 'page',
        bodyClassName: 'p-4',
        regions: [
            "body"
        ],
        name: `page_readonly_${recordId}`,
        data: {context: {rootUrl: ROOT_URL, tenantId: getTenantId(), authToken: getAuthToken()}},
        initApi: getReadonlyFormInitApi(objectSchema, recordId, fields),
        initFetch: true ,
        body: [
            {
                type: "form",
                mode: "horizontal",
                persistData: false,
                promptPageLeave: false,
                name: `form_readonly_${recordId}`,
                debug: false,
                title: "",
                body: getFormBody(map(fields, (field)=>{field.readonly = true;}), objectSchema),
                panelClassName:'m-0 rounded-lg',
                bodyClassName: 'p-4',
                className: 'steedos-amis-form',
                submitText: '' //不显示提交按钮
            }
        ]
    }
}