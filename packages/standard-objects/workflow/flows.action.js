"use strict";
module.exports = {
    // 添加字段，包括主表字段和子表字段
    addFormFields: function (object_name, record_id, fields) {
        // const record = Creator.getObjectRecord();
        var queryResult = Steedos.authRequest("/graphql", {
            type: 'POST',
            async: false,
            data: JSON.stringify({
                query: "{record:flows__findOne(id: \"" + record_id + "\"){_id, object_name, form, instance_fields, instance_table_fields}}"
            }),
            type: 'POST',
            contentType: 'application/json',
            error: function () { }
        });
        var record = queryResult && queryResult.data && queryResult.data.record;
        const objectName = _.isObject(record.object_name) ? record.object_name.name : record.object_name;
        var formId = _.isObject(record.form) ? record.form._id : record.form;
        SteedosUI.showModal(stores.ComponentRegistry.components.ObjectForm, {
            name: "pick_fields_from_object",
            title: '选择字段',
            initialValues: {
                "object_name": objectName,
                "instance_fields": record.instance_fields,
                "instance_table_fields": record.instance_table_fields
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
                            "name": {
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
                                        const baseFieldKeys = Object.keys(Creator.getObject('base').fields)
                                        if (values._grid_row_id) {
                                            var selected = _.find(values.instance_fields, function (item) { return item._id == values._grid_row_id });
                                            var selectedAll = _.pluck(values.instance_fields, 'name');
                                            if (selected) {
                                                selectedAll = _.difference(selectedAll, [selected.name]);
                                            }
                                            if (selectedAll && selectedAll.length > 0) {
                                                return [['object', '=', objectName], ['name', '!=', selectedAll.concat(baseFieldKeys)]]
                                            }
                                        }
                                        return [['object', '=', objectName], ['name', '!=', baseFieldKeys]]
                                    } else {
                                        return ['_id', '=', 'no']
                                    }
                                }
                            },
                            "required": {
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
                    async: false,
                    data: JSON.stringify({
                        formId: formId,
                        ...values
                    }),
                    success: function (data) {
                        toastr.success('添加成功');
                        Modal.hide();
                        $(document.body).removeClass('loading');
                        if (Template.creator_view.currentInstance) {
                            Template.creator_view.currentInstance.onEditSuccess();
                        } else {
                            FlowRouter.reload();
                        }
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
        return record && record.object_name;
    },
    // 因为删除流程需要输入流程名称进行二次确认，故这里不显示列表批量删除按钮
    standard_delete_manyVisible: function () {
        return false;
    }
}