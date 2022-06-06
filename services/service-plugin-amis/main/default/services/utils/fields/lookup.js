const _ = require('underscore');
const objectql = require('@steedos/objectql');
const steedosI18n = require("@steedos/i18n");
const graphql = require('../graphql');
const clone = require('clone');
const Tpl = require('../tpl');
const Field = require('./index');
const Table = require('./table');

const getReferenceTo = (field)=>{
    let referenceTo = field.reference_to;
    if(!referenceTo){
        return ;
    }
    if(referenceTo === 'users'){
        referenceTo = 'space_users';
    }
    const refObject = objectql.getObject(referenceTo);
    const refObjectConfig = clone(refObject.toConfig());
    let valueFieldName = field.reference_to_field;
    if(!valueFieldName){
        if(referenceTo === 'space_users'){
            valueFieldName = 'user';
        }else{
            valueFieldName = refObject.key_field || '_id';
        }
    }
    if(valueFieldName === '_id'){
        valueField = {name: '_id', label: 'ID', type: 'text', toggled: false};
    }else{
        valueField = refObjectConfig.fields[valueFieldName];
    }
    return {
        objectName: referenceTo,
        valueField: valueField,
        labelField: refObjectConfig.fields[refObject.NAME_FIELD_KEY || 'name']
    }
}


function lookupToAmisPicker(field, readonly){
    let referenceTo = getReferenceTo(field);
    if(!referenceTo){
        return ;
    }
    const refObject = objectql.getObject(referenceTo.objectName);
    const refObjectConfig = clone(refObject.toConfig());
    steedosI18n.translationObject('zh-CN', refObjectConfig.name, refObjectConfig)
    const tableFields = [referenceTo.valueField];
    let i = 0;
    const searchableFields = [];
    _.each(refObjectConfig.fields,function(field){
        if(i < 5){
            if(!_.find(tableFields, function(f){
                return f.name === field.name
            })){
                i++;
                tableFields.push(field)
                if(field.searchable){
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
        fields[tableField.name] = tableField;
    });

    const source = getApi({
        name: referenceTo.objectName
    }, null, fields, {alias: 'rows', queryOptions: `filters: {__filters}, top: {__top}, skip: {__skip}, sort: "{__sort}"`});
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
            filters = [["${valueField.name}", "=", selfData.value]];
        }
        if(allowSearchFields){
            allowSearchFields.forEach(function(key){
                const keyValue = selfData[key];
                if(keyValue){
                    filters.push([key, "contains", keyValue]);
                }
            })
        }
        api.data.query = api.data.query.replaceAll('{__filters}', JSON.stringify(filters)).replace('{__top}', pageSize).replace('{__skip}', skip).replace('{__sort}', sort.trim());
        return api;
    `

    let top = 50;

    if(refObjectConfig.paging && refObjectConfig.paging.enabled === false){
        top = 1000;
    };

    const data = {
        type: Field.getAmisStaticFieldType('picker', readonly),
        labelField: referenceTo.labelField.name,
        valueField: referenceTo.valueField.name,
        modalMode: 'dialog', //TODO 设置 dialog 或者 drawer，用来配置弹出方式
        source: source,
        size: "lg",
        pickerSchema: Table.getTableSchema(tableFields, {
            top:  top
        }),
        joinValues: false
    }
    if(field.multiple){
        data.multiple = true
        data.extractValue = true
    }

    if(readonly){
        data.tpl = Tpl.getLookupTpl(field)
    }

    return data;
}

function lookupToAmisSelect(field, readonly){
    let referenceTo = getReferenceTo(field);

    let apiInfo;

    if(referenceTo){
        apiInfo = getApi({
            name: referenceTo.objectName
        }, null, {
            [referenceTo.labelField.name]: referenceTo.labelField,
            [referenceTo.valueField.name]: referenceTo.valueField
        }, {alias: 'options', queryOptions: `filters: {__filters}, top: {__top}`})
    }else{
        apiInfo = {
            method: "post",
            url: graphql.getApi(),
            data: {query: '{objects(filters: ["_id", "=", "-1"]){_id}}', $: "$$"}
        }
    }

    
    apiInfo.data.$term = "$term";
    apiInfo.data.$value = `$${field.name}.${referenceTo ? referenceTo.valueField.name : '_id'}`;
    _.each(field.depend_on, function(fName){
        apiInfo.data[fName] = `$${fName}`;
    })
    apiInfo.data['$'] = `$$`;
    apiInfo.data['rfield'] = `\${object_name}`;
    // [["_id", "=", "$${field.name}._id"],"or",["name", "contains", "$term"]]
    apiInfo.requestAdaptor = `
        var filters = '[]';
        var top = 10;
        if(api.data.$term){
            filters = '["name", "contains", "'+ api.data.$term +'"]';
        }else if(api.data.$value){
            filters = '["_id", "=", "'+ api.data.$value +'"]';
        }
        api.data.query = api.data.query.replaceAll('{__filters}', filters).replace('{__top}', top);
        return api;
    `
    let labelField = referenceTo ? referenceTo.labelField.name : '';
    let valueField = referenceTo ? referenceTo.valueField.name : '';
    if(field._optionsFunction){
        apiInfo.adaptor = `
        payload.data.options = eval(${field._optionsFunction})(api.data);
        return payload;
        `
        labelField = 'label';
        valueField = 'value';
    }

    const data = {
        type: Field.getAmisStaticFieldType('select', readonly),
        joinValues: false,
        extractValue: true,
        labelField: labelField,
        valueField: valueField,
        autoComplete: apiInfo,
    }
    if(_.has(field, 'defaultValue') && !(_.isString(field.defaultValue) && field.defaultValue.startsWith("{"))){
        data.value = field.defaultValue
    }
    if(field.multiple){
        data.multiple = true
        data.extractValue = true
    }

    if(readonly){
        data.tpl = Tpl.getLookupTpl(field)
    }

    return data;
}

function getApi(object, recordId, fields, options){
    return {
        method: "post",
        url: graphql.getApi(),
        data: graphql.getFindQuery(object, recordId, fields, Object.assign(options, {expand: false}))
    }
}

exports.lookupToAmis = (field, readonly)=>{
    let referenceTo = getReferenceTo(field);
    if(!referenceTo){
        return lookupToAmisSelect(field, readonly);
    }
    const refObject = objectql.getObject(referenceTo.objectName);

    // 此处不参考 steedos 的 enable_enhanced_lookup 规则. 如果默认是开启弹出选择,用户选择过程操作太繁琐, 所以默认是关闭弹出选择.
    if(refObject.enable_enhanced_lookup == true){
        return lookupToAmisPicker(field, readonly);
    }else{
        return lookupToAmisSelect(field, readonly);
    }
}

exports.lookupToAmisPicker = lookupToAmisPicker;
exports.lookupToAmisSelect = lookupToAmisSelect;