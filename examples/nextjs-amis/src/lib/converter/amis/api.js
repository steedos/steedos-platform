import { OMIT_FIELDS } from '@/lib/converter/amis/fields';
import { absoluteUrl } from '@/lib/steedos.client'
const graphql = require('./graphql');
const _ = require('lodash');
const API_CACHE = 100;

function getReadonlyFormAdaptor(fields){
    let scriptStr = '';
    const selectFields = _.filter(fields, function(field){return field.name.indexOf('.') < 0 && ((field.type == 'select' && field.options) || ((field.type == 'lookup' || field.type == 'master_detail') && !field.reference_to))});
    _.each(selectFields, function(field){
        if(!_.includes(OMIT_FIELDS, field.name)){
            const valueField = field.name;
            if(field.options){
                const options = JSON.stringify({options: field.options});
                scriptStr = scriptStr + `var ${field.name}Options= (${options}).options;`;
            }else if(field.optionsFunction){
                scriptStr = scriptStr + `var ${field.name}Options = eval(${field.optionsFunction.toString()})(api.data);`
            }
            if(field.multiple){
                scriptStr = scriptStr + `data.${field.name}__label = _.map(_.filter(${field.name}Options, function(option){return _.includes(data.${field.name}, option.value)}), 'label');`
            }else{
                scriptStr = scriptStr + `var ${field.name}Selected = _.find(${field.name}Options, function(option){return data.${field.name} == option.value});`
                scriptStr = scriptStr + `data.${field.name}__label = ${field.name}Selected ? ${field.name}Selected.label:null;`
            }
        }
    })

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

    return  `
    var data = payload.data.data[0];
    ${scriptStr}
    payload.data = data;
    return payload;
`
}

export function getReadonlyFormInitApi(object, recordId, fields){
    return {
        method: "post",
        url: graphql.getApi()+"?rf="+ (new Date()).getTime(),
        cache: API_CACHE,
        adaptor: getReadonlyFormAdaptor(fields),
        data: graphql.getFindOneQuery(object, recordId, fields),
        headers: {
            Authorization: "Bearer ${context.tenantId},${context.authToken}"
        }
    }
}

function getConvertDataScriptStr(fields){
    const refFields = _.filter(fields, function(field){return field.name.indexOf('.') < 0 && (field.type == 'lookup' || field.type == 'master_detail') && field.reference_to});
    let scriptStr = '';
    _.each(refFields, function(field){
        if(!_.includes(OMIT_FIELDS, field.name)){
            const valueField = field.reference_to_field || '_id';
            if(field.multiple){
                scriptStr = scriptStr + `data.${field.name} = _.map(data.${field.name}, '${valueField}');`
            }else{
                scriptStr = scriptStr + `data.${field.name} = data.${field.name} ? data.${field.name}.${valueField}:null;`
            }
        }
    })
    return scriptStr;
}

/*
    img字段值添加URL前缀使其在amis中正常显示图片。
*/
function getScriptForAddUrlPrefixForImgFields(fields){
    let imgFieldsKeys = [];
    let imgFields = {};
    let rootUrl = absoluteUrl('/api/files/images/');
    fields.forEach((item)=>{
        if(item.type === 'image'){
            imgFieldsKeys.push(item.name);
            imgFields[item.name] = {
                name: item.name,
                multiple: item.multiple
            };
        }
    })
    if(!imgFieldsKeys.length){
        return '';
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
    `
}

/*
    file字段值重写使其在amis中正常显示附件名、点击附件名下载文件。
*/
function getScriptForRewriteValueForFileFields(fields){
    let fileFieldsKeys = [];
    let fileFields = {};
    let fileRootUrl = absoluteUrl('/api/files/files/');
    fields.forEach((item)=>{
        if(item.type === 'file'){
            fileFieldsKeys.push(item.name);
            fileFields[item.name] = {
                name: item.name,
                multiple: item.multiple
            };
        }
    })
    if(!fileFieldsKeys.length){
        return '';
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
    `
}

export function getEditFormInitApi(object, recordId, fields){
    return {
        method: "post",
        url: graphql.getApi(),
        sendOn: "!!this.recordId",
        cache: API_CACHE,
        adaptor: `
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
            return payload;
        `,
        data: graphql.getFindOneQuery(object, recordId, fields),
        headers: {
            Authorization: "Bearer ${context.tenantId},${context.authToken}"
        }
    }
}


export function getSaveApi(object, recordId, fields, options){
    return {
        method: 'post',
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
    }
}