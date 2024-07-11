
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
        "className": "",
        "id": "u:b3d626885b90",
        "enableTabs": true,
        "mode": "edit",
        "layout": "normal"
    };
    return {
        type: 'service',
        name: getScopeId(objectApiName, "form"),
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
            "showHeader": true
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
        "className": "steedos-record-tabs bg-white p-4 sm:m-2 sm:border sm:rounded",
        "tabs": [
            detailed
        ]
    };
    if (hasRelatedLists) {
        content.tabs.push(related)
    }
    body = [
        {
            "type": "steedos-record-detail-header",
            "label": "标题面板",
            "objectApiName": "${objectName}",
            "recordId": "${recordId}",
            "showBackButton": "${!_inDrawer}"
        },
        content
    ];
    return {
        type: 'steedos-record-service',
        id: `page_${objectApiName}_record_detail`,
        name: getScopeId(objectApiName, "record_detail"),
        objectApiName: "${objectName}",
        bodyClassName: '',
        className: "object-detail-page steedos-record-content overflow-y-auto p-0 m-0 flex-1 h-full bg-gray-100",
        regions: [
            "body"
        ],
        body
    }
}

// 获取字段布局页面初始化amisSchema
const getFieldLayoutInitSchema = async function (objectApiName, userSession) {
    const fieldProps = ["_name", "name", "type", "amis", "auto_fill_mapping", "autonumber_enable_modify", "column_name", "coordinatesType", "create", "data_type",
        "defaultValue", "deleted_lookup_record_behavior", "depend_on", "description", "enable_enhanced_lookup", "enable_thousands", "filterable", "filters", "filtersFunction", "formula_blank_value", "formula",
        "generated", "group", "hidden", "index", "inlineHelpText", "is_customize", "is_name", "is_system", "is_wide", "label", "language", "multiple", "object", "options", "precision", "primary", "readonly", "reference_to_field",
        "reference_to", "required", "rows", "scale", "searchable", "show_as_qr", "sort_no", "sortable", "static", "summary_field", "summary_object", "summary_filters", "summary_type", "unique", "visible_on", "write_requires_master_read"
    ];
    var body = [];
    const uiSchema = await getUISchema(objectApiName, userSession);
    const groups = uiSchema.field_groups || [];
    const object = await objectql.getObject('object_fields');
    const fields = await object.find({filters: ['object','=', objectApiName]});

    _.forEach(fields, (field,index) => {
        if (field.group) {
            let current_group = _.find(groups, function (group) { return group.group_name == field.group; });
            if (!current_group) {
                groups.push({
                    group_name: field.group
                })
            }
        }
        fields[index] = _.pick(field,fieldProps)
    });

    const no_group_fields = _.filter(fields, field => !field.group);
    body.push({
        "type": "fieldSet",
        "title": "",
        "body": _.map(no_group_fields, field => {
            return {
                "type": "steedos-field",
                "config": {
                    "amis": {
                    },
                    ...field
                }
            }
        })
    })

    _.forEach(groups, group => {
        const filter_fields = _.filter(fields, field => field.group == group.group_name);
        const field_set = {
            "type": "fieldSet",
            "title": group.group_name,
            "body": _.map(filter_fields, field => {
                return {
                    "type": "steedos-field",
                    "config": {
                        "amis": {
                        },
                        ...field
                    }
                }
            })
        };
        if (group.visible_on) {
            field_set.visibleOn = group.visible_on;
        }
        if (group.collapsed) {
            field_set.collapsed = group.collapsed;
        }
        body.push(field_set)
    })
    return {
        type: 'service',
        name: getScopeId(objectApiName, "form"),
        className: "steedos-amis-form steedos-field-layout-page",
        body
    }
}


exports.getFormPageInitSchema = getFormPageInitSchema;
exports.getListPageInitSchema = getListPageInitSchema;
exports.getRecordPageInitSchema = getRecordPageInitSchema;
exports.getFieldLayoutInitSchema = getFieldLayoutInitSchema;