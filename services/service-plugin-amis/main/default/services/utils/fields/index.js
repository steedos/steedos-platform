const Tpl = require('../tpl');
const _ = require('underscore');
const OMIT_FIELDS = ['created', 'created_by', 'modified', 'modified_by'];
const Lookup = require('./lookup');
const AmisFormInputs = [
    'text',
    'date',
    'file',
    'color',
    'avatar',
    'image',
    'datetime',
    'time',
    'number',
    'currency',
    'percent',
    'password',
    'url',
    'email'
]

function getBaseFields(readonly){
    let calssName = 'm-0';
    if(readonly){
        calssName = `${calssName} slds-form-element_readonly`
    }
    return [
        { 
            name: "createdInfo", 
            label: "创建人",
            type: "static",
            labelClassName: 'text-left',
            className: calssName,
            tpl: Tpl.getCreatedInfoTpl()
        },
        { 
            name: "modifiedInfo", 
            label: "修改人",
            type: "static",
            labelClassName: 'text-left',
            className: calssName,
            tpl: Tpl.getModifiedInfoTpl()
        }
    ]
};

function getAmisStaticFieldType(type, readonly){
    if(!readonly){
        if(_.include(AmisFormInputs, type)){
            return `input-${type}`;
        }
        return type;
    }
    if(_.include(['text','color'], type)){
        return `static-${type}`;
    }else{
        return 'static';
    }
};

function getAmisFieldType(sField){
    switch (sField.type) {
        case 'text':
            return 'text';
        case 'textarea':
            return 'textarea';
        case 'html':
            return 'html';
        case 'select':
            return 'select';
        case 'color':
            return 'color';
        case 'boolean':
            return 'checkbox';
        case 'date':
            return 'date';
        case 'datetime':
            return 'datetime';
        case 'number':
            return 'number';
        case 'currency':
            return 'number';
        case 'percent':
            return 'number'
        case 'password':
            return 'password';
        case 'lookup':
            // TODO 根据字段配置返回 select || picker
            return 'select';
        case 'master_detail':
            // TODO 根据字段配置返回 select || picker
            return 'picker';
        case 'autonumber':
            return 'text';
        case 'url':
            return 'url'
        case 'email':
            return 'email'
        case 'image':
            return 'image'
        case 'formula':
            //TODO
            break;
        case 'summary':
            //TODO
            break;
        case 'grid':
            return 'table';
        default:
            console.log('convertData default', sField.type);
            // convertData.type = field.type
            break;
    }

};

function getObjectFieldSubFields(mainField, fields){
    const newMainField = Object.assign({subFields: []}, mainField);
    const subFields = _.filter(fields, function(field){
        return field.name.startsWith(`${mainField.name}.`)
    });
    newMainField.subFields = subFields;
    return newMainField;
}

function getGridFieldSubFields(mainField, fields){
    const newMainField = Object.assign({subFields: []}, mainField);
    const subFields = _.filter(fields, function(field){
        return field.name.startsWith(`${mainField.name}.`)
    });
    newMainField.subFields = subFields;
    return newMainField;
}

/**
 * TODO 处理权限
 * @param {*} object steedos object
 * @param {*} userSession 
 */
function getPermissionFields(object, userSession){
    const permissionFields = [];
    const fieldsArr = [];
	_.each(object.fields , (field, field_name)=>{
		if(!_.has(field, "name")){
			field.name = field_name
        }
		fieldsArr.push(field)
    })
    _.each(_.sortBy(fieldsArr, "sort_no"), function(field){
        if(!field.hidden){
            permissionFields.push( Object.assign({}, field, {permission: {allowEdit: true}}))
        }
    })
    return permissionFields;
}


function getSelectFieldOptions(field){
    const dataType = field.data_type || 'text';
    const options = [];
    _.each(field.options, (item)=>{
        switch (dataType) {
            case 'number':
                options.push({label: item.label, value: Number(item.value)});
                break;
            case 'text':
                options.push({label: item.label, value: String(item.value)});
                break;
            case 'boolean':
                options.push({label: item.label, value: item.value === 'false' ? false : true});
                break;
            default:
                break;
        }
    });
    return options;
}

function  convertSFieldToAmisFilesField(field,readonly){
    const type = field.type;
    let table_name;
    let fieldType = type;
    if(type === 'avatar'){
        table_name = 'avatars';
        fieldType = "image";
    }else if(type === 'image'){
        table_name = 'images';
    }else if(type === 'file'){
        table_name = 'files';
    }
    const rootUrl = Meteor.absoluteUrl(`/api/files/${table_name}/`);
    let convertData = {
        type: getAmisStaticFieldType(fieldType, readonly),
        receiver: {
            method: "post",
            url: `/api/v6/files/${table_name}`,
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
    }
    if(field.multiple){
        convertData.multiple = true;
        convertData.joinValues = false;
        convertData.extractValue = true;
    }
    return convertData;
}

function convertSFieldToAmisField(field, readonly) {
    // 创建人和修改人、创建时间和修改时间不显示
    if(_.include(OMIT_FIELDS, field.name)){
        return;
    }
    const baseData = {name: field.name, label: field.label, labelRemark: field.inlineHelpText, required: field.required};
    let convertData = {};
    // if(_.include(OMIT_FIELDS, field.name)){
    //     readonly = true;
    // }
    switch (field.type) {
        case 'text':
            convertData.type = getAmisStaticFieldType('text', readonly);
            break;
        case 'textarea':
            convertData.type = getAmisStaticFieldType('textarea', readonly);
            convertData.tpl = `<b><%=data.${field.name}%></b>`;
            break;
        case 'html':
            convertData = {
                type: "editor",
                language: "html",
                value: field.defaultValue || ''
            }
            break;
            // convertData = {
            //     type: getAmisStaticFieldType('html', readonly)
            // }
            // break;
        case 'select':
            convertData = {
                type: getAmisStaticFieldType('select', readonly),
                joinValues: false,
                options: getSelectFieldOptions(field),
                extractValue: true,
                clearable: true,
                labelField: 'label',
                valueField: 'value',
                tpl: readonly ? Tpl.getSelectTpl(field) : null
            }
            if(_.has(field, 'defaultValue') && !(_.isString(field.defaultValue) && field.defaultValue.startsWith("{"))){
                const dataType = field.data_type || 'text';
                if(field.defaultValue != null){
                    if(dataType === 'text'){
                        convertData.value = String(field.defaultValue);
                    }else if(dataType === 'number'){
                        convertData.value = Number(field.defaultValue);
                    }else if(dataType === 'boolean'){
                        convertData.value = field.defaultValue === 'false' ? false : true;
                    }
                }
            }
            if(field.multiple){
                convertData.multiple = true
                convertData.extractValue = true
            }
            break;
        case 'boolean':
            convertData = {
                type: getAmisStaticFieldType('checkbox', readonly),
                option: field.inlineHelpText,
                tpl: readonly ? Tpl.getSwitchTpl(field) : null
            }
            break;
        case 'date':
            convertData = {
                type: getAmisStaticFieldType('date', readonly),
                inputFormat: "YYYY-MM-DD",
                format:'YYYY-MM-DDT00:00:00.000[Z]',
                tpl: readonly ? Tpl.getDateTpl(field) : null,
                // utc: true
            }
            break;
        case 'datetime':
            convertData = {
                type: getAmisStaticFieldType('datetime', readonly),
                inputFormat: 'YYYY-MM-DD HH:mm',
                format:'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
                tpl: readonly ? Tpl.getDateTimeTpl(field) : null,
                utc: true
            }
            break;
        case 'time':
            convertData = {
                type: getAmisStaticFieldType('time', readonly),
                inputFormat: 'HH:mm',
                timeFormat:'1970-01-01THH:mm:00.000[Z]',
                format:'1970-01-01THH:mm:00.000[Z]',
                tpl: readonly ? Tpl.getDateTimeTpl(field) : null,
                // utc: true
            }
            break;
        case 'number':
            convertData = {
                type: getAmisStaticFieldType('number', readonly),
                min: field.min,
                max: field.max,
                precision: field.scale
            }
            break;
        case 'currency':
            //TODO
            convertData = {
                type: getAmisStaticFieldType('number', readonly),
                min: field.min,
                max: field.max,
                precision: field.scale
            }
            break;
        case 'percent':
            //TODO
            convertData = {
                type: getAmisStaticFieldType('number', readonly),
                min: field.min,
                max: field.max,
                precision: field.scale
            }
            break;
        case 'password':
            convertData = {
                type: getAmisStaticFieldType('password', readonly),
                tpl: readonly ? Tpl.getPasswordTpl(field) : null
            }
            break;
        case 'lookup':
            convertData = Lookup.lookupToAmis(field, readonly)
            break;
        case 'master_detail':
            convertData = Lookup.lookupToAmis(field, readonly)
            break;
        case 'autonumber':
            //TODO
            break;
        case 'url':
            convertData = {
                type: getAmisStaticFieldType('url', readonly)
            }
            break;
        case 'email':
            convertData = {
                type: getAmisStaticFieldType('email', readonly)
            }
            break;
        case 'avatar':
            convertData = convertSFieldToAmisFilesField(field,readonly);
            break;
        case 'image':
            convertData = convertSFieldToAmisFilesField(field,readonly);
            break;
        case 'file':
            convertData = convertSFieldToAmisFilesField(field,readonly);
            break;
        case 'formula':
            //TODO
            break;
        case 'summary':
            //TODO
            break;
        case 'code':
            convertData = {
                type: "editor",
                language: field.language,
                value: field.defaultValue || ''
            }
            break;
        case 'toggle':
            convertData = {
                type: "switch"
            }
            break;
        case 'grid':
            convertData = {
                type: 'input-table',
                strictMode:false,
                affixHeader: false, // 是否固定表头, 不固定表头, 否则form有y轴滚动条时, 表头会跟随滚动条滚动.
                // needConfirm: true,  此属性设置为false后，导致table不能编辑。
                editable: !readonly,
                addable: !readonly,
                removable: !readonly,
                draggable: !readonly,
                columns: []
            }
            _.each(field.subFields, function(subField){
                const subFieldName = subField.name.replace(`${field.name}.$.`, '').replace(`${field.name}.`, '');
                const gridSub = convertSFieldToAmisField(Object.assign({}, subField, {name: subFieldName}), readonly);
                if(gridSub){
                    delete gridSub.name
                    delete gridSub.label
                    convertData.columns.push({
                        name: subFieldName,
                        label: subField.label,
                        quickEdit: readonly ? false : gridSub
                    })
                }
            })
            break;
        default:
            // console.log('convertData default', field.type);
            // convertData.type = field.type
            break;
    }
    if(!_.isEmpty(convertData)){
        if(field.is_wide){
            convertData.className = 'col-span-2 m-0';
        }else{
            convertData.className = 'm-0';
        }
        if(readonly){
            convertData.className = `${convertData.className} slds-form-element_readonly`
        }
        convertData.labelClassName = 'text-left';
        if(readonly){
            convertData.quickEdit = false;
        }
        return Object.assign({}, baseData, convertData);
    }
    
}

exports.convertSFieldToAmisField = convertSFieldToAmisField;
exports.getPermissionFields = getPermissionFields;
exports.getObjectFieldSubFields = getObjectFieldSubFields;
exports.getGridFieldSubFields = getGridFieldSubFields;
exports.getAmisStaticFieldType = getAmisStaticFieldType;
exports.getBaseFields = getBaseFields;
exports.getAmisFieldType = getAmisFieldType;