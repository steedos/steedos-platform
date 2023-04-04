
const objectql = require("@steedos/objectql");

const callObjectServiceAction = async function (actionName, userSession, data) {
    const broker = objectql.getSteedosSchema().broker;
    return broker.call(actionName, data || {}, { meta: { user: userSession } })
}

const getUISchema = async function (objectName, userSession) {
    return await callObjectServiceAction(`objectql.getRecordView`, userSession, { objectName });
}

const getScopeId = function (objectApiName, type) {
    return `page_${objectApiName}_${type}`;
}

// 获取对象表单初始化amisSchema
const getFormPageInitSchema = function (objectApiName) {
    const amisSchema = {
        "type": "steedos-object-form",
        "label": "对象表单",
        "objectApiName": objectApiName,
        "recordId": "${recordId}",
        "className": "sm:border sm:shadow sm:rounded sm:border-gray-300 bg-white p-4",
        "id": "u:b3d626885b90",
        "mode": "edit",
        "layout": "normal"
    };
    return {
        type: 'page',
        name: getScopeId(objectApiName, "form"),
        bodyClassName: '',
        regions: [
            "body"
        ],
        body: [
            amisSchema
        ]
    }
}

// 获取对象列表页面初始化amisSchema
const getListPageInitSchema = function (objectApiName) {
    return {
        type: 'page',
        name: getScopeId(objectApiName, "list"),
        bodyClassName: '',
        regions: [
            "body"
        ],
        body: [{
            "type": "steedos-object-listview",
            "objectApiName": objectApiName,
            "columnsTogglable": false,
            "showHeader": true,
            className: "sm:border bg-white sm:shadow sm:rounded border-slate-300 border-solid"
        }]
    }
}

// 获取对象记录详细页面初始化amisSchema
const getRecordPageInitSchema = async function (objectApiName, userSession) {
    var body = [];
    const uiSchema = await getUISchema(objectApiName, userSession);
    const hasRelatedLists = !!((uiSchema.related_lists || []).length || (uiSchema.details || []).length)
    const detailed = {
        "title": "详细",
        "className": "px-0 py-4",
        "body": [
            {
                "type": "steedos-object-form",
                "label": "对象表单",
                "objectApiName": "${objectName}",
                "recordId": "${recordId}",
                "appId": "${appId}"
            }
        ],
        "id": "u:5d4e7e3f6ecc"
    };
    const related = {
        "title": "相关",
        "className": "px-0 pt-4",
        "body": [
            {
                "type": "steedos-object-related-lists",
                "label": "相关列表",
                "objectApiName": "${objectName}",
                "recordId": "${recordId}",
                "appId": "${appId}"
            }
        ]
    }
    const content = {
        "type": "tabs",
        "className": "sm:mt-3 bg-white sm:shadow sm:rounded sm:border border-slate-300 p-4",
        "tabs": [
            detailed
        ]
    };
    if (hasRelatedLists) {
        content.tabs.push(related)
    }
    const amisSchema = {
        "type": "service",
        "body": [
            {
                "type": "steedos-record-detail-header",
                "label": "标题面板",
                "objectApiName": "${objectName}",
                "recordId": "${recordId}",
                onEvent: {
                    "recordLoaded": {
                        "actions": [
                            {
                                "actionType": "reload",
                                "data": {
                                    "name": `\${event.data.record.${uiSchema?.NAME_FIELD_KEY || 'name'}}`,
                                    "record": `\${event.data.record}`,
                                    "recordLoaded": true,
                                }
                            },
                            {
                                "actionType": "reload",
                                "componentId": `page_readonly_${objectApiName}_header`,  //刷新标题, 详细页面header service 嵌套太多, 导致仅刷新第一层service无法更新recordName
                                "data": {
                                    "name": `\${event.data.record.${uiSchema?.NAME_FIELD_KEY || 'name'}}`,
                                    "record": `\${event.data.record}`,
                                    "recordLoaded": true,
                                }
                            }
                        ]
                    }
                },
            },
            content
        ],
        data: {
            "_master.objectName": "${objectName}",
            "_master.recordId": "${recordId}"
        },
        onEvent: {
            "recordLoaded": {
                "actions": [
                    {
                        "actionType": "reload",
                        "data": {
                            "name": `\${record.${uiSchema?.NAME_FIELD_KEY || 'name'}}`,
                            "_master.record": `\${record}`,
                            // 不清楚reload 如何给对象下的某个key复制, 所以此处重复设置_master的objectName、recordId
                            "_master.objectName": "${objectName}",
                            "_master.recordId": "${recordId}"
                        }
                    }
                ]
            }
        },
    }
    body.push(amisSchema);
    return {
        type: 'page',
        id: `page_${objectApiName}_record_detail`,
        name: getScopeId(objectApiName, "record_detail"),
        bodyClassName: '',
        regions: [
            "body"
        ],
        body
    }
}


exports.getFormPageInitSchema = getFormPageInitSchema;
exports.getListPageInitSchema = getListPageInitSchema;
exports.getRecordPageInitSchema = getRecordPageInitSchema;