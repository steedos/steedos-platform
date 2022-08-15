"use strict";
exports.id = 804;
exports.ids = [804];
exports.modules = {

/***/ 7733:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    listView: {
        newRecordMode: "drawer",
        editRecordMode: "drawer",
        perPage: 20
    }
});


/***/ }),

/***/ 7804:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "OMIT_FIELDS": () => (/* binding */ OMIT_FIELDS),
  "convertSFieldToAmisField": () => (/* binding */ convertSFieldToAmisField),
  "getAmisFieldType": () => (/* binding */ getAmisFieldType),
  "getAmisStaticFieldType": () => (/* binding */ getAmisStaticFieldType),
  "getBaseFields": () => (/* binding */ getBaseFields),
  "getFiledSearchable": () => (/* binding */ getFiledSearchable),
  "getGridFieldSubFields": () => (/* binding */ getGridFieldSubFields),
  "getObjectFieldSubFields": () => (/* binding */ getObjectFieldSubFields),
  "getPermissionFields": () => (/* binding */ getPermissionFields),
  "getSelectFieldOptions": () => (/* binding */ getSelectFieldOptions)
});

// EXTERNAL MODULE: external "lodash"
var external_lodash_ = __webpack_require__(6517);
// EXTERNAL MODULE: ./src/lib/objects.js + 4 modules
var objects = __webpack_require__(6195);
;// CONCATENATED MODULE: ./src/lib/converter/amis/fields/lookup.js

const _ = __webpack_require__(6517);
const graphql = __webpack_require__(1306);
const Tpl = __webpack_require__(6898);
const Field = __webpack_require__(7804);
const Table = __webpack_require__(2696);
const List = __webpack_require__(5158);
const getReferenceTo = async (field)=>{
    let referenceTo = field.reference_to;
    if (!referenceTo) {
        return;
    }
    const refObjectConfig = await (0,objects/* getUISchema */.NW)(referenceTo);
    let valueField = null;
    let valueFieldName = field.reference_to_field;
    if (!valueFieldName) {
        valueFieldName = refObjectConfig.idFieldName || "_id";
    }
    if (valueFieldName === "_id") {
        valueField = {
            name: "_id",
            label: "ID",
            type: "text",
            toggled: false
        };
    } else {
        valueField = refObjectConfig.fields[valueFieldName] || {
            name: valueFieldName
        };
    }
    return {
        objectName: referenceTo,
        valueField: valueField,
        labelField: refObjectConfig.fields[refObjectConfig.NAME_FIELD_KEY || "name"]
    };
};
async function lookupToAmisPicker(field, readonly, ctx) {
    let referenceTo = await getReferenceTo(field);
    if (!referenceTo) {
        return;
    }
    const refObjectConfig = await (0,objects/* getUISchema */.NW)(referenceTo.objectName);
    const tableFields = [];
    let i = 0;
    const searchableFields = [];
    const fieldsArr = [];
    _.each(refObjectConfig.fields, (field, field_name)=>{
        if (field_name != "_id" && !field.hidden) {
            if (!_.has(field, "name")) {
                field.name = field_name;
            }
            fieldsArr.push(field);
        }
    });
    _.each(_.sortBy(fieldsArr, "sort_no"), function(field) {
        if (i < 5) {
            if (!_.find(tableFields, function(f) {
                return f.name === field.name;
            })) {
                i++;
                tableFields.push(field);
                if (field.searchable) {
                    searchableFields.push(field.name);
                }
            }
        }
    });
    const fields = {
        [referenceTo.labelField.name]: referenceTo.labelField,
        [referenceTo.valueField.name]: referenceTo.valueField
    };
    _.each(tableFields, (tableField)=>{
        if (!tableField.hidden) {
            fields[tableField.name] = tableField;
        }
    });
    const source = getApi({
        name: referenceTo.objectName
    }, null, fields, {
        expand: true,
        alias: "rows",
        queryOptions: `filters: {__filters}, top: {__top}, skip: {__skip}, sort: "{__sort}"`
    });
    source.data.$term = "$term";
    source.data.$self = "$$";
    source.requestAdaptor = `
        const selfData = JSON.parse(JSON.stringify(api.data.$self));
        var filters = [];
        var pageSize = api.data.pageSize || 10;
        var pageNo = api.data.pageNo || 1;
        var skip = (pageNo - 1) * pageSize;
        var orderBy = api.data.orderBy || '';
        var orderDir = api.data.orderDir || '';
        var sort = orderBy + ' ' + orderDir;
        var allowSearchFields = ${JSON.stringify(searchableFields)};
        if(api.data.$term){
            filters = [["name", "contains", "'+ api.data.$term +'"]];
        }else if(selfData.op === 'loadOptions' && selfData.value){
            filters = [["${referenceTo.valueField.name}", "=", selfData.value]];
        }
        if(allowSearchFields){
            allowSearchFields.forEach(function(key){
                const keyValue = selfData[key];
                if(keyValue){
                    filters.push([key, "contains", keyValue]);
                }
            })
        }
        api.data.query = api.data.query.replace(/{__filters}/g, JSON.stringify(filters)).replace('{__top}', pageSize).replace('{__skip}', skip).replace('{__sort}', sort.trim());
        return api;
    `;
    let top = 20;
    if (refObjectConfig.paging && refObjectConfig.paging.enabled === false) {
        top = 1000;
    }
    ;
    let pickerSchema = null;
    if (ctx.formFactor === "SMALL") {
        pickerSchema = List.getListSchema(tableFields, {
            top: top,
            ...ctx,
            actions: false
        });
    } else {
        pickerSchema = Table.getTableSchema(tableFields, {
            top: top,
            ...ctx
        });
    }
    const data = {
        type: Field.getAmisStaticFieldType("picker", readonly),
        labelField: referenceTo.labelField.name,
        valueField: referenceTo.valueField.name,
        modalMode: "dialog",
        source: source,
        size: "lg",
        pickerSchema: pickerSchema,
        joinValues: false,
        extractValue: true
    };
    if (field.multiple) {
        data.multiple = true;
        data.extractValue = true;
    }
    if (readonly) {
        data.tpl = Tpl.getLookupTpl(field);
    }
    return data;
}
async function lookupToAmisSelect(field, readonly) {
    let referenceTo = await getReferenceTo(field);
    let apiInfo;
    if (referenceTo) {
        apiInfo = getApi({
            name: referenceTo.objectName
        }, null, {
            [referenceTo.labelField.name]: Object.assign({}, referenceTo.labelField, {
                alias: "label"
            }),
            [referenceTo.valueField.name]: Object.assign({}, referenceTo.valueField, {
                alias: "value"
            })
        }, {
            expand: false,
            alias: "options",
            queryOptions: `filters: {__filters}, top: {__top}`
        });
    } else {
        apiInfo = {
            method: "post",
            url: graphql.getApi(),
            data: {
                query: '{objects(filters: ["_id", "=", "-1"]){_id}}',
                $: "$$"
            }
        };
    }
    apiInfo.data.$term = "$term";
    apiInfo.data.$value = `$${field.name}.${referenceTo ? referenceTo.valueField.name : "_id"}`;
    _.each(field.depend_on, function(fName) {
        apiInfo.data[fName] = `$${fName}`;
    });
    apiInfo.data["$"] = `$$`;
    apiInfo.data["rfield"] = `\${object_name}`;
    // [["_id", "=", "$${field.name}._id"],"or",["name", "contains", "$term"]]
    apiInfo.requestAdaptor = `
        var filters = '[]';
        var top = 10;
        if(api.data.$term){
            filters = '["name", "contains", "'+ api.data.$term +'"]';
        }else if(api.data.$value){
            filters = '["_id", "=", "'+ api.data.$value +'"]';
        }
        api.data.query = api.data.query.replace(/{__filters}/g, filters).replace('{__top}', top);
        return api;
    `;
    let labelField = referenceTo ? referenceTo.labelField.name : "";
    let valueField = referenceTo ? referenceTo.valueField.name : "";
    if (field._optionsFunction) {
        apiInfo.adaptor = `
        payload.data.options = eval(${field._optionsFunction})(api.data);
        return payload;
        `;
        labelField = "label";
        valueField = "value";
    }
    const data = {
        type: Field.getAmisStaticFieldType("select", readonly),
        joinValues: false,
        extractValue: true,
        labelField: labelField,
        valueField: valueField,
        autoComplete: apiInfo
    };
    if (_.has(field, "defaultValue") && !(_.isString(field.defaultValue) && field.defaultValue.startsWith("{"))) {
        data.value = field.defaultValue;
    }
    if (field.multiple) {
        data.multiple = true;
        data.extractValue = true;
    }
    if (readonly) {
        data.tpl = Tpl.getLookupTpl(field);
    }
    return data;
}
function getApi(object, recordId, fields, options) {
    return {
        method: "post",
        url: graphql.getApi(),
        data: graphql.getFindQuery(object, recordId, fields, options),
        headers: {
            Authorization: "Bearer ${context.tenantId},${context.authToken}"
        }
    };
}
async function lookupToAmis(field, readonly, ctx) {
    let referenceTo = await getReferenceTo(field);
    if (!referenceTo) {
        return await lookupToAmisSelect(field, readonly);
    }
    const refObject = await (0,objects/* getUISchema */.NW)(referenceTo.objectName);
    // 此处不参考 steedos 的 enable_enhanced_lookup 规则. 如果默认是开启弹出选择,用户选择过程操作太繁琐, 所以默认是关闭弹出选择.
    if (refObject.enable_enhanced_lookup == true) {
        return await lookupToAmisPicker(field, readonly, ctx);
    } else {
        return await lookupToAmisSelect(field, readonly);
    }
}

;// CONCATENATED MODULE: ./src/lib/converter/amis/fields/index.js


const Fields = __webpack_require__(7804);
const fields_Tpl = __webpack_require__(6898);
const fields_ = __webpack_require__(6517);
const OMIT_FIELDS = [
    "created",
    "created_by",
    "modified",
    "modified_by"
];
// const Lookup = require('./lookup');
const AmisFormInputs = [
    "text",
    "date",
    "file",
    "image",
    "datetime",
    "time",
    "number",
    "currency",
    "percent",
    "password",
    "url",
    "email"
];
function getBaseFields(readonly) {
    let calssName = "m-1";
    if (readonly) {
        calssName = `${calssName} slds-form-element_readonly`;
    }
    return [
        {
            name: "createdInfo",
            label: "\u521B\u5EFA\u4EBA",
            type: "static",
            labelClassName: "text-left",
            className: calssName,
            tpl: fields_Tpl.getCreatedInfoTpl()
        },
        {
            name: "modifiedInfo",
            label: "\u4FEE\u6539\u4EBA",
            type: "static",
            labelClassName: "text-left",
            className: calssName,
            tpl: fields_Tpl.getModifiedInfoTpl()
        }
    ];
}
;
function getAmisStaticFieldType(type, readonly) {
    if (!readonly) {
        if (fields_.includes(AmisFormInputs, type)) {
            return `input-${type}`;
        }
        return type;
    }
    if (fields_.includes([
        "text"
    ], type)) {
        return `static-${type}`;
    } else {
        return "static";
    }
}
;
function getAmisFieldType(sField) {
    switch(sField.type){
        case "text":
            return "text";
        case "textarea":
            return "textarea";
        case "html":
            return "html";
        case "select":
            return "select";
        case "boolean":
            return "checkbox";
        case "date":
            return "date";
        case "datetime":
            return "datetime";
        case "number":
            return "number";
        case "currency":
            return "number";
        case "percent":
            return "number";
        case "password":
            return "password";
        case "lookup":
            // TODO 根据字段配置返回 select || picker
            return "select";
        case "master_detail":
            // TODO 根据字段配置返回 select || picker
            return "picker";
        case "autonumber":
            return "text";
        case "url":
            return "url";
        case "email":
            return "email";
        case "image":
            return "image";
        case "formula":
            break;
        case "summary":
            break;
        case "grid":
            return "table";
        default:
            console.log("convertData default", sField.type);
            break;
    }
}
;
function getObjectFieldSubFields(mainField, fields) {
    const newMainField = Object.assign({
        subFields: []
    }, mainField);
    const subFields = fields_.filter(fields, function(field) {
        return field.name.startsWith(`${mainField.name}.`);
    });
    newMainField.subFields = subFields;
    return newMainField;
}
function getGridFieldSubFields(mainField, fields) {
    const newMainField = Object.assign({
        subFields: []
    }, mainField);
    const subFields = fields_.filter(fields, function(field) {
        return field.name.startsWith(`${mainField.name}.`);
    });
    newMainField.subFields = subFields;
    return newMainField;
}
/**
 * TODO 处理权限
 * @param {*} object steedos object
 * @param {*} userSession 
 */ function getPermissionFields(object, userSession) {
    const permissionFields = [];
    const fieldsArr = [];
    fields_.each(object.fields, (field, field_name)=>{
        if (!fields_.has(field, "name")) {
            field.name = field_name;
        }
        fieldsArr.push(field);
    });
    fields_.each(fields_.sortBy(fieldsArr, "sort_no"), function(field) {
        if (!field.hidden) {
            permissionFields.push(Object.assign({}, field, {
                permission: {
                    allowEdit: true
                }
            }));
        }
    });
    return permissionFields;
}
function getSelectFieldOptions(field) {
    const dataType = field.data_type || "text";
    const options = [];
    fields_.each(field.options, (item)=>{
        switch(dataType){
            case "number":
                options.push({
                    label: item.label,
                    value: Number(item.value)
                });
                break;
            case "text":
                options.push({
                    label: item.label,
                    value: String(item.value)
                });
                break;
            case "boolean":
                options.push({
                    label: item.label,
                    value: item.value === "false" ? false : true
                });
                break;
            default:
                break;
        }
    });
    return options;
}
async function convertSFieldToAmisField(field, readonly, ctx) {
    // 创建人和修改人、创建时间和修改时间不显示
    if (fields_.includes(OMIT_FIELDS, field.name) && ctx.showSystemFields != true) {
        return;
    }
    const baseData = {
        name: ctx.fieldNamePrefix ? `${ctx.fieldNamePrefix}${field.name}` : field.name,
        label: field.label,
        labelRemark: field.inlineHelpText,
        required: fields_.has(ctx, "required") ? ctx.required : field.required
    };
    let convertData = {};
    // if(_.includes(OMIT_FIELDS, field.name)){
    //     readonly = true;
    // }
    switch(field.type){
        case "text":
            convertData.type = getAmisStaticFieldType("text", readonly);
            break;
        case "textarea":
            convertData.type = getAmisStaticFieldType("textarea", readonly);
            convertData.tpl = `<b><%=data.${field.name}%></b>`;
            break;
        case "html":
            convertData = {
                type: "editor",
                language: "html",
                value: field.defaultValue || ""
            };
            break;
        // convertData = {
        //     type: getAmisStaticFieldType('html', readonly)
        // }
        // break;
        case "select":
            convertData = {
                type: getAmisStaticFieldType("select", readonly),
                joinValues: false,
                options: getSelectFieldOptions(field),
                extractValue: true,
                clearable: true,
                labelField: "label",
                valueField: "value",
                tpl: readonly ? fields_Tpl.getSelectTpl(field) : null
            };
            if (fields_.has(field, "defaultValue") && !(fields_.isString(field.defaultValue) && field.defaultValue.startsWith("{"))) {
                const dataType = field.data_type || "text";
                if (field.defaultValue != null) {
                    if (dataType === "text") {
                        convertData.value = String(field.defaultValue);
                    } else if (dataType === "number") {
                        convertData.value = Number(field.defaultValue);
                    } else if (dataType === "boolean") {
                        convertData.value = field.defaultValue === "false" ? false : true;
                    }
                }
            }
            if (field.multiple) {
                convertData.multiple = true;
                convertData.extractValue = true;
            }
            break;
        case "boolean":
            convertData = {
                type: getAmisStaticFieldType("checkbox", readonly),
                option: field.inlineHelpText,
                tpl: readonly ? fields_Tpl.getSwitchTpl(field) : null
            };
            break;
        case "input-date-range":
            convertData = {
                type: "input-date-range",
                inputFormat: "YYYY-MM-DD",
                format: "YYYY-MM-DDT00:00:00.000[Z]",
                tpl: readonly ? fields_Tpl.getDateTpl(field) : null
            };
            break;
        case "date":
            convertData = {
                type: getAmisStaticFieldType("date", readonly),
                inputFormat: "YYYY-MM-DD",
                format: "YYYY-MM-DDT00:00:00.000[Z]",
                tpl: readonly ? fields_Tpl.getDateTpl(field) : null
            };
            break;
        case "input-datetime-range":
            convertData = {
                type: "input-datetime-range",
                inputFormat: "YYYY-MM-DD HH:mm",
                format: "YYYY-MM-DDTHH:mm:ss.SSS[Z]",
                tpl: readonly ? fields_Tpl.getDateTimeTpl(field) : null,
                utc: true
            };
            break;
        case "datetime":
            convertData = {
                type: getAmisStaticFieldType("datetime", readonly),
                inputFormat: "YYYY-MM-DD HH:mm",
                format: "YYYY-MM-DDTHH:mm:ss.SSS[Z]",
                tpl: readonly ? fields_Tpl.getDateTimeTpl(field) : null,
                utc: true
            };
            break;
        case "input-time-range":
            convertData = {
                type: "input-time-range",
                inputFormat: "HH:mm",
                timeFormat: "1970-01-01THH:mm:00.000[Z]",
                format: "1970-01-01THH:mm:00.000[Z]",
                tpl: readonly ? fields_Tpl.getDateTimeTpl(field) : null
            };
            break;
        case "time":
            convertData = {
                type: getAmisStaticFieldType("time", readonly),
                inputFormat: "HH:mm",
                timeFormat: "1970-01-01THH:mm:00.000[Z]",
                format: "1970-01-01THH:mm:00.000[Z]",
                tpl: readonly ? fields_Tpl.getDateTimeTpl(field) : null
            };
            break;
        case "number":
            convertData = {
                type: getAmisStaticFieldType("number", readonly),
                min: field.min,
                max: field.max,
                precision: field.scale
            };
            break;
        case "currency":
            //TODO
            convertData = {
                type: getAmisStaticFieldType("number", readonly),
                min: field.min,
                max: field.max,
                precision: field.scale
            };
            break;
        case "input-array":
            convertData = Object.assign({}, field, baseData);
            break;
        case "input-range":
            convertData = {
                type: "input-range",
                min: field.min,
                max: field.max,
                value: [
                    0,
                    0
                ],
                multiple: true,
                showInput: true
            };
            break;
        case "percent":
            //TODO
            convertData = {
                type: getAmisStaticFieldType("number", readonly),
                min: field.min,
                max: field.max,
                precision: field.scale
            };
            break;
        case "password":
            convertData = {
                type: getAmisStaticFieldType("password", readonly),
                tpl: readonly ? fields_Tpl.getPasswordTpl(field) : null
            };
            break;
        case "lookup":
            convertData = await lookupToAmis(field, readonly, ctx) //TODO
            ;
            break;
        case "master_detail":
            convertData = await lookupToAmis(field, readonly, ctx) //TODO
            ;
            break;
        case "autonumber":
            break;
        case "url":
            convertData = {
                type: getAmisStaticFieldType("url", readonly)
            };
            break;
        case "email":
            convertData = {
                type: getAmisStaticFieldType("email", readonly)
            };
            break;
        case "image":
            rootUrl = Meteor.absoluteUrl("/api/files/images/");
            convertData = {
                type: getAmisStaticFieldType("image", readonly),
                receiver: {
                    method: "post",
                    url: "${context.rootUrl}/s3/images",
                    adaptor: `
var rootUrl = ${JSON.stringify(rootUrl)};
payload = {
    status: response.status == 200 ? 0 : response.status,
    msg: response.statusText,
    data: {
        value: payload._id,
        filename: payload.original.name,
        url: rootUrl + payload._id,
    }
}
return payload;
                    `,
                    headers: {
                        Authorization: "Bearer ${context.tenantId},${context.authToken}"
                    }
                }
            };
            if (field.multiple) {
                convertData.multiple = true;
                convertData.joinValues = false;
                convertData.extractValue = true;
            }
            break;
        case "file":
            rootUrl = Meteor.absoluteUrl("/api/files/files/");
            convertData = {
                type: getAmisStaticFieldType("file", readonly),
                receiver: {
                    method: "post",
                    url: "${context.rootUrl}/s3/files",
                    adaptor: `
var rootUrl = ${JSON.stringify(rootUrl)};
payload = {
    status: response.status == 200 ? 0 : response.status,
    msg: response.statusText,
    data: {
        value: payload._id,
        name: payload.original.name,
        url: rootUrl + payload._id,
    }
}
return payload;
                    `,
                    headers: {
                        Authorization: "Bearer ${context.tenantId},${context.authToken}"
                    }
                }
            };
            if (field.multiple) {
                convertData.multiple = true;
                convertData.joinValues = false;
                convertData.extractValue = true;
            }
            break;
        case "formula":
            break;
        case "summary":
            break;
        case "code":
            convertData = {
                type: "editor",
                language: field.language,
                value: field.defaultValue || ""
            };
            break;
        case "toggle":
            convertData = {
                type: "switch"
            };
            break;
        case "grid":
            convertData = {
                type: "input-table",
                strictMode: false,
                affixHeader: false,
                // needConfirm: true,  此属性设置为false后，导致table不能编辑。
                editable: !readonly,
                addable: !readonly,
                removable: !readonly,
                draggable: !readonly,
                columns: []
            };
            fields_.each(field.subFields, function(subField) {
                const subFieldName = subField.name.replace(`${field.name}.$.`, "").replace(`${field.name}.`, "");
                const gridSub = convertSFieldToAmisField(Object.assign({}, subField, {
                    name: subFieldName
                }), readonly);
                if (gridSub) {
                    delete gridSub.name;
                    delete gridSub.label;
                    convertData.columns.push({
                        name: subFieldName,
                        label: subField.label,
                        quickEdit: readonly ? false : gridSub
                    });
                }
            });
            break;
        default:
            break;
    }
    if (!fields_.isEmpty(convertData)) {
        if (field.is_wide) {
            convertData.className = "col-span-2 m-1";
        } else {
            convertData.className = "m-1";
        }
        if (readonly) {
            convertData.className = `${convertData.className} slds-form-element_readonly`;
        }
        convertData.labelClassName = "text-left";
        if (readonly) {
            convertData.quickEdit = false;
        }
        return Object.assign({}, baseData, convertData);
    }
}
async function getFiledSearchable(perField, permissionFields, ctx) {
    let field = perField;
    if (field.type === "grid") {
        field = await Fields.getGridFieldSubFields(perField, permissionFields);
    } else if (perField.type === "object") {
        field = await Fields.getObjectFieldSubFields(perField, permissionFields);
    }
    let fieldNamePrefix = "__searchable__";
    if (field.name.indexOf(".") < 0) {
        let _field = (0,external_lodash_.cloneDeep)(field);
        if ((0,external_lodash_.includes)([
            "textarea",
            "html",
            "code",
            "autonumber"
        ], field.type)) {
            _field.type = "text";
        }
        if (field.type === "number" || field.type === "currency") {
            _field.type = "input-array";
            _field.inline = true;
            _field.addable = false;
            _field.removable = false;
            _field.value = [
                null,
                null
            ];
            _field.items = {
                type: "input-number"
            };
            _field.is_wide = true;
            fieldNamePrefix = `${fieldNamePrefix}between__`;
        }
        if (field.type === "date") {
            _field.type = "input-date-range";
            _field.is_wide = true;
            fieldNamePrefix = `${fieldNamePrefix}between__`;
        }
        if (field.type === "datetime") {
            _field.type = "input-datetime-range";
            _field.is_wide = true;
            fieldNamePrefix = `${fieldNamePrefix}between__`;
        }
        if (field.type === "time") {
            _field.type = "input-time-range";
            _field.is_wide = true;
            fieldNamePrefix = `${fieldNamePrefix}between__`;
        }
        if (field.reference_to === "users") {
            _field.reference_to = "space_users";
            _field.reference_to_field = "user";
        }
        _field.readonly = false;
        _field.disabled = false;
        _field.multiple = true;
        const amisField = await Fields.convertSFieldToAmisField(_field, false, Object.assign({}, ctx, {
            fieldNamePrefix: fieldNamePrefix,
            required: false,
            showSystemFields: true
        }));
        if (amisField) {
            return amisField;
        }
    }
}


/***/ }),

/***/ 5158:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getListSchema": () => (/* binding */ getListSchema)
/* harmony export */ });
const Tpl = __webpack_require__(6898);
function getListBody(fields, options) {
    const columns = [];
    _.each(fields, function(field) {
        const tpl = Tpl.getFieldTpl(field, options);
        let type = "text";
        if (tpl) {
            type = "tpl";
        }
        if (!field.hidden && !field.extra) {
            columns.push({
                name: field.name,
                label: field.label,
                sortable: field.sortable,
                // searchable: field.searchable,
                width: field.width,
                type: type,
                tpl: tpl,
                toggled: field.toggled
            });
        }
    });
    return {
        "type": "hbox",
        "columns": columns
    };
}
function getDefaultParams(options) {
    return {
        perPage: options.top || 10
    };
}
function getListSchema(fields, options) {
    return {
        mode: "list",
        name: "thelist",
        draggable: false,
        headerToolbar: [
            "switch-per-page",
            "reload"
        ],
        defaultParams: getDefaultParams(options),
        syncLocation: false,
        keepItemSelectionOnPageChange: true,
        checkOnItemClick: true,
        labelTpl: `\${name}`,
        listItem: {
            body: [
                ...getListBody(fields, options).columns
            ],
            actions: options.actions === false ? null : [
                {
                    icon: "fa fa-eye",
                    label: "\u67E5\u770B",
                    type: "button",
                    actionType: "link",
                    link: `/app/${options.appId}/${options.tabId}/view/\${_id}`
                }
            ]
        }
    };
}


/***/ }),

/***/ 2696:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getTableApi": () => (/* binding */ getTableApi),
/* harmony export */   "getTableSchema": () => (/* binding */ getTableSchema)
/* harmony export */ });
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7733);
const Tpl = __webpack_require__(6898);
const Fields = __webpack_require__(7804);
const _ = __webpack_require__(6517);
const graphql = __webpack_require__(1306);

function getOperation(fields) {
    const controls = [];
    _.each(fields, function(field) {
        controls.push(Fields.convertSFieldToAmisField(field, true));
    });
    return {
        "type": "operation",
        "label": "\u64CD\u4F5C",
        "width": 100,
        fixed: "right",
        "buttons": [
            {
                "type": "button",
                "icon": "fa fa-eye",
                "actionType": "dialog",
                "tooltip": "\u67E5\u770B",
                "dialog": {
                    "title": "\u67E5\u770B",
                    "body": {
                        "type": "form",
                        "controls": controls
                    }
                }
            }
        ]
    };
}
//获取name字段，如果没有，则_index字段添加链接
function getDetailColumn() {}
function getTableColumns(fields, options) {
    const columns = [
        {
            name: "_index",
            type: "text",
            width: 32,
            placeholder: ""
        }
    ];
    _.each(fields, function(field) {
        if ((field.is_name || field.name === options.labelFieldName) && options.objectName === "cms_files") {
            columns.push({
                "type": "button",
                "label": `\${${field.name}}`,
                "type": "button",
                "actionType": "ajax",
                "api": {
                    "url": "${context.rootUrl}/api/files/files/${versions[0]}?download=true",
                    "method": "get",
                    "headers": {
                        "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                    },
                    "responseType": "blob",
                    "dataType": "form-data"
                },
                "id": "u:6c8291d1029f",
                "level": "link"
            });
        } else {
            const tpl = Tpl.getFieldTpl(field, options);
            let type = "text";
            if (tpl) {
                type = "tpl";
            }
            if (!field.hidden && !field.extra) {
                columns.push({
                    name: field.name,
                    label: field.label,
                    sortable: field.sortable,
                    // searchable: field.searchable,
                    width: field.width,
                    type: type,
                    tpl: tpl,
                    toggled: field.toggled
                });
            }
        }
    });
    // columns.push(getOperation(fields));
    return columns;
}
function getDefaultParams(options) {
    return {
        perPage: options.top || _config__WEBPACK_IMPORTED_MODULE_0__/* ["default"].listView.perPage */ .Z.listView.perPage
    };
}
function getTableSchema(fields, options) {
    if (!options) {
        options = {};
    }
    return {
        mode: "table",
        name: "thelist",
        draggable: false,
        headerToolbar: [
            "switch-per-page",
            "reload"
        ],
        defaultParams: getDefaultParams(options),
        columns: getTableColumns(fields, options),
        syncLocation: false,
        keepItemSelectionOnPageChange: true,
        checkOnItemClick: true,
        labelTpl: `\${name}`,
        autoFillHeight: false
    };
}
function getTableApi(mainObject, fields, options) {
    const searchableFields = [];
    const { globalFilter , filter  } = options;
    _.each(fields, function(field) {
        if (field.searchable) {
            searchableFields.push(field.name);
        }
    });
    let valueField = mainObject.key_field || "_id";
    const api = getApi(mainObject, null, fields, {
        alias: "rows",
        queryOptions: `filters: {__filters}, top: {__top}, skip: {__skip}, sort: "{__sort}"`
    });
    api.data.$term = "$term";
    api.data.$self = "$$";
    api.data.filter = "$filter";
    api.requestAdaptor = `
        console.log("api", api)
        const selfData = JSON.parse(JSON.stringify(api.data.$self));
        ${globalFilter ? `var filters = ${JSON.stringify(globalFilter)};` : "var filters = [];"}
        if(_.isEmpty(filters)){
            filters = api.data.filter || [${JSON.stringify(filter)}];
        }else{
            filters = [filters, 'and', api.data.filter || [${JSON.stringify(filter)}]]
        }
        var pageSize = api.data.pageSize || 10;
        var pageNo = api.data.pageNo || 1;
        var skip = (pageNo - 1) * pageSize;
        var orderBy = api.data.orderBy || '';
        var orderDir = api.data.orderDir || '';
        var sort = orderBy + ' ' + orderDir;
        var allowSearchFields = ${JSON.stringify(searchableFields)};
        if(api.data.$term){
            filters = [["name", "contains", "'+ api.data.$term +'"]];
        }else if(selfData.op === 'loadOptions' && selfData.value){
            filters = [["${valueField.name}", "=", selfData.value]];
        }

        var searchableFilter = [];
        _.each(selfData, (value, key)=>{
            if(!_.isEmpty(value) || _.isBoolean(value)){
                if(_.startsWith(key, '__searchable__between__')){
                    searchableFilter.push([\`\${key.replace("__searchable__between__", "")}\`, "between", value])
                }else if(_.startsWith(key, '__searchable__')){
                    if(_.isString(value)){
                        searchableFilter.push([\`\${key.replace("__searchable__", "")}\`, "contains", value])
                    }else{
                        searchableFilter.push([\`\${key.replace("__searchable__", "")}\`, "=", value])
                    }
                }
            }
        });

        if(searchableFilter.length > 0){
            if(filters.length > 0 ){
                filters = [filters, 'and', searchableFilter];
            }else{
                searchableFilter = filters;
            }
        }

        if(allowSearchFields){
            allowSearchFields.forEach(function(key){
                const keyValue = selfData[key];
                if(keyValue){
                    filters.push([key, "contains", keyValue]);
                }
            })
        }

        if(selfData.__keywords && allowSearchFields){
            const keywordsFilters = [];
            allowSearchFields.forEach(function(key, index){
                const keyValue = selfData.__keywords;
                if(keyValue){
                    keywordsFilters.push([key, "contains", keyValue]);
                    if(index < allowSearchFields.length - 1){
                        keywordsFilters.push('or');
                    }
                }
            })
            filters.push(keywordsFilters);
        }
        api.data.query = api.data.query.replace(/{__filters}/g, JSON.stringify(filters)).replace('{__top}', pageSize).replace('{__skip}', skip).replace('{__sort}', sort.trim());
        return api;
    `;
    api.adaptor = `
    _.each(payload.data.rows, function(item, index){
        item._index = index + 1;
    })
    window.postMessage(Object.assign({type: "listview.loaded"}), "*")
    return payload;
    `;
    return api;
}
function getApi(object, recordId, fields, options) {
    return {
        method: "post",
        url: graphql.getApi(),
        data: graphql.getFindQuery(object, recordId, fields, options),
        headers: {
            Authorization: "Bearer ${context.tenantId},${context.authToken}"
        }
    };
}


/***/ }),

/***/ 1306:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getApi": () => (/* binding */ getApi),
/* harmony export */   "getFieldsTemplate": () => (/* binding */ getFieldsTemplate),
/* harmony export */   "getFindOneQuery": () => (/* binding */ getFindOneQuery),
/* harmony export */   "getFindQuery": () => (/* binding */ getFindQuery),
/* harmony export */   "getSaveDataTpl": () => (/* binding */ getSaveDataTpl),
/* harmony export */   "getSaveQuery": () => (/* binding */ getSaveQuery),
/* harmony export */   "getSaveRequestAdaptor": () => (/* binding */ getSaveRequestAdaptor),
/* harmony export */   "getScriptForRemoveUrlPrefixForImgFields": () => (/* binding */ getScriptForRemoveUrlPrefixForImgFields),
/* harmony export */   "getScriptForSimplifiedValueForFileFields": () => (/* binding */ getScriptForSimplifiedValueForFileFields)
/* harmony export */ });
const _ = __webpack_require__(6517);
function getFieldsTemplate(fields, expand) {
    if (expand != false) {
        expand = true;
    }
    let fieldsName = [
        "_id"
    ];
    let displayFields = [];
    _.each(fields, function(field) {
        if (field.name.indexOf(".") < 0) {
            if (expand && (field.type == "lookup" || field.type == "master_detail") && field.reference_to) {
                //TODO 获取相关表名称字段
                const NAME_FIELD_KEY = "name";
                fieldsName.push(`${field.name}:${field.name}__expand{_id,${NAME_FIELD_KEY}${field.reference_to_field ? `,${field.reference_to_field}` : ""}}`);
            } else {
                fieldsName.push(field.alias ? `${field.alias}:${field.name}` : field.name);
            }
            if (field.type === "date" || field.type == "datetime" || field.type == "boolean") {
                fieldsName.push(`${field.name}`);
            }
            if (field.type === "date" || field.type == "datetime" || field.type == "boolean" || field.type == "select" || field.type == "file") {
                displayFields.push(`${field.name}`);
            }
        }
    });
    displayFields = _.uniq(displayFields);
    fieldsName = _.uniq(fieldsName);
    if (displayFields.length > 0) {
        return `${fieldsName.join(",")},_display{${displayFields.join(",")}}`;
    }
    return `${fieldsName.join(" ")}`;
}
function getFindOneQuery(object, recordId, fields, options) {
    let queryOptions = "";
    if (recordId) {
        queryOptions = `(filters:["${object.idFieldName}", "=", "${recordId}"])`;
    }
    let alias = "data";
    if (options) {
        if (options.alias) {
            alias = options.alias;
        }
        if (options.filters) {
            queryOptions = `(filters:${options.filters})`;
        }
        if (options.queryOptions) {
            queryOptions = `(${options.queryOptions})`;
        }
    }
    return {
        query: `{${alias}:${object.name}${queryOptions}{${getFieldsTemplate(fields)}}}`
    };
}
function getSaveQuery(object, recordId, fields, options) {
    return {
        objectName: "${objectName}",
        $: "$$",
        recordId: "${recordId}",
        modalName: "${modalName}"
    };
}
/*
    img字段值移除URL前缀使其保存时正常保存id,而不是url。
*/ function getScriptForRemoveUrlPrefixForImgFields(fields) {
    let imgFieldsKeys = [];
    let imgFields = {};
    fields.forEach((item)=>{
        if (item.type === "image") {
            imgFieldsKeys.push(item.name);
            imgFields[item.name] = {
                name: item.name,
                multiple: item.multiple
            };
        }
    });
    if (!imgFieldsKeys.length) {
        return "";
    }
    return `
        let imgFieldsKeys = ${JSON.stringify(imgFieldsKeys)};
        let imgFields = ${JSON.stringify(imgFields)};
        imgFieldsKeys.forEach((item)=>{
            let imgFieldValue = formData[item];
            if(imgFieldValue && imgFieldValue.length){
                // 因为表单初始化接口的接收适配器中为image字段值添加了url前缀（为了字段编辑时正常显示图片），所以保存时移除（为了字段值保存时正常保存id,而不是url）。
                if(imgFields[item].multiple){
                    if(imgFieldValue instanceof Array){
                        formData[item] = imgFieldValue.map((value)=>{ 
                            let itemValue = value?.split('/');
                            return itemValue[itemValue.length - 1];
                        });
                    }
                }else{
                    let imgValue = imgFieldValue.split('/');
                    formData[item] = imgValue[imgValue.length - 1];
                }
            }
        })
    `;
}
/*
    file字段值重写使其保存时正常保存id。
*/ function getScriptForSimplifiedValueForFileFields(fields) {
    let fileFieldsKeys = [];
    let fileFields = {};
    fields.forEach((item)=>{
        if (item.type === "file") {
            fileFieldsKeys.push(item.name);
            fileFields[item.name] = {
                name: item.name,
                multiple: item.multiple
            };
        }
    });
    if (!fileFieldsKeys.length) {
        return "";
    }
    return `
        let fileFieldsKeys = ${JSON.stringify(fileFieldsKeys)};
        let fileFields = ${JSON.stringify(fileFields)};
        fileFieldsKeys.forEach((item)=>{
            let fileFieldValue = formData[item];
            if(fileFieldValue){
                // 因为表单初始化接口的接收适配器中为file字段值重写了值及格式（为了字段编辑时正常显示附件名、点击附件名正常下载），所以保存时还原（为了字段值保存时正常保存id）。
                if(fileFields[item].multiple){
                    if(fileFieldValue instanceof Array && fileFieldValue.length){
                        formData[item] = fileFieldValue.map((value)=>{ 
                            if(typeof value === 'object'){
                                return value.value;
                            }else{
                                return value;
                            }
                        });
                    }
                }else{
                    formData[item] = typeof fileFieldValue === 'object' ? fileFieldValue.value : fileFieldValue;
                }
            }
        })
    `;
}
function getSaveDataTpl(fields) {
    return `
        const formData = api.data.$;
        for (key in formData){
            // image、select等字段清空值后保存的空字符串转换为null。
            if(formData[key] === ''){
                formData[key] = null;
            }
        }
        const objectName = api.data.objectName;
        const fieldsName = Object.keys(formData);
        delete formData.created;
        delete formData.created_by;
        delete formData.modified;
        delete formData.modified_by;
        delete formData._display;
        ${getScriptForRemoveUrlPrefixForImgFields(fields)}
        ${getScriptForSimplifiedValueForFileFields(fields)}
        let query = \`mutation{record: \${objectName}__insert(doc: {__saveData}){_id}}\`;
        if(formData.recordId && formData.recordId !='new'){
            query = \`mutation{record: \${objectName}__update(id: "\${formData._id}", doc: {__saveData}){_id}}\`;
        };
        delete formData._id;
        let __saveData = JSON.stringify(JSON.stringify(formData));
    `;
}
function getSaveRequestAdaptor(fields) {
    return `
        ${getSaveDataTpl(fields)}
        api.data = {query: query.replace('{__saveData}', __saveData)};
        return api;
    `;
}
function getFindQuery(object, recordId, fields, options) {
    let limit = options.limit || 10;
    let queryOptions = `(top: ${limit})`;
    if (recordId) {
        queryOptions = `(filters:["_id", "=", "${recordId}"], top: ${limit})`;
    }
    let alias = "data";
    if (options) {
        if (options.alias) {
            alias = options.alias;
        }
        if (options.filters) {
            queryOptions = `(filters:${options.filters})`;
        }
        if (options.queryOptions) {
            queryOptions = `(${options.queryOptions})`;
        }
    }
    return {
        orderBy: "${orderBy}",
        orderDir: "${orderDir}",
        pageNo: "${page}",
        pageSize: "${perPage}",
        query: `{${alias}:${object.name}${queryOptions}{${getFieldsTemplate(fields, options.expand)}},count:${object.name}__count(filters:{__filters})}`
    };
}
function getApi(isMobile) {
    if (isMobile) {
    //TODO 返回 绝对路径
    } else {
        // return __meteor_runtime_config__.ROOT_URL_PATH_PREFIX + "/graphql"
        return `\${context.rootUrl}/graphql`;
    }
}


/***/ }),

/***/ 6898:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getCreatedInfoTpl": () => (/* binding */ getCreatedInfoTpl),
/* harmony export */   "getDateTimeTpl": () => (/* binding */ getDateTimeTpl),
/* harmony export */   "getDateTpl": () => (/* binding */ getDateTpl),
/* harmony export */   "getFieldTpl": () => (/* binding */ getFieldTpl),
/* harmony export */   "getLookupTpl": () => (/* binding */ getLookupTpl),
/* harmony export */   "getModifiedInfoTpl": () => (/* binding */ getModifiedInfoTpl),
/* harmony export */   "getNameTpl": () => (/* binding */ getNameTpl),
/* harmony export */   "getPasswordTpl": () => (/* binding */ getPasswordTpl),
/* harmony export */   "getRefObjectNameFieldName": () => (/* binding */ getRefObjectNameFieldName),
/* harmony export */   "getSelectTpl": () => (/* binding */ getSelectTpl),
/* harmony export */   "getSwitchTpl": () => (/* binding */ getSwitchTpl)
/* harmony export */ });
/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-05-23 09:53:08
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-25 15:19:31
 * @Description: 
 */ function getCreatedInfoTpl() {
    return "<div><a href='/app/admin/users/view/${created_by._id}'>${created_by.name}</a> ${_display.created}</div>";
}
function getModifiedInfoTpl() {
    return "<div><a href='/app/admin/users/view/${modified_by._id}'>${modified_by.name}</a> ${_display.modified}</div>";
}
function getDateTpl(field) {
    return `<div>\${_display.${field.name}}</div>`;
}
function getDateTimeTpl(field) {
    return `<div>\${_display.${field.name}}</div>`;
}
//TODO 处理name字段
function getRefObjectNameFieldName(field) {
    // const refObject = objectql.getObject(field.reference_to);
    // return refObject.NAME_FIELD_KEY;
    return "name";
}
function getSelectTpl(field) {
    return `<div>\${_display.${field.name}}</div>`;
}
function getNameTpl(field, ctx) {
    if (ctx.objectName === "cms_files") {
        return `<a href="\${context.rootUrl}/api/files/files/\${versions[0]}?download=true">\${${field.name}}</a>`;
    }
    return `<a href="/app/${ctx.appId}/${ctx.tabId}/view/\${${ctx.idFieldName}}">\${${field.name}}</a>`;
}
function getLookupTpl(field) {
    if (!field.reference_to) {
        return getSelectTpl(field);
    }
    const NAME_FIELD_KEY = getRefObjectNameFieldName(field);
    if (field.multiple) {
        return `
        <% if (data.${field.name} && data.${field.name}.length) { %><% data.${field.name}.forEach(function(item) { %> <a href="/app/-/${field.reference_to}/view/<%=item._id%>"><%=item.${NAME_FIELD_KEY}%></a>  <% }); %><% } %>
        `;
    } else {
        return `<a href="/app/-/${field.reference_to}/view/\${${field.name}._id}">\${${field.name}.${NAME_FIELD_KEY}}</a>`;
    }
}
function getSwitchTpl(field) {
    return `<% if (data.${field.name}) { %>
    <span class="slds-icon_container slds-icon-utility-check slds-current-color" title="<%=data._display.${field.name}%>">
        <span class="slds-assistive-text"><%=data._display.${field.name}%></span>
    </span>
    <% } %>`;
}
function getPasswordTpl(field) {
    return `<% if (data.${field.name}) { %>
        <span>······</span>
        <% } %>`;
}
function getFieldTpl(field, options) {
    if (field.is_name || field.name === options.labelFieldName) {
        return getNameTpl(field, options);
    }
    switch(field.type){
        case "password":
            return getPasswordTpl(field);
        case "boolean":
            return getSwitchTpl(field);
        case "select":
            return getSelectTpl(field);
        case "date":
            return getDateTpl(field);
        case "datetime":
            return getDateTimeTpl(field);
        case "lookup":
            return getLookupTpl(field);
        case "master_detail":
            return getLookupTpl(field);
        default:
            break;
    }
}
;


/***/ }),

/***/ 6195:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "KR": () => (/* binding */ getFormSchema),
  "$R": () => (/* binding */ getListSchema),
  "I3": () => (/* binding */ getObjectRelated),
  "ke": () => (/* binding */ getObjectRelateds),
  "mp": () => (/* binding */ getSearchableFieldsFilterSchema),
  "NW": () => (/* binding */ getUISchema),
  "DM": () => (/* binding */ getViewSchema)
});

// UNUSED EXPORTS: getField

// EXTERNAL MODULE: ./src/lib/steedos.client.js
var steedos_client = __webpack_require__(8282);
// EXTERNAL MODULE: ./src/lib/converter/amis/fields/index.js + 1 modules
var amis_fields = __webpack_require__(7804);
;// CONCATENATED MODULE: ./src/lib/converter/amis/api.js


const graphql = __webpack_require__(1306);
const api_ = __webpack_require__(6517);
const API_CACHE = 100;
function getReadonlyFormAdaptor(fields) {
    let scriptStr = "";
    const selectFields = api_.filter(fields, function(field) {
        return field.name.indexOf(".") < 0 && (field.type == "select" && field.options || (field.type == "lookup" || field.type == "master_detail") && !field.reference_to);
    });
    api_.each(selectFields, function(field) {
        if (!api_.includes(amis_fields.OMIT_FIELDS, field.name)) {
            const valueField = field.name;
            if (field.options) {
                const options = JSON.stringify({
                    options: field.options
                });
                scriptStr = scriptStr + `var ${field.name}Options= (${options}).options;`;
            } else if (field.optionsFunction) {
                scriptStr = scriptStr + `var ${field.name}Options = eval(${field.optionsFunction.toString()})(api.data);`;
            }
            if (field.multiple) {
                scriptStr = scriptStr + `data.${field.name}__label = _.map(_.filter(${field.name}Options, function(option){return _.includes(data.${field.name}, option.value)}), 'label');`;
            } else {
                scriptStr = scriptStr + `var ${field.name}Selected = _.find(${field.name}Options, function(option){return data.${field.name} == option.value});`;
                scriptStr = scriptStr + `data.${field.name}__label = ${field.name}Selected ? ${field.name}Selected.label:null;`;
            }
        }
    });
    // const refFields = _.filter(fields, function(field){return field.name.indexOf('.') < 0 && (field.type == 'lookup' || field.type == 'master_detail') && !field.reference_to});
    // _.each(refFields, function(field){
    //     if(!_.includes(OMIT_FIELDS, field.name)){
    //         const valueField = field.reference_to_field || '_id';
    //         scriptStr = scriptStr + `var ${field.name}Options = eval(${field.optionsFunction.toString()})(api.data);`
    //         if(field.multiple){
    //             scriptStr = scriptStr + `data.${field.name}__label = _.map(_.filter(${field.name}Options, function(option){return _.includes(data.${field.name}, option.value)}), 'label');`
    //         }else{
    //             scriptStr = scriptStr + `var ${field.name}Selected = _.find(${field.name}Options, function(option){return data.${field.name} == option.value});`
    //             scriptStr = scriptStr + `data.${field.name}__label = ${field.name}Selected ? ${field.name}Selected.label:null;`
    //         }
    //     }
    // })
    return `
    if(payload.data.data){
        var data = payload.data.data[0];
        ${scriptStr}
        payload.data = data;
        window.postMessage(Object.assign({type: "record.loaded"}, {record: data}), "*")
    }
    return payload;
`;
}
function getReadonlyFormInitApi(object, recordId, fields) {
    return {
        method: "post",
        url: graphql.getApi() + "?rf=" + new Date().getTime(),
        cache: API_CACHE,
        adaptor: getReadonlyFormAdaptor(fields),
        data: graphql.getFindOneQuery(object, recordId, fields),
        headers: {
            Authorization: "Bearer ${context.tenantId},${context.authToken}"
        }
    };
}
function getConvertDataScriptStr(fields) {
    const refFields = api_.filter(fields, function(field) {
        return field.name.indexOf(".") < 0 && (field.type == "lookup" || field.type == "master_detail") && field.reference_to;
    });
    let scriptStr = "";
    api_.each(refFields, function(field) {
        if (!api_.includes(amis_fields.OMIT_FIELDS, field.name)) {
            const valueField = field.reference_to_field || "_id";
            if (field.multiple) {
                scriptStr = scriptStr + `data.${field.name} = _.map(data.${field.name}, '${valueField}');`;
            } else {
                scriptStr = scriptStr + `data.${field.name} = data.${field.name} ? data.${field.name}.${valueField}:null;`;
            }
        }
    });
    return scriptStr;
}
/*
    img字段值添加URL前缀使其在amis中正常显示图片。
*/ function getScriptForAddUrlPrefixForImgFields(fields) {
    let imgFieldsKeys = [];
    let imgFields = {};
    let rootUrl = (0,steedos_client/* absoluteUrl */.GR)("/api/files/images/");
    fields.forEach((item)=>{
        if (item.type === "image") {
            imgFieldsKeys.push(item.name);
            imgFields[item.name] = {
                name: item.name,
                multiple: item.multiple
            };
        }
    });
    if (!imgFieldsKeys.length) {
        return "";
    }
    return `
                // image字段值添加URL前缀
                let imgFieldsKeys = ${JSON.stringify(imgFieldsKeys)};
                let imgFields = ${JSON.stringify(imgFields)};
                let rootUrl = ${JSON.stringify(rootUrl)};
                imgFieldsKeys.forEach((item)=>{
                    let imgFieldValue = data[item];
                    if(imgFieldValue && imgFieldValue.length){
                        if(imgFields[item].multiple){
                            if(imgFieldValue instanceof Array){
                                data[item] = imgFieldValue.map((value)=>{ return rootUrl + value});
                            }
                        }else{
                            data[item] = rootUrl + imgFieldValue;
                        }
                    }
                })
    `;
}
/*
    file字段值重写使其在amis中正常显示附件名、点击附件名下载文件。
*/ function getScriptForRewriteValueForFileFields(fields) {
    let fileFieldsKeys = [];
    let fileFields = {};
    let fileRootUrl = (0,steedos_client/* absoluteUrl */.GR)("/api/files/files/");
    fields.forEach((item)=>{
        if (item.type === "file") {
            fileFieldsKeys.push(item.name);
            fileFields[item.name] = {
                name: item.name,
                multiple: item.multiple
            };
        }
    });
    if (!fileFieldsKeys.length) {
        return "";
    }
    return `
                // file字段值重写以便编辑时正常显示附件名、点击附件名正常下载附件
                let fileFieldsKeys = ${JSON.stringify(fileFieldsKeys)};
                let fileFields = ${JSON.stringify(fileFields)};
                let fileRootUrl = ${JSON.stringify(fileRootUrl)};
                fileFieldsKeys.forEach((item)=>{
                    let fileFieldValue = data[item];
                    if(fileFieldValue && fileFieldValue.length){
                        const fileFieldNames = data._display[item].split(',');
                        if(fileFields[item].multiple){
                            if(fileFieldValue instanceof Array){
                                data[item] = fileFieldValue.map((value, index)=>{ 
                                    return {
                                        value: value,
                                        name: fileFieldNames[index],
                                        url: fileRootUrl + value + "?download=true",
                                        state: "uploaded"
                                    }
                                });
                            }
                        }else{
                            data[item] = {
                                value: fileFieldValue,
                                name: fileFieldNames[0],
                                url: fileRootUrl + fileFieldValue + "?download=true",
                                state: "uploaded"
                            };
                        }
                    }
                })
    `;
}
function getEditFormInitApi(object, recordId, fields) {
    return {
        method: "post",
        url: graphql.getApi(),
        sendOn: "!!this.recordId",
        cache: API_CACHE,
        adaptor: `
            if(payload.data.data){
                var data = payload.data.data[0];
                if(data){
                    ${getConvertDataScriptStr(fields)}
                    ${getScriptForAddUrlPrefixForImgFields(fields)}
                    ${getScriptForRewriteValueForFileFields(fields)}
                    //初始化接口返回的字段移除字段值为null的字段
                    for (key in data){
                        if(data[key] === null){
                            delete data[key];
                        }
                    }
                };
                payload.data = data;
                delete payload.extensions;
            }
            return payload;
        `,
        data: graphql.getFindOneQuery(object, recordId, fields),
        headers: {
            Authorization: "Bearer ${context.tenantId},${context.authToken}"
        }
    };
}
function getSaveApi(object, recordId, fields, options) {
    return {
        method: "post",
        url: graphql.getApi(),
        data: graphql.getSaveQuery(object, recordId, fields, options),
        requestAdaptor: graphql.getSaveRequestAdaptor(fields),
        responseData: {
            "recordId": "${record._id}"
        },
        adaptor: `
            return payload;
        `,
        headers: {
            Authorization: "Bearer ${context.tenantId},${context.authToken}"
        }
    };
}
function getBatchDelete(objectName) {
    return {
        method: "post",
        url: graphql.getApi(),
        requestAdaptor: `
            var ids = api.data.ids.split(",");
            var deleteArray = [];
            ids.forEach((id,index)=>{
                deleteArray.push(\`delete__\${index}:${objectName}__delete(id: "\${id}")\`);
            })
            api.data = {query: \`mutation{\${deleteArray.join(',')}}\`};
            return api;
        `,
        data: {
            ids: `\${ids}`
        },
        headers: {
            Authorization: "Bearer ${context.tenantId},${context.authToken}"
        }
    };
}

// EXTERNAL MODULE: ./src/lib/converter/amis/fields/table.js
var fields_table = __webpack_require__(2696);
;// CONCATENATED MODULE: ./src/lib/converter/amis/fields/sections.js
/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-05-26 16:02:08
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-23 17:53:16
 * @Description: 
 */ const Fields = __webpack_require__(7804);
const lodash = __webpack_require__(6517);
const getFieldSchemaArray = (mergedSchema)=>{
    let fieldSchemaArray = [];
    fieldSchemaArray.length = 0;
    const fieldsArr = [];
    lodash.forEach(mergedSchema.fields, (field, fieldName)=>{
        if (!lodash.has(field, "name")) {
            field.name = fieldName;
        }
        fieldsArr.push(field);
    });
    lodash.forEach(lodash.sortBy(mergedSchema.fields, "sort_no"), (field)=>{
        if (!field.group || field.group == "null" || field.group == "-") field.group = "\u901A\u7528";
        const fieldName = field.name;
        let isObjectField = /\w+\.\w+/.test(fieldName);
        if (field.type == "grid" || field.type == "object") {
            // field.group = field.label
            field.is_wide = true;
        }
        if (!isObjectField) {
            if (!field.hidden) {
                fieldSchemaArray.push(Object.assign({
                    name: fieldName
                }, field, {
                    permission: {
                        allowEdit: true
                    }
                }));
            }
        }
    });
    return fieldSchemaArray;
};
const getSection = async (permissionFields, fieldSchemaArray, sectionName, ctx)=>{
    const sectionFields = lodash.filter(fieldSchemaArray, {
        "group": sectionName
    });
    if (sectionFields.length == lodash.filter(sectionFields, [
        "hidden",
        true
    ]).length) {
        return;
    }
    const fieldSetBody = [];
    for (const perField of sectionFields){
        let field = perField;
        if (perField.type === "grid") {
            field = await Fields.getGridFieldSubFields(perField, permissionFields);
        } else if (perField.type === "object") {
            field = await Fields.getObjectFieldSubFields(perField, permissionFields);
        }
        if (field.name.indexOf(".") < 0) {
            const amisField = await Fields.convertSFieldToAmisField(field, field.readonly, ctx);
            if (amisField) {
                fieldSetBody.push(amisField);
            }
        }
    }
    return {
        "type": "fieldSet",
        "title": sectionName,
        "collapsable": true,
        "body": fieldSetBody
    };
};
const getSections = async (permissionFields, mergedSchema, ctx)=>{
    const fieldSchemaArray = getFieldSchemaArray(mergedSchema);
    const _sections = lodash.groupBy(fieldSchemaArray, "group");
    const sections = [];
    for(const key in _sections){
        const section = await getSection(permissionFields, fieldSchemaArray, key, ctx);
        if (section.body.length > 0) {
            sections.push(section);
        }
    }
    return sections;
};

;// CONCATENATED MODULE: ./src/lib/converter/amis/form.js
/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-07 11:02:29
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-23 17:52:58
 * @Description: 
 */ 
async function getFormBody(permissionFields, objectConfig, ctx) {
    return await getSections(permissionFields, objectConfig, ctx);
}

// EXTERNAL MODULE: ./src/lib/converter/amis/fields/list.js
var list = __webpack_require__(5158);
// EXTERNAL MODULE: external "lodash"
var external_lodash_ = __webpack_require__(6517);
;// CONCATENATED MODULE: ./src/lib/converter/amis/index.js







function getBulkActions(objectSchema) {
    return [
        {
            "type": "button",
            "level": "danger",
            "label": "\u6279\u91CF\u5220\u9664",
            "actionType": "ajax",
            "confirmText": "\u786E\u5B9A\u8981\u5220\u9664\u5417",
            "id": "batchDelete",
            "api": getBatchDelete(objectSchema.name)
        }
    ];
}
function getHeaderToolbar(mainObject, formFactor) {
    if (formFactor === "SMALL") {
        return [
            "bulkActions",
            {
                "type": "reload",
                "align": "right"
            },
            {
                "type": "search-box",
                "align": "right",
                "name": "__keywords",
                "placeholder": "\u8BF7\u8F93\u5165\u5173\u952E\u5B57",
                "mini": true
            }
        ];
    } else {
        return [
            "filter-toggler",
            "bulkActions",
            // {
            //     "type": "export-excel",
            //     "align": "right"
            // },
            // {
            //     "type": "reload",
            //     "align": "right"
            // },
            // {
            //     "type": "columns-toggler",
            //     "align": "right"
            // },
            {
                "type": "search-box",
                "align": "right",
                "name": "__keywords",
                "placeholder": "\u8BF7\u8F93\u5165\u5173\u952E\u5B57",
                "mini": true
            }
        ];
    }
}
function getToolbar() {
    return [];
}
function footerToolbar() {
    return [
        "statistics",
        "switch-per-page",
        "pagination"
    ];
}
function getFilter() {
    return {
        "title": "\u6761\u4EF6\u641C\u7D22",
        "submitText": "",
        "body": [
            {
                "type": "input-text",
                "name": "name",
                "placeholder": "\u5408\u540C\u540D\u79F0",
                "addOn": {
                    "label": "\u641C\u7D22",
                    "type": "submit"
                }
            }
        ]
    };
}
function getObjectList(objectSchema, fields, options) {
    const bulkActions = getBulkActions(objectSchema);
    const bodyProps = {
        toolbar: getToolbar(),
        footerToolbar: footerToolbar(),
        headerToolbar: getHeaderToolbar(objectSchema, options.formFactor),
        bulkActions: bulkActions,
        bodyClassName: ""
    };
    let body = null;
    const id = `listview_${objectSchema.name}`;
    if (options.formFactor === "SMALL") {
        body = Object.assign({}, (0,list.getListSchema)(fields, options), {
            type: "crud",
            primaryField: "_id",
            id: id,
            name: id,
            keepItemSelectionOnPageChange: true,
            api: (0,fields_table.getTableApi)(objectSchema, fields, options)
        }, bodyProps);
    } else {
        const table = (0,fields_table.getTableSchema)(fields, Object.assign({
            idFieldName: objectSchema.idFieldName,
            labelFieldName: objectSchema.NAME_FIELD_KEY || "name"
        }, options));
        delete table.mode;
        body = Object.assign({}, table, {
            type: "crud",
            primaryField: "_id",
            id: id,
            name: id,
            keepItemSelectionOnPageChange: true,
            api: (0,fields_table.getTableApi)(objectSchema, fields, options)
        }, bodyProps);
    }
    return {
        type: "page",
        bodyClassName: "bg-white sm:rounded-lg p-0",
        name: `page`,
        data: {
            context: {
                rootUrl: (0,steedos_client/* getRootUrl */.N0)(),
                tenantId: (0,steedos_client/* getTenantId */.jM)(),
                authToken: (0,steedos_client/* getAuthToken */.bW)()
            }
        },
        body: body
    };
}
async function getObjectForm(objectSchema, ctx) {
    const { recordId , tabId , appId  } = ctx;
    const fields = _.values(objectSchema.fields);
    return {
        type: "page",
        bodyClassName: "",
        regions: [
            "body"
        ],
        name: `page_edit_${recordId}`,
        data: {
            recordId: recordId,
            objectName: objectSchema.name,
            context: {
                rootUrl: (0,steedos_client/* getRootUrl */.N0)(),
                tenantId: (0,steedos_client/* getTenantId */.jM)(),
                authToken: (0,steedos_client/* getAuthToken */.bW)()
            }
        },
        initApi: null,
        initFetch: null,
        body: [
            {
                type: "form",
                mode: "horizontal",
                persistData: false,
                promptPageLeave: true,
                name: `form_edit_${recordId}`,
                debug: false,
                title: "",
                submitText: "",
                api: getSaveApi(objectSchema, recordId, fields, {}),
                initApi: getEditFormInitApi(objectSchema, recordId, fields),
                initFetch: recordId != "new",
                body: await getFormBody(fields, objectSchema, ctx),
                panelClassName: "m-0 sm:rounded-lg shadow-none",
                bodyClassName: "p-0",
                className: "p-4 sm:p-0 steedos-amis-form"
            }
        ]
    };
}
async function getObjectDetail(objectSchema, recordId, ctx) {
    const fields = _.values(objectSchema.fields);
    return {
        type: "page",
        bodyClassName: "",
        regions: [
            "body"
        ],
        name: `page_readonly_${recordId}`,
        id: `detail_${recordId}`,
        data: {
            context: {
                rootUrl: (0,steedos_client/* getRootUrl */.N0)(),
                tenantId: (0,steedos_client/* getTenantId */.jM)(),
                authToken: (0,steedos_client/* getAuthToken */.bW)()
            }
        },
        initApi: getReadonlyFormInitApi(objectSchema, recordId, fields),
        initFetch: true,
        body: [
            {
                type: "form",
                mode: "horizontal",
                persistData: false,
                promptPageLeave: false,
                name: `form_readonly_${recordId}`,
                debug: false,
                title: "",
                body: await getFormBody((0,external_lodash_.map)(fields, (field)=>{
                    field.readonly = true;
                }), objectSchema, ctx),
                panelClassName: "m-0 sm:rounded-lg",
                bodyClassName: "p-0",
                className: "p-4 sm:p-0 steedos-amis-form",
                actions: [] // 不显示表单默认的提交按钮
            }
        ]
    };
}

;// CONCATENATED MODULE: ./src/lib/objects.js
/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-05 15:55:39
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-09 13:27:34
 * @Description: 
 */ 



const objects_ = __webpack_require__(6517);
const UI_SCHEMA_CACHE = {};
const setUISchemaCache = (key, value)=>{
    UI_SCHEMA_CACHE[key] = value;
};
const getUISchemaCache = (key)=>{
    return objects_.cloneDeep(UI_SCHEMA_CACHE[key]);
};
const hasUISchemaCache = (key)=>{
    return objects_.has(UI_SCHEMA_CACHE, key);
};
const getListViewColumns = (listView, formFactor)=>{
    let listViewColumns = [];
    if (formFactor === "SMALL") {
        listViewColumns = !(0,external_lodash_.isEmpty)(listView.mobile_columns) ? listView.mobile_columns : (0,external_lodash_.slice)(listView.columns, 0, 4);
    } else {
        listViewColumns = listView.columns;
    }
    return listViewColumns;
};
async function getUISchema(objectName, force) {
    if (!objectName) {
        return;
    }
    if (hasUISchemaCache(objectName) && !force) {
        return getUISchemaCache(objectName);
    }
    const url = `/service/api/@${objectName.replace(/\./g, "_")}/uiSchema`;
    let uiSchema = null;
    try {
        uiSchema = await (0,steedos_client/* fetchAPI */.Io)(url, {
            method: "get"
        });
        setUISchemaCache(objectName, uiSchema);
        for(const fieldName in uiSchema.fields){
            if (uiSchema.fields) {
                const field = uiSchema.fields[fieldName];
                if ((field.type === "lookup" || field.type === "master_detail") && field.reference_to) {
                    const refUiSchema = await getUISchema(field.reference_to);
                    if (!refUiSchema) {
                        delete uiSchema.fields[fieldName];
                    }
                }
            }
        }
    } catch (error) {
        console.error(`getUISchema`, objectName, error);
        setUISchemaCache(objectName, null);
    }
    return getUISchemaCache(objectName);
}
async function getField(objectName, fieldName) {
    const uiSchema = await getUISchema(objectName);
    return uiSchema === null || uiSchema === void 0 ? void 0 : uiSchema.fields[fieldName];
}
// 获取表单页面
async function getFormSchema(objectName, ctx) {
    const uiSchema = await getUISchema(objectName);
    const amisSchema = await getObjectForm(uiSchema, ctx);
    return {
        uiSchema,
        amisSchema
    };
}
// 获取只读页面
async function getViewSchema(objectName, recordId, ctx) {
    const uiSchema = await getUISchema(objectName);
    const amisSchema = await getObjectDetail(uiSchema, recordId, ctx);
    return {
        uiSchema,
        amisSchema
    };
}
// 获取列表视图
async function getListSchema(appName, objectName, listViewName, options = {}) {
    const uiSchema = await getUISchema(objectName);
    const listView = objects_.find(uiSchema.list_views, (listView, name)=>name === listViewName);
    if (!listView) {
        return {
            uiSchema
        };
    }
    let fields = uiSchema.fields;
    const listViewFields = [];
    let listViewColumns = getListViewColumns(listView, options.formFactor);
    if (listView && listViewColumns) {
        objects_.each(listViewColumns, function(column) {
            if (objects_.isString(column) && uiSchema.fields[column]) {
                listViewFields.push(uiSchema.fields[column]);
            } else if (objects_.isObject(column) && uiSchema.fields[column.field]) {
                listViewFields.push(Object.assign({}, uiSchema.fields[column.field], {
                    width: column.width,
                    wrap: column.wrap
                }));
            }
        });
    }
    if (listView && listView.extra_columns) {
        objects_.each(listView.extra_columns, function(column) {
            if (objects_.isString(column)) {
                listViewFields.push({
                    extra: true,
                    name: column
                });
            } else if (objects_.isObject(column)) {
                listViewFields.push({
                    extra: true,
                    name: column.field
                });
            }
        });
    }
    fields = listViewFields;
    const amisSchema = await getObjectList(uiSchema, fields, {
        tabId: objectName,
        appId: appName,
        objectName: objectName,
        ...options,
        filter: listView.filters
    });
    return {
        uiSchema,
        amisSchema
    };
}
// 获取所有相关表
async function getObjectRelateds(appName, objectName, recordId, formFactor) {
    const uiSchema = await getUISchema(objectName);
    const related = [];
    const details = [].concat(uiSchema.details || []);
    if (uiSchema.enable_files) {
        details.push(`cms_files.parent`);
    }
    for (const detail of details){
        const arr = detail.split(".");
        let filter = null;
        const refField = await getField(arr[0], arr[1]);
        if (refField._reference_to || refField.reference_to && !objects_.isString(refField.reference_to)) {
            filter = [
                [
                    `${arr[1]}/o`,
                    "=",
                    objectName
                ],
                [
                    `${arr[1]}/ids`,
                    "=",
                    recordId
                ]
            ];
        } else {
            filter = [
                `${arr[1]}`,
                "=",
                recordId
            ];
        }
        related.push({
            masterObjectName: objectName,
            object_name: arr[0],
            foreign_key: arr[1],
            schema: await getListSchema(appName, arr[0], "all", {
                globalFilter: filter,
                formFactor: formFactor
            })
        });
    }
    return related;
}
// 获取单个相关表
async function getObjectRelated(appName, masterObjectName, objectName, relatedFieldName, recordId, formFactor) {
    let filter = null;
    const refField = await getField(objectName, relatedFieldName);
    if (refField._reference_to || refField.reference_to && !objects_.isString(refField.reference_to)) {
        filter = [
            [
                `${relatedFieldName}/o`,
                "=",
                objectName
            ],
            [
                `${relatedFieldName}/ids`,
                "=",
                recordId
            ]
        ];
    } else {
        filter = [
            `${relatedFieldName}`,
            "=",
            recordId
        ];
    }
    console.log(`filter`, filter);
    const masterObjectUISchema = await getUISchema(masterObjectName, formFactor);
    return {
        masterObjectName: masterObjectName,
        object_name: objectName,
        foreign_key: relatedFieldName,
        schema: await getListSchema(appName, objectName, "all", {
            globalFilter: filter,
            formFactor: formFactor
        }),
        record: await SteedosUI.Object.getRecord(masterObjectName, recordId, [
            masterObjectUISchema.NAME_FIELD_KEY
        ]),
        masterObjectUISchema: masterObjectUISchema
    };
}
async function getSearchableFieldsFilterSchema(fields) {
    const body = [];
    for (const field of fields){
        const amisField = await (0,amis_fields.getFiledSearchable)(field, fields, {});
        if (amisField) {
            body.push(amisField);
        }
    }
    return {
        type: "page",
        name: "page",
        body: [
            {
                "title": "",
                "mode": "horizontal",
                "type": "form",
                "name": "form",
                "className": "grid grid-cols-3 gap-3",
                "body": body,
                "actions": []
            }
        ]
    };
}


/***/ })

};
;