Creator.objectLayoutMananger = {}

Creator.objectLayoutMananger.appendField = function(field){
    var objectLayouts = Creator.odata.query("object_layouts", {
        $filter: "(object_name eq '".concat(field.object, "')")
    }, true);

    if(objectLayouts.length == 0){
        return ;
    }

    var schema = Creator.getObjectSchema({
        fields: {
            fieldLabel: Object.assign({}, Creator.getObject('object_fields').fields.label, {
                readonly: true,
                is_wide: true,
                required: false,
                name: 'fieldLabel',
                group: t(`object_layouts_group_field_info`)
            }),
            fieldType: Object.assign({}, Creator.getObject('object_fields').fields.type, {
                readonly: true,
                type: 'text',
                is_wide: true,
                required: false,
                name: 'fieldType',
                group: t(`object_layouts_group_field_info`)
            }),
            fieldName: Object.assign({}, Creator.getObject('object_fields').fields._name, {
                readonly: true,
                is_wide: true,
                required: false,
                name: 'fieldName',
                group: t(`object_layouts_group_field_info`)
            }),
            fieldDescription: Object.assign({}, Creator.getObject('object_fields').fields.description, {
                readonly: true,
                is_wide: true,
                required: false,
                name: 'fieldDescription',
                group: t(`object_layouts_group_field_info`)
            }),
            appendToLayouts: {
                type: 'lookup',
                label: t("object_layouts__object"),
                multiple: true,
                is_wide: true,
                reference_to: 'object_layouts',
                filters: [["object_name", "eq", field.object]],
                group: t(`object_layouts_group_appendToLayouts`),
                create: false
            }
        }
    })

    var formId = 'appendField';
    var doc = {
        fieldLabel: field.label,
        fieldType: _.find(Creator.getObject('object_fields').fields.type.options, function(item){return item.value === field.type}).label,
        fieldName: field._name,
        fieldDescription: field.description,
        appendToLayouts: _.pluck(objectLayouts, '_id')
    };
    var onConfirm = function (formValues, event, template) {
        let insertDoc = formValues.insertDoc;
        let data = {
            field: field.name,
            is_readonly: field.readonly,
            is_required: field.required,
            group: field.group,
            visible_on: `${!field.hidden}`,
            layouts: insertDoc.appendToLayouts
        }
        if(_.isEmpty(insertDoc.appendToLayouts)){
            return Modal.hide(template);
        }
        var result = Steedos.authRequest(`/api/v4/object_fields/${field.name}/append_to_layouts`, { type: 'post', async: false, data: JSON.stringify(data)});
        if (result && result.state === 'SUCCESS') {
            Modal.hide(template);
        }
    }
    Modal.show("quickFormModal", {formId: formId, title: t(`object_layouts_title_${formId}`), confirmBtnText: `Confirm`, schema: schema, doc: doc, onConfirm: onConfirm, autoExpandGroup: true}, {
        backdrop: 'static',
        keyboard: true
    });
}