/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-12-13 10:41:08
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-02-26 16:30:11
 * @Description: 
 */

Steedos.getObjectsOptions = function (filterFunction) {
    var options = [];
    _.each(Steedos.getDisplayObjects(filterFunction), function (v, k) {
        options.push({ label: v.label, value: v.name, icon: v.icon })
    })
    return options;
}

Steedos.getDisplayObjects = function(filterFunction){
    var objects = [];
    _.each(Creator.objectsByName, function (object, k) {
        var filterReturn = true;
        if (filterFunction && _.isFunction(filterFunction)) {
            filterReturn = filterFunction(object);
        }
        if (filterReturn && !object.hidden && !_.includes(['cfs_instances_filerecord'], object.name)) {
            objects.push(object)
        }
    })
    objects.sort(Creator.sortingMethod.bind({key:"label"}))
    return objects;
}

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