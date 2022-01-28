"use strict";
module.exports = {
    // 
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
                if (!['lookup', 'master_detail', 'grid', 'object'].includes(field.type) && !(field.name.indexOf('.') > -1 || field.name.indexOf('$') > -1)) {
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
        var record = Creator.getObjectRecord(object_name, record_id, 'object_name');
        if (record && record.object_name) {
            return true;
        }
        return false;
    },

    // 
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
                                if (!['lookup', 'master_detail', 'grid', 'object'].includes(field.type) && !(field.name.indexOf('.') > -1 || field.name.indexOf('$') > -1)) {
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
        var record = Creator.getObjectRecord(object_name, record_id, 'object_name');
        if (record && record.object_name) {
            return true;
        }
        return false;
    }
}