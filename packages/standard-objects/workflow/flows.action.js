"use strict";
module.exports = {
    // 添加字段，包括主表字段和子表字段
    addFormFields: function (object_name, record_id, fields) {
        const record = Creator.getObjectRecord();
        const objectName = _.isObject(record.object_name) ? record.object_name.name : record.object_name;
        SteedosUI.showModal(stores.ComponentRegistry.components.ObjectForm, {
            name: "pick_fields_from_object",
            title: '选择字段',
            initialValues: {
                "object_name": objectName
            },
            objectSchema: {
                fields: {
                    "object_name": {
                        "type": "lookup",
                        "label": "绑定对象",
                        "reference_to": "objects",
                        "reference_to_field": "name",
                        "required": false,
                        "readonly": true,
                        "optionsFunction": function () {
                            var _options = [];
                            _.forEach(Creator.objectsByName, function (o, k) {
                                if (o.enable_workflow) {
                                    return _options.push({
                                        label: o.label,
                                        value: k,
                                        icon: o.icon
                                    });
                                }
                            });
                            return _options;
                        },
                    },
                    "instance_fields": {
                        "label": "申请单字段",
                        "type": "grid",
                        "is_wide": true,
                        "required": false,
                        "depend_on": [
                            "object_name"
                        ],
                        "visible_on": "{{formData.object_name ? true : false}}",
                        "sub_fields": {
                            "field_name": {
                                "label": "字段",
                                "type": "lookup",
                                "multiple": false,
                                "is_wide": false,
                                "required": true,
                                "reference_to": "object_fields",
                                "reference_to_field": "name",
                                "depend_on": [
                                    "object_name"
                                ],
                                "filtersFunction": function (filters, values) {
                                    const objectName = _.isObject(values.object_name) ? values.object_name.name : values.object_name;
                                    if (objectName) {
                                        if (values._grid_row_id) {
                                            var selected = _.find(values.instance_fields, function (item) { return item._id == values._grid_row_id });
                                            var selectedAll = _.pluck(values.instance_fields, 'field_name');
                                            if (selected) {
                                                selectedAll = _.difference(selectedAll, [selected.field_name]);
                                            }
                                            if (selectedAll && selectedAll.length > 0) {
                                                return [['object', '=', objectName], ['name', '!=', selectedAll]]
                                            }
                                        }
                                        return ['object', '=', objectName]
                                    } else {
                                        return ['_id', '=', 'no']
                                    }
                                }
                            },
                            "is_readonly": {
                                "label": "只读",
                                "type": "boolean"
                            },
                            "is_required": {
                                "label": "必填",
                                "type": "boolean"
                            },
                        }
                    },
                    "instance_table_fields": {
                        "label": "申请单子表",
                        "type": "grid",
                        "blackbox": true,
                        "is_wide": true,
                        "depend_on": [
                            "object_name"
                        ],
                        "visible_on": "{{formData.object_name ? true : false}}",
                        "sub_fields": {
                            "detail_field_fullname": {
                                "type": "lookup",
                                "label": "子表名称",
                                "optionsFunction": function (values) {
                                    if (!(values != null ? values.object_name : void 0)) {
                                        return [];
                                    }
                                    const objectName = _.isObject(values.object_name) ? values.object_name.name : values.object_name;
        
                                    const options = [];
        
                                    const { detailsInfo } = Steedos.authRequest('/am/forms/getDetailsInfo', {
                                        type: 'post',
                                        async: false,
                                        data: JSON.stringify({
                                            objectName
                                        })
                                    });
        
                                    _.each(detailsInfo, function (related) {
                                        let foo = related.split('.');
                                        let rObjectName = foo[0];
                                        let rFieldName = foo[1];
                                        let rObjectLable = Creator.getObject(rObjectName).label;
                                        let rObjectFieldLable = (_.find(Creator.getObject(rObjectName).fields, function (field) { return field.name === rFieldName }) || {}).label;
                                        options.push({ label: `${rObjectLable}.${rObjectFieldLable}`, value: related })
                                    })
                                    return options;
                                }
                            },
                            "label": {
                                "label": "显示标题",
                                "type": "text",
                            },
                            "field_names": {
                                "label": "显示的字段",
                                "type": "lookup",
                                "create": false,
                                "multiple": true,
                                "reference_to": "object_fields",
                                "reference_to_field": "name",
                                "depend_on": [
                                    "object_name",
                                    "instance_table_fields"
                                ],
                                "filtersFunction": function (filters, values) {
                                    let relatedFieldFullname = null;
                                    const rowValue = _.find(values.instance_table_fields, function (item) {
                                        return item._id === values._grid_row_id
                                    })
                                    if (rowValue) {
                                        relatedFieldFullname = rowValue.detail_field_fullname
                                    }
                                    if (relatedFieldFullname) {
                                        const objectName = relatedFieldFullname.substring(0, relatedFieldFullname.indexOf("."))
                                        return ['object', '=', objectName]
                                    } else {
                                        return ['_id', '=', 'no']
                                    }
                                }
                            }
                        }
                    }
                }
            },
            onFinish: async (values = {}) => {
                console.log('values: ', values);
                $(document.body).addClass('loading');
                let url = '/am/forms/addFieldsFromObject';
                let options = {
                    type: 'post',
                    async: true,
                    data: JSON.stringify({
                        formId: formId,
                        ...values
                    }),
                    success: function (data) {
                        toastr.success('添加成功');
                        Modal.hide();
                        $(document.body).removeClass('loading');
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        console.error(XMLHttpRequest.responseJSON);
                        toastr.error(XMLHttpRequest.responseJSON.error.replace(/:/g, '：'))
                        $(document.body).removeClass('loading');
                    }
                };
                Steedos.authRequest(url, options);
                return true;
            }
        }, null, { iconPath: '/assets/icons' })
    },
    addFormFieldsVisible: function (object_name, record_id, record_permissions, record) {
        console.log('record: ', record);
        return record && record.object_name;
    },

    // 添加字段
    addFormFieldFromObject: function (object_name, record_id, fields) {
        var record = Creator.getObjectRecord(object_name, record_id, 'name,form,object_name');
        var formId = _.isObject(record.form) ? record.form._id : record.form;
        let objectName = _.isObject(record.object_name) ? record.object_name.name : record.object_name;
        let objectInfo = Creator.getObject(objectName);
        let objectFields = objectInfo.fields;
        const rows = [];
        for (const key in objectFields) {
            if (Object.hasOwnProperty.call(objectFields, key)) {
                const field = objectFields[key];
                if (!['grid', 'object'].includes(field.type) && !(field.name.indexOf('.') > -1 || field.name.indexOf('$') > -1)) {
                    rows.push(field);
                }
            }
        }
        const props = {
            title: `选择 对象字段`,
            objectApiName: "object_fields",
            listSchema: {
                columns: ["label", "name", "type", "group", "sort_no"]
            },
            multiple: true,
            rows: rows,
            rowKey: 'name',
            onFinish: async (selectedRowKeys, selectedRows) => {
                console.log("selectedRowKeys:", selectedRowKeys);
                console.log("selectedRows:", selectedRows);
                if (selectedRowKeys.length < 1) {
                    return;
                }
                $(document.body).addClass('loading');
                let url = '/am/forms/addFieldFromObject';
                let options = {
                    type: 'post',
                    async: true,
                    data: JSON.stringify({
                        fields: selectedRows,
                        formId: formId
                    }),
                    success: function (data) {
                        toastr.success('添加成功');
                        Modal.hide();
                        $(document.body).removeClass('loading');
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        console.error(XMLHttpRequest.responseJSON);
                        toastr.error(XMLHttpRequest.responseJSON.error.replace(/:/g, '：'))
                        $(document.body).removeClass('loading');
                    }
                };
                Steedos.authRequest(url, options);
                return true;
            },
            sort: [{ field_name: "sort_no", order: "asc" }]
        };
        SteedosUI.showModal(window.stores.ComponentRegistry.components.ObjectTable, props)
    },
    addFormFieldFromObjectVisible: function (object_name, record_id, record_permissions, record) {
        // var record = Creator.getObjectRecord(object_name, record_id, 'object_name');
        // if (record && record.object_name) {
        //     return true;
        // }
        return false;
    },

    // 添加子表
    addFormTableFromObject: function (object_name, record_id, fields) {
        var record = Creator.getObjectRecord(object_name, record_id, 'name,form,object_name');
        var formId = _.isObject(record.form) ? record.form._id : record.form;
        let objectName = _.isObject(record.object_name) ? record.object_name.name : record.object_name;

        var _showFeildsModal = function (selectedObj, rows) {
            SteedosUI.showModal(window.stores.ComponentRegistry.components.ObjectTable, {
                title: `选择 ${selectedObj.label}的字段`,
                objectApiName: "object_fields",
                listSchema: {
                    columns: ["label", "name", "type", "group", "sort_no"]
                },
                multiple: true,
                rows: rows,
                rowKey: 'name',
                onFinish: async (selectedRowKeys, selectedRows) => {
                    console.log("selectedRowKeys:", selectedRowKeys);
                    console.log("selectedRows:", selectedRows);
                    if (selectedRowKeys.length < 1) {
                        return;
                    }
                    $(document.body).addClass('loading');
                    let url = '/am/forms/addTableFromObject';
                    let options = {
                        type: 'post',
                        async: true,
                        data: JSON.stringify({
                            tables: [{ 'name': selectedObj.name, 'label': selectedObj.label, 'fields': selectedRows }],
                            formId: formId
                        }),
                        success: function (data) {
                            toastr.success('添加成功');
                            Modal.hide();
                            $(document.body).removeClass('loading');
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            console.error(XMLHttpRequest.responseJSON);
                            toastr.error(XMLHttpRequest.responseJSON.error.replace(/:/g, '：'))
                            $(document.body).removeClass('loading');
                        }
                    };
                    Steedos.authRequest(url, options);
                    return true;
                },
                sort: [{ field_name: "sort_no", order: "asc" }]
            })
        }

        Steedos.authRequest('/am/forms/getDetails', {
            type: 'post',
            async: true,
            data: JSON.stringify({
                objectName
            }),
            success: function (data) {
                const { details } = data;
                let detailsInfo = [];
                for (const dObjName of details) {
                    const dObj = Creator.getObject(dObjName);
                    if (dObj) {
                        detailsInfo.push({ name: dObj.name, label: dObj.label });
                    }
                }
                SteedosUI.showModal(stores.ComponentRegistry.components.ObjectTable, {
                    title: `请选择子表`,
                    listSchema: {
                        columns: [
                            { field: "label" },
                        ],
                    },
                    objectSchema: {
                        fields: {
                            'name': { type: 'text', label: '对象名' },
                            'label': { type: 'text', label: '对象' },
                        }
                    },
                    rows: detailsInfo,
                    rowSelection: 'single',
                    rowKey: 'name',
                    onFinish: async (selectedObjKeys, selectedObjs) => {
                        if (selectedObjKeys.length < 1) {
                            throw new Error(`请选择对象。`);
                        }
                        console.log('selectedObjs: ', selectedObjs);
                        var selectedObj = selectedObjs[0];
                        let objectInfo = Creator.getObject(selectedObj.name);
                        let objectFields = objectInfo.fields;
                        const rows = [];
                        for (const key in objectFields) {
                            if (Object.hasOwnProperty.call(objectFields, key)) {
                                const field = objectFields[key];
                                if (!['grid', 'object'].includes(field.type) && !(field.name.indexOf('.') > -1 || field.name.indexOf('$') > -1)) {
                                    rows.push(field);
                                }
                            }
                        }

                        setTimeout(function () {
                            _showFeildsModal(selectedObj, rows);
                        }, 100);
                        return true;
                    }
                })
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.error(XMLHttpRequest.responseJSON);
                toastr.error(XMLHttpRequest.responseJSON.error.replace(/:/g, '：'))
            }
        });


    },
    addFormTableFromObjectVisible: function (object_name, record_id, record_permissions, record) {
        // var record = Creator.getObjectRecord(object_name, record_id, 'object_name');
        // if (record && record.object_name) {
        //     return true;
        // }
        return false;
    }
}