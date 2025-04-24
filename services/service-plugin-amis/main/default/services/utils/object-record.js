const _ = require('underscore');
const graphql = require('./graphql');
const Fields = require('./fields');
const Sections = require('./fields/sections');

const OMIT_FIELDS = ['created', 'created_by', 'modified', 'modified_by'];
const APICACHE = 100;

function getReadonlyFormAdaptor(fields){
    let scriptStr = '';
    const selectFields = _.filter(fields, function(field){return field.name.indexOf('.') < 0 && ((field.type == 'select' && field.options) || ((field.type == 'lookup' || field.type == 'master_detail') && !field.reference_to))});
    _.each(selectFields, function(field){
        if(!_.include(OMIT_FIELDS, field.name)){
            const valueField = field.name;
            if(field.options){
                const options = JSON.stringify({options: field.options});
                scriptStr = scriptStr + `var ${field.name}Options= (${options}).options;`;
            }else if(field.optionsFunction){
                scriptStr = scriptStr + `var ${field.name}Options = eval(${field.optionsFunction.toString()})(api.data);`
            }
            if(field.multiple){
                scriptStr = scriptStr + `data.${field.name}__label = _.pluck(_.filter(${field.name}Options, function(option){return _.include(data.${field.name}, option.value)}), 'label');`
            }else{
                scriptStr = scriptStr + `var ${field.name}Selected = _.find(${field.name}Options, function(option){return data.${field.name} == option.value});`
                scriptStr = scriptStr + `data.${field.name}__label = ${field.name}Selected ? ${field.name}Selected.label:null;`
            }
        }
    })

    // const refFields = _.filter(fields, function(field){return field.name.indexOf('.') < 0 && (field.type == 'lookup' || field.type == 'master_detail') && !field.reference_to});
    // _.each(refFields, function(field){
    //     if(!_.include(OMIT_FIELDS, field.name)){
    //         const valueField = field.reference_to_field || '_id';
    //         scriptStr = scriptStr + `var ${field.name}Options = eval(${field.optionsFunction.toString()})(api.data);`
    //         if(field.multiple){
    //             scriptStr = scriptStr + `data.${field.name}__label = _.pluck(_.filter(${field.name}Options, function(option){return _.include(data.${field.name}, option.value)}), 'label');`
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

function getReadonlyFormInitApi(object, recordId, fields){
    return {
        method: "post",
        url: graphql.getApi()+"?rf="+ (new Date()).getTime(),
        cache: APICACHE,
        adaptor: getReadonlyFormAdaptor(fields),
        data: graphql.getFindOneQuery(object, recordId, fields)
    }
}

/**
 * Global parameter: data、payload
 * @param {*} fields 
 */
function getConvertDataScriptStr(fields){
    const refFields = _.filter(fields, function(field){return field.name.indexOf('.') < 0 && (field.type == 'lookup' || field.type == 'master_detail') && field.reference_to});
    let scriptStr = '';
    _.each(refFields, function(field){
        if(!_.include(OMIT_FIELDS, field.name)){
            const valueField = field.reference_to_field || '_id';
            if(field.multiple){
                scriptStr = scriptStr + `data.${field.name} = _.pluck(data.${field.name}, '${valueField}');`
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
    let rootUrl = Meteor.absoluteUrl('/api/files/');
    fields.forEach((item)=>{
        if(item.type === 'image' || item.type === 'avatar'){
            imgFieldsKeys.push(item.name);
            imgFields[item.name] = {
                name: item.name,
                type: item.type,
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
                        let fieldProps = imgFields[item];
                        let table_name;
                        if(fieldProps.type === 'image'){
                            table_name = 'images';
                        }else{
                            table_name = 'avatars';
                        }
                        if(fieldProps.multiple){
                            if(imgFieldValue instanceof Array){
                                data[item] = imgFieldValue.map((value)=>{ return rootUrl + table_name +  '/' + value});
                            }
                        }else{
                            data[item] = rootUrl + table_name + '/' + imgFieldValue;
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
    let fileRootUrl = Meteor.absoluteUrl('/api/files/files/');
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
                                        url: fileRootUrl + value,
                                        state: "uploaded"
                                    }
                                });
                            }
                        }else{
                            data[item] = {
                                value: fileFieldValue,
                                name: fileFieldNames[0],
                                url: fileRootUrl + fileFieldValue,
                                state: "uploaded"
                            };
                        }
                    }
                })
    `
}

function getEditFormInitApi(object, recordId, fields){
    return {
        method: "post",
        url: graphql.getApi(),
        sendOn: "!!this.recordId",
        cache: APICACHE,
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
        data: graphql.getFindOneQuery(object, recordId, fields)
    }
}

function getSaveApi(object, recordId, fields, options){
    return {
        method: 'post',
        url: graphql.getApi(),
        data: graphql.getSaveQuery(object, recordId, fields, options),
        requestAdaptor: graphql.getSaveRequestAdaptor(fields),
        responseData: {
            "recordId": "${record._id}"
        },
        adaptor: `
            SteedosUI.getRef(api.body.modalName).close();
            SteedosUI.router.go({objectName: api.body.objectName, recordId: payload.data.record._id, type: api.body.recordId ? 'edit': 'new'});
            return payload;
        `
    }
}

function getInitApi(object, recordId, fields, readonly){
    if(readonly){
        return getReadonlyFormInitApi(object, recordId, fields);
    }else{
        return getEditFormInitApi(object, recordId, fields);
    }
}

function getFormActions(redirect){
    return [
        {
          "type": "button",
          "label": "取消",
          "actionType": "",
          "level": "default",
          "block": false,
          "onClick": "SteedosUI.getRef(props.data.__super.modalName).close();"
        },
        {
          "type": "button",
          "label": "保存",
          "actionType": "submit",
          "level": "info"
        }
      ]
}


function getFormBody(permissionFields, objectConfig){
    return Sections.getSections(permissionFields, objectConfig);
}


function convertSObjectToAmisSchema(objectConfig, recordId, readonly, userSession) {
    // const fieldControls = [];
    const permissionFields = Fields.getPermissionFields(objectConfig, userSession)
    // _.each(permissionFields, function(perField){
    //     let field = perField;
    //     if(perField.type === 'grid'){
    //         field = Fields.getGridFieldSubFields(perField, permissionFields);
    //     }else if(perField.type === 'object'){
    //         field = Fields.getObjectFieldSubFields(perField, permissionFields);
    //     }
    //     if(field.name.indexOf(".") < 0){
    //         fieldControls.push(Fields.convertSFieldToAmisField(field, readonly))
    //     }
    // })

    // _.each(Fields.getBaseFields(readonly), function(field){
    //     fieldControls.push(field);
    // })

    let gapClassName = 'row-gap-1';
    if(!readonly){
        gapClassName = 'row-gap-4'
    }

    const redirect = `/app/admin/${objectConfig.name}/view/${recordId}`

    return {
        type: 'page',
        bodyClassName: 'p-0',
        regions: [
            "body"
        ],
        name: `page_${readonly ? 'readonly':'edit'}_${recordId}`,
        initApi: readonly ? getInitApi(objectConfig, recordId, permissionFields, readonly) : null,
        initFetch: readonly ? true : null,
        body: [
            {
                type: "form",
                mode: "normal",
                // reload: `page_${readonly ? 'edit':'readonly'}_${recordId}`,
                // redirect: redirect,
                persistData: false,
                promptPageLeave: readonly ? false : true,
                name: `form_${readonly ? 'readonly':'edit'}_${recordId}`,
                debug: false,
                title: "",
                api: readonly ? null : getSaveApi(objectConfig, recordId, permissionFields, {}),
                initApi: readonly ? null : getInitApi(objectConfig, recordId, permissionFields, readonly),
                initFetch: readonly ? null : true,
                body: getFormBody(permissionFields, objectConfig),
                panelClassName:'m-0',
                bodyClassName: 'p-4',
                actions: readonly ? null : getFormActions(redirect),
                actionsClassName: readonly ? null : "p-sm b-t b-light text-center",
                // className: `grid grid-cols-2 ${gapClassName} col-gap-6`
                className: 'steedos-amis-form'
            }
        ]
    }
}

exports.convertSObjectToAmisSchema = convertSObjectToAmisSchema;