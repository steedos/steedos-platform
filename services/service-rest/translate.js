/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-02-26 13:29:53
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-03-12 11:19:54
 * @Description: 
 */
const _ = require('lodash')

const { getSteedosSchema, getUserLocale, absoluteUrl } = require("@steedos/objectql");
const { translationObject } = require("@steedos/i18n")

const EXPAND_SUFFIX = '__expand';
const UI_PREFIX = '_ui';

function getTranslatedFieldConfig(translatedObject, name) {
    return translatedObject.fields[name.replace(/__label$/, "")];
}

async function translateRecordToUI(record, objectName, selectorFieldNames, userSession){

    const lng = getUserLocale(userSession);
    let steedosSchema = getSteedosSchema();
    let object = steedosSchema.getObject(objectName);
    let objConfig = await object.toConfig();
    let fields = objConfig.fields;
    // let _object = clone(objConfig);
    translationObject(lng, objConfig.name, objConfig, true);
    
    async function _translateToUI(record, selectorFieldNames, parentRecord) {
        let displayObj = {};
        for (const name of selectorFieldNames) {
            if (Object.prototype.hasOwnProperty.call(fields, name)) {
                const field = fields[name];
                try {
                    if (_.has(record, name)) {
                        const fType = field.type;
                        const dataType = field.data_type;
                        if (fType == "select") {
                            let label = "";
                            let map = {};
                            let value = record[name];
                            let translatedField = getTranslatedFieldConfig(objConfig, name);
                            let translatedFieldOptions =
                                translatedField && translatedField.options;
                            _.forEach(translatedFieldOptions, function (o) {
                                map[o.value] = o.label;
                            });
                            if (field.multiple) {
                                let labels = [];
                                _.forEach(value, function (v) {
                                    labels.push(map[v]);
                                });
                                label = labels.join(",");
                            } else {
                                label = map[value];
                            }
                            displayObj[name] = label;
                        } else if (fType == "lookup" && (_.isString(field.reference_to) || (!_.has(field, 'reference_to') && !_.has(field, '_reference_to')))) {
                            if (_.isString(field.reference_to)) {
                                let refTo = field.reference_to;

                                let refField = field.reference_to_field || '_id';

                                if (refTo === 'users') {
                                    refTo = 'space_users';
                                    refField = 'user'
                                }

                                let refValue = record[name];
                                if (!refValue) {
                                    continue;
                                }
                                let refObj = steedosSchema.getObject(refTo);
                                let nameFieldKey = await refObj.getNameFieldKey();
                                let refFilters = null;

                                if (field.multiple) {
                                    refFilters = [refField, "in", refValue]
                                } else {
                                    refFilters = [refField, "=", refValue]
                                }

                                // 判断如果是 reference_to = object_fields &&  reference_to_field = name, 则额外添加查询条件 object 查询条件;
                                if (refTo === 'object_fields' && refField == 'name') {
                                    if(objConfig.name === 'objects'){
                                        refFilters = [['object', '=', parentRecord['name']], refFilters]
                                    }else{
                                        const refToObjectsField = _.find(fields, (_field) => {
                                            return _field.reference_to === 'objects'
                                        })
                                        if (refToObjectsField) {
                                            refFilters = [['object', '=', parentRecord[refToObjectsField.name]], refFilters]
                                        }
                                    }
                                    
                                }

                                // 判断如果是 reference_to = object_actions &&  reference_to_field = name, 则额外添加查询条件 object 查询条件;
                                if (refTo === 'object_actions' && refField == 'name') {
                                    const refToObjectsField = _.find(fields, (_field) => {
                                        return _field.reference_to === 'objects'
                                    })
                                    if (refToObjectsField) {
                                        refFilters = [['object', '=', parentRecord[refToObjectsField.name]], refFilters]
                                    }
                                }

                                if (field.multiple) {
                                    let refRecords = await refObj.find({
                                        filters: refFilters,
                                        fields: [nameFieldKey],
                                    });
                                    displayObj[name] = _.map(refRecords, (item) => {
                                        return {
                                            objectName: refTo,
                                            value: item ? item._id : refValue,
                                            label: item ? item[nameFieldKey] : refValue
                                        }
                                    })
                                } else {
                                    let refRecord = (
                                        await refObj.find({
                                            filters: refFilters,
                                            fields: [nameFieldKey],
                                        })
                                    )[0];
                                    if (refRecord) {
                                        displayObj[name] = {
                                            objectName: refTo,
                                            value: refRecord._id,
                                            label: refRecord[nameFieldKey]
                                        };
                                    } else {
                                        displayObj[name] = {
                                            objectName: refTo,
                                            value: refValue,
                                            label: refValue
                                        };
                                    }
                                }
                            } else {
                                let refValue = record[name];
                                if (!refValue) {
                                    continue;
                                }
                                if (field.multiple && _.isArray(refValue)) {
                                    _.each(refValue, (item) => {
                                        displayObj[name] = {
                                            value: item,
                                            label: item
                                        };
                                    })
                                } else {
                                    displayObj[name] = {
                                        value: refValue,
                                        label: refValue
                                    };
                                }
                            }

                        } else if (fType == "master_detail" && _.isString(field.reference_to)) {
                            let refTo = field.reference_to;
                            let refField = field.reference_to_field || '_id';

                            if (refTo === 'users') {
                                refTo = 'space_users';
                                refField = 'user'
                            }
                            let refValue = record[name];
                            if (!refValue) {
                                continue;
                            }
                            let refObj = steedosSchema.getObject(refTo);
                            let nameFieldKey = await refObj.getNameFieldKey();

                            if (field.multiple) {
                                let refRecords = await refObj.find({
                                    filters: [refField, "in", refValue],
                                    fields: [nameFieldKey],
                                });
                                displayObj[name] = _.map(refRecords, (item) => {
                                    return {
                                        objectName: refTo,
                                        value: item._id,
                                        label: item[nameFieldKey]
                                    }
                                })
                            } else {
                                let refRecord = (
                                    await refObj.find({
                                        filters: [refField, "=", refValue],
                                        fields: [nameFieldKey],
                                    })
                                )[0];
                                if (refRecord) {
                                    displayObj[name] = {
                                        objectName: refTo,
                                        value: refRecord._id,
                                        label: refRecord[nameFieldKey]
                                    };
                                }
                            }
                        } else if ((fType == "master_detail" || fType == "lookup") && ((field.reference_to && !_.isString(field.reference_to)) || _.isString(field._reference_to))) {
                            let refValue = record[name];
                            if (!refValue) {
                                continue;
                            }
                            let refTo = refValue.o;
                            let refValues = refValue.ids;
                            if (!refTo) {
                                continue;
                            }
                            let refObj = steedosSchema.getObject(refTo);
                            let nameFieldKey = await refObj.getNameFieldKey();
                            let refRecords = await refObj.find({
                                filters: [`_id`, "in", refValues],
                                fields: [nameFieldKey]
                            });

                            displayObj[name] = _.map(refRecords, (item) => {
                                return {
                                    objectName: refTo,
                                    value: item._id,
                                    label: item[nameFieldKey]
                                }
                            })
                        } else if (fType == "formula") {
                            displayObj[name] = formatBasicFieldValue(field.data_type, field, record[name], objConfig, userSession);
                        } else if (fType == "summary") {
                            displayObj[name] = formatBasicFieldValue(dataType, field, record[name], objConfig, userSession);
                        } else if (fType == "image" || fType == "file" || fType === 'avatar') {
                            const optionsStr = fType == "file" ? '?download=1' : ''
                            let fileValue = null;
                            let value = record[name];
                            if (!value) {
                                continue;
                            }
                            // TODO: cfs_images_filerecord对象不存在，需要额外处理
                            let storageName = getFileStorageName(fType)
                            let fileObjectName = `cfs_${storageName}_filerecord`;
                            let fileObject = steedosSchema.getObject(fileObjectName);
                            const fileNameFieldKey = "original.name";
                            if (field.multiple) {
                                let fileRecords = await fileObject.find({
                                    filters: [`_id`, "in", value],
                                    fields: ['_id', fileNameFieldKey, 'original.size', 'original.type'],
                                });
                                fileValue = _.map(fileRecords, (fileRecord) => {
                                    return {
                                        name: fileRecord.original?.name,
                                        url: absoluteUrl(`/api/files/${storageName}/${fileRecord._id}${optionsStr}`),
                                        size: fileRecord.original?.size,
                                        type: fileRecord.original?.type,
                                    };
                                });
                            } else {
                                let fileRecord = (
                                    await fileObject.find({
                                        filters: [`_id`, "=", value],
                                        fields: ['_id', fileNameFieldKey, 'original.size', 'original.type'],
                                    })
                                )[0];
                                if (fileRecord) {
                                    fileValue = {
                                        name: fileRecord["original"]["name"],
                                        url: absoluteUrl(`/api/files/${storageName}/${value}${optionsStr}`),
                                        size: fileRecord.original?.size,
                                        type: fileRecord.original?.type
                                    };
                                } else {
                                    fileValue = {
                                        url: value
                                    };
                                }
                            }
                            displayObj[name] = fileValue;
                        } else if (fType == "filesize") {
                            displayObj[name] = formatFileSize(record[name]);
                        }
                        else if (fType === 'object') {
                            if (record[name] && _.isObject(record[name])) {
                                const _doc = {}
                                _.each(record[name], function (v, k) {
                                    const newKey = `${name}.${k}`
                                    _doc[newKey] = v
                                })
                                const objectFieldDoc = await _translateToUI(_doc, Object.keys(_doc), record)
                                const objectDoc = {}
                                _.each(objectFieldDoc, function (v, k) {
                                    const newKey = k.replace(`${name}.`, '')
                                    objectDoc[newKey] = v
                                })
                                displayObj[name] = objectDoc
                            }
                        }
                        else if (fType === 'grid' || 'table' === fType) {
                            if (record[name] && _.isArray(record[name])) {
                                const gridDocs = []
                                for (const gridDoc of record[name]) {
                                    const _doc = {}
                                    _.each(gridDoc, function (v, k) {
                                        const newKey = `${name}.$.${k}`
                                        _doc[newKey] = v
                                    })
                                    const objectFieldDoc = await _translateToUI(_doc, Object.keys(_doc), record)
                                    const objectDoc = {}
                                    _.each(objectFieldDoc, function (v, k) {
                                        const newKey = k.replace(`${name}.$.`, '')
                                        objectDoc[newKey] = v
                                    })
                                    gridDocs.push(objectDoc)
                                }

                                displayObj[name] = gridDocs
                            }
                        }
                        else {
                            displayObj[name] = formatBasicFieldValue(fType, field, record[name], objConfig, userSession);
                        }
                    }
                    else {
                        displayObj[name] = ""; // 如果值为空，均返回空字符串
                    }
                } catch (error) {
                    displayObj[name] = record[name];
                    // console.warn(error)
                }
            }
        }
        return displayObj
    }

    let uiDoc = await _translateToUI(record, selectorFieldNames, record)
    return uiDoc;
}

async function translateRecordToExpand(record, objectName, expandFields, userSession) {
    let steedosSchema = getSteedosSchema();
    let object = steedosSchema.getObject(objectName);
    let objConfig = await object.toConfig();
    let fields = objConfig.fields;

    async function _translateToExpand(record, expandFields, parentRecord) {
        let expandObj = {};
        for (const fieldName in expandFields) {
            const expandField = expandFields[fieldName];
            let expandFieldFields = expandField.fields || [];
            const expandFieldUiFields = expandField.uiFields;
            const expandFieldExpandFields = expandField.expandFields;
            if(expandFieldExpandFields){
                // 跟GraphQL第一层一样，从库里查的字段要补上expandFields中的字段，即uiFields中依赖的字段可以在fields中定义，也可以在expandFields中字义
                expandFieldFields = _.union(expandFieldFields, _.keys(expandFieldExpandFields));
            }
            if(expandFieldFields.length === 0){
                continue;
            }

            if (Object.prototype.hasOwnProperty.call(fields, fieldName) && expandFieldFields.length > 0) {
                const field = fields[fieldName];
                try {
                    if (field && _.has(record, fieldName)) {
                        let isLookup = (field.type == "lookup" || field.type == "master_detail") &&
                            field.reference_to && _.isString(field.reference_to);
                        let isFile = field.type == "image" || field.type == "file";
                        if (isLookup || isFile){
                            let refTo = field.reference_to;
                            let refField = field.reference_to_field || '_id';
                            if (isFile) {
                                // TODO: cfs_images_filerecord对象不存在，需要额外处理
                                refTo = field.type == "image" ? "cfs_images_filerecord" : "cfs_files_filerecord";
                            }

                            let refValue = record[fieldName];
                            if (!refValue) {
                                // 如果值为空，跟GraphQL一样，返回null值
                                expandObj[fieldName + EXPAND_SUFFIX] = null;
                                continue;
                            }
                            let refObj = steedosSchema.getObject(refTo);
                            let refFilters = null;

                            if (field.multiple) {
                                refFilters = [refField, "in", refValue]
                            } else {
                                refFilters = [refField, "=", refValue]
                            }

                            let refRecords = await refObj.find({
                                filters: refFilters,
                                fields: expandFieldFields,
                            });
                            let translatedRecords = await translateRecords(refRecords, refTo, expandFieldFields, expandFieldUiFields, expandFieldExpandFields, userSession);
                            if(field.multiple){
                                expandObj[fieldName + EXPAND_SUFFIX] = translatedRecords;
                            }
                            else{
                                expandObj[fieldName + EXPAND_SUFFIX] = translatedRecords[0];
                            }
                        }
                    }
                    else {
                        // 如果值为空，跟GraphQL一样，返回null值
                        expandObj[fieldName + EXPAND_SUFFIX] = null;
                    }
                } catch (error) {
                    // 如果报错，跟GraphQL一样，返回null值
                    expandObj[fieldName + EXPAND_SUFFIX] = null;
                }

            }
        };
        return expandObj
    }

    let expandProps = await _translateToExpand(record, expandFields, record)
    return expandProps;
}

async function translateRecords(records, objectName, fields, uiFields, expandFields, userSession) {
    var hasUiFields = !_.isEmpty(uiFields);
    var hasExpandFields = !_.isEmpty(expandFields);
    var emptyRecord = {};
    _.each(fields || [],(field) => {
        // GraphQL那边空值规则是返回null，openApi跟它一样
        emptyRecord[field] = null;
    });
    if (hasUiFields || hasExpandFields) {
        const resRecords = [];
        for (let record of records) {
            record = Object.assign({}, emptyRecord, record); 
            if(hasUiFields){
                record[UI_PREFIX] = await translateRecordToUI(record, objectName, uiFields, userSession);
            }
            if(hasExpandFields){
                let expandProps = await translateRecordToExpand(record, objectName, expandFields, userSession);
                Object.assign(record, expandProps);
            }
            resRecords.push(record);
        }
        return resRecords;
    } else {
        return records;
    }
}

module.exports = {
    translateRecords
}