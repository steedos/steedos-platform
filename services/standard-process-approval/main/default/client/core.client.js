Steedos.getFieldDataTypes = function (field) {
    if(field.type === "select"){
        return [
            {
              "label": window.t("CustomField.object_fields.data_type.options.boolean"),
              "value": "boolean"
            },
            {
              "label": window.t("CustomField.object_fields.data_type.options.number"),
              "value": "number"
            },
            {
              "label": window.t("CustomField.object_fields.data_type.options.text"),
              "value": "text"
            }
        ];
    }
    else{
        return [
            {
              "label": window.t("CustomField.object_fields.data_type.options.boolean"),
              "value": "boolean"
            },
            {
              "label": window.t("CustomField.object_fields.data_type.options.number"),
              "value": "number"
            },
            {
              "label": window.t("CustomField.object_fields.data_type.options.currency"),
              "value": "currency"
            },
            {
              "label": window.t("CustomField.object_fields.data_type.options.percent"),
              "value": "percent"
            },
            {
              "label": window.t("CustomField.object_fields.data_type.options.text"),
              "value": "text"
            },
            {
              "label": window.t("CustomField.object_fields.data_type.options.date"),
              "value": "date"
            },
            {
              "label": window.t("CustomField.object_fields.data_type.options.datetime"),
              "value": "datetime"
            }
        ];
    }
}