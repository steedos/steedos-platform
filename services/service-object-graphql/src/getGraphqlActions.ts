import _ = require("underscore");
import { translationObject } from '@steedos/i18n';
import moment = require('moment');
import { getSteedosSchema, SteedosObjectTypeConfig, getUserLocale, absoluteUrl } from "@steedos/objectql";
import { EXPAND_SUFFIX, DISPLAY_PREFIX, RELATED_PREFIX, GRAPHQL_ACTION_PREFIX, UI_PREFIX, PERMISSIONS_PREFIX, QUERY_DOCS_TOP } from "./consts";
import { getQueryFields } from "./getQueryFields";
import {
    callObjectServiceAction,
    _getRelatedType,
    formatBasicFieldValue,
    formatFileSize,
    numberToString,
    getFileStorageName
} from "./utils"

export function getGraphqlActions(
    // objectConfig: SteedosObjectTypeConfig
) {
    let actions = {};
    // let objName = objectConfig.name;

    actions[`${GRAPHQL_ACTION_PREFIX}${EXPAND_SUFFIX}_multiple`] = {
        handler: async function (ctx) {
            let { ids, objectName, referenceToField } = ctx.params;
            if (_.isEmpty(ids)) {
                return null;
            }
            let filters = [[referenceToField || "_id", "in", ids]];
            const selector: any = { filters: filters };
            let steedosSchema = getSteedosSchema();
            let obj = steedosSchema.getObject(objectName);

            const { resolveInfo } = ctx.meta;
            const fieldNames = getQueryFields(resolveInfo);
            if (!_.isEmpty(fieldNames)) {
                selector.fields = fieldNames;
            }

            return obj.find(selector);
        },
    };
    actions[`${GRAPHQL_ACTION_PREFIX}${EXPAND_SUFFIX}`] = {
        handler: async function (ctx) {
            let { id, objectName, referenceToField } = ctx.params;
            if (!id) {
                return;
            }
            let steedosSchema = getSteedosSchema();
            let obj = steedosSchema.getObject(objectName);

            const selector: any = { filters: [[referenceToField || "_id", "=", id]] };
            const { resolveInfo } = ctx.meta;
            const fieldNames = getQueryFields(resolveInfo);
            if (!_.isEmpty(fieldNames)) {
                selector.fields = fieldNames;
            }

            return (await obj.find(selector))[0];
        },
    };

    // if (
    //     [
    //         "cms_files",
    //         "tasks",
    //         "notes",
    //         "events",
    //         "audit_records",
    //         "instances",
    //         "approvals",
    //     ].includes(objName)
    // ) {
    actions[`${GRAPHQL_ACTION_PREFIX}${RELATED_PREFIX}_enabled`] = {
        handler: async function (ctx) {
            let params = ctx.params;
            let { _parentId, _related_params } = params;
            let { objectName, parentObjectName, foreignKey } = _related_params;
            let userSession = ctx.meta.user;
            let steedosSchema = getSteedosSchema();
            let object = steedosSchema.getObject(objectName);
            let filters = [];
            filters = [
                [`${foreignKey}.o`, "=", parentObjectName],
                [`${foreignKey}.ids`, "=", _parentId],
            ];
            if (params.filters) {
                filters.push(params.filters);
            }
            params.filters = filters;
            return await object.find(params, userSession);
        },
    };
    // }

    actions[`${GRAPHQL_ACTION_PREFIX}${RELATED_PREFIX}`] = {
        params: {
            fields: { type: 'array', items: "string", optional: true },
            filters: [{ type: 'array', optional: true }, { type: 'string', optional: true }],
            top: { type: 'number', optional: true, default: QUERY_DOCS_TOP },
            skip: { type: 'number', optional: true },
            sort: { type: 'string', optional: true },
            _parentId: { type: 'string', optional: false },
            _related_params: {
                type: 'object',
                props: {
                    objectName: { type: "string", optional: false },
                    parentObjectName: { type: "string", optional: false },
                    fieldName: { type: "string", optional: false },
                    referenceToParentFieldName: { type: "string", optional: true },
                }
            }
        },
        handler: async function (ctx) {
            let params = ctx.params;
            let { _parentId, _related_params } = params;
            let {
                objectName,
                parentObjectName,
                fieldName,
                referenceToParentFieldName,
            } = _related_params;
            let userSession = ctx.meta.user;
            let steedosSchema = getSteedosSchema();
            let object = steedosSchema.getObject(objectName);
            let parentObj = steedosSchema.getObject(parentObjectName);
            let parent = await parentObj.findOne(_parentId);
            let filters = [];
            let _idValue = parent._id;
            if (referenceToParentFieldName) {
                _idValue = parent[referenceToParentFieldName];
            }
            filters = [[fieldName, "=", _idValue]];
            if (params.filters) {
                filters.push(params.filters);
            }
            params.filters = filters;

            const { resolveInfo } = ctx.meta;
            const fieldNames = getQueryFields(resolveInfo);
            if (!_.isEmpty(fieldNames)) {
                params.fields = fieldNames;
            }
            delete params._related_params;
            delete params._parentId;
            if (_.has(params, "top")) { // 如果top小于1，不返回数据
                if (params.top < 1) {
                    return []
                }
                if (params.top > QUERY_DOCS_TOP) {
                    params.top = QUERY_DOCS_TOP; // 最多返回5000条数据
                }
            }
            return await object.find(params, userSession);
        },
    };

    actions[`${GRAPHQL_ACTION_PREFIX}${DISPLAY_PREFIX}`] = {
        handler: async function (ctx) {
            let params = ctx.params;
            let { __objectName } = params;
            let userSession = ctx.meta.user;
            let selectFieldNames = [];
            const { resolveInfo } = ctx.meta;
            const fieldNames = getQueryFields(resolveInfo);
            if (!_.isEmpty(fieldNames)) {
                selectFieldNames = fieldNames;
            }
            let result = await translateToDisplay(__objectName, params, userSession, selectFieldNames);
            return result;
        },
    };

    actions[`${GRAPHQL_ACTION_PREFIX}${UI_PREFIX}`] = {
        handler: async function (ctx) {
            let params = ctx.params;
            let { __objectName } = params;
            let userSession = ctx.meta.user;
            let selectFieldNames = [];
            const { resolveInfo } = ctx.meta;
            const fieldNames = getQueryFields(resolveInfo);
            if (!_.isEmpty(fieldNames)) {
                selectFieldNames = fieldNames;
            }
            let result = await translateToUI(__objectName, params, userSession, selectFieldNames);

            return result;
        },
    };

    actions[`${GRAPHQL_ACTION_PREFIX}${PERMISSIONS_PREFIX}`] = {
        handler: async function (ctx) {
            let params = ctx.params;
            let { __objectName } = params;
            let userSession = ctx.meta.user;
            return await callObjectServiceAction(`objectql.getRecordPermissionsById`, userSession, {
                objectName: __objectName,
                recordId: params._id
            });;
        },
    };

    return actions;
}

async function translateToDisplay(objectName, doc, userSession: any, selectorFieldNames) {
    const lng = getUserLocale(userSession);
    let steedosSchema = getSteedosSchema();
    let object = steedosSchema.getObject(objectName);
    let objConfig = await object.toConfig();
    let fields = objConfig.fields;
    // let _object = clone(objConfig);
    translationObject(lng, objConfig.name, objConfig, true);

    let utcOffset = userSession.utcOffset || 8;
    async function _translateToDisplay(doc, selectorFieldNames) {
        let displayObj = {};
        for (const name of selectorFieldNames) {
            if (Object.prototype.hasOwnProperty.call(fields, name)) {
                const field = fields[name];
                if (_.has(doc, name)) {
                    const fType = field.type;
                    if (fType == "text") {
                        displayObj[name] = doc[name] || "";
                    } else if (fType == "textarea") {
                        displayObj[name] = doc[name] || "";
                    } else if (fType == "html_text") {
                        displayObj[name] = doc[name] || "";
                    } else if (fType == "html") {
                        displayObj[name] = doc[name] || "";
                    } else if (fType == "select") {
                        let label = "";
                        let map = {};
                        let value = doc[name];
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
                    } else if (fType == "boolean") {
                        if (doc[name]) {
                            displayObj[name] = "√";
                        } else {
                            displayObj[name] = "";
                        }
                    } else if (fType == "date") {
                        // 注意日期类型存的是utc0点，不需要执行utcOffset
                        displayObj[name] = doc[name] ? moment.utc(doc[name])
                            .format("YYYY-MM-DD") : '';
                    } else if (fType == "datetime") {
                        displayObj[name] = doc[name] ? moment(doc[name])
                            .utcOffset(utcOffset)
                            .format("YYYY-MM-DD HH:mm") : '';
                    } else if (fType == "time") {
                        // 注意时间类型走的是utc时间，不需要执行utcOffset
                        displayObj[name] = doc[name] ? moment.utc(doc[name])
                            .format("HH:mm") : '';
                    } else if (fType == "number") {
                        displayObj[name] = doc[name] ? numberToString(doc[name], field.scale) : "";
                    } else if (fType == "currency") {
                        displayObj[name] = doc[name] ? numberToString(doc[name], field.scale) : "";
                    } else if (fType == "percent") {
                        displayObj[name] = doc[name] ? `${doc[name] * 100}%` : "";
                    } else if (fType == "password") {
                        displayObj[name] = "";
                        if (_.isString(doc[name])) {
                            for (let i = 0; i < doc[name].length; i++) {
                                displayObj[name] += "*";
                            }
                        }
                    } else if (fType == "lookup" && _.isString(field.reference_to)) {
                        let refTo = field.reference_to;

                        let refField = field.reference_to_field || '_id';

                        if (refTo === 'users') {
                            refTo = 'space_users';
                            refField = 'user'
                        }

                        let refValue = doc[name];
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
                            displayObj[name] = _.pluck(refRecords, nameFieldKey).join(',')
                        } else {
                            let refRecord = (
                                await refObj.find({
                                    filters: [refField, "=", refValue],
                                    fields: [nameFieldKey],
                                })
                            )[0];
                            if (refRecord) {
                                displayObj[name] = refRecord[nameFieldKey];
                            }
                        }
                    } else if (fType == "master_detail" && _.isString(field.reference_to)) {
                        let refTo = field.reference_to;
                        let refField = field.reference_to_field || '_id';

                        if (refTo === 'users') {
                            refTo = 'space_users';
                            refField = 'user'
                        }
                        let refValue = doc[name];
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
                            displayObj[name] = _.pluck(refRecords, nameFieldKey).join(',')
                        } else {
                            let refRecord = (
                                await refObj.find({
                                    filters: [refField, "=", refValue],
                                    fields: [nameFieldKey],
                                })
                            )[0];
                            if (refRecord) {
                                displayObj[name] = refRecord[nameFieldKey];
                            }
                        }
                    } else if ((fType == "master_detail" || fType == "lookup") && field.reference_to && !_.isString(field.reference_to)) {
                        let refValue = doc[name];
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

                        displayObj[name] = _.pluck(refRecords, nameFieldKey).join(',')
                    } else if (fType == "autonumber") {
                        displayObj[name] = doc[name] || "";
                    } else if (fType == "url") {
                        displayObj[name] = doc[name] || "";
                    } else if (fType == "email") {
                        displayObj[name] = doc[name] || "";
                    } else if (fType == "formula") {
                        displayObj[name] = doc[name] || "";
                    } else if (fType == "summary") {
                        displayObj[name] = doc[name] || "";
                    } else if (fType == "image" || fType == "file") {
                        let fileLabel = "";
                        let value = doc[name];
                        if (!value) {
                            continue;
                        }
                        // TODO: cfs_images_filerecord对象不存在，需要额外处理
                        let fileObjectName = fType == "image" ? "cfs_images_filerecord" : "cfs_files_filerecord";
                        let fileObject = steedosSchema.getObject(fileObjectName);
                        const fileNameFieldKey = "original.name";
                        if (field.multiple) {
                            let fileRecords = await fileObject.find({
                                filters: [`_id`, "in", value],
                                fields: [fileNameFieldKey],
                            });
                            fileLabel = _.map(fileRecords, (fileRecord) => {
                                return fileRecord.original?.name;
                            }).join(",");
                        } else {
                            let fileRecord = (
                                await fileObject.find({
                                    filters: [`_id`, "=", value],
                                    fields: [fileNameFieldKey],
                                })
                            )[0];
                            if (fileRecord) {
                                fileLabel = fileRecord["original"]["name"];
                            }
                        }
                        displayObj[name] = fileLabel;
                    }
                    else {
                        console.error(
                            `Graphql Display: need to handle new field type ${field.type} for ${objectName}.`
                        );
                        displayObj[name] = doc[name] || "";
                    }
                } else {
                    displayObj[name] = ""; // 如果值为空，均返回空字符串
                }
            }
        }
        return displayObj
    }
    let displayDoc = await _translateToDisplay(doc, selectorFieldNames)
    displayDoc['_id'] = doc._id;
    return displayDoc;
}

async function translateToUI(objectName, doc, userSession: any, selectorFieldNames) {
    const lng = getUserLocale(userSession);
    let steedosSchema = getSteedosSchema();
    let object = steedosSchema.getObject(objectName);
    let objConfig = await object.toConfig();
    let fields = objConfig.fields;
    // let _object = clone(objConfig);
    translationObject(lng, objConfig.name, objConfig, true);
    async function _translateToUI(doc, selectorFieldNames, parentDoc?) {
        let displayObj = {};
        for (const name of selectorFieldNames) {
            if (Object.prototype.hasOwnProperty.call(fields, name)) {
                const field = fields[name];
                try {
                    if (_.has(doc, name)) {
                        const fType = field.type;
                        if (fType == "select") {
                            let label = "";
                            let map = {};
                            let value = doc[name];
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
                        } else if (fType == "lookup" && (_.isString(field.reference_to) || !_.has(field, 'reference_to'))) {
                            if (_.isString(field.reference_to)) {
                                let refTo = field.reference_to;

                                let refField = field.reference_to_field || '_id';

                                if (refTo === 'users') {
                                    refTo = 'space_users';
                                    refField = 'user'
                                }

                                let refValue = doc[name];
                                if (!refValue) {
                                    continue;
                                }

                                let refFilters = null;

                                if (field.multiple) {
                                    refFilters = [refField, "in", refValue]
                                } else {
                                    refFilters = [refField, "=", refValue]
                                }

                                // 判断如果是 reference_to = object_fields &&  reference_to_field = name, 则额外添加查询条件 object 查询条件;
                                if (refTo === 'object_fields' && refField == 'name') {
                                    const refToObjectsField = _.find(fields, (_field) => {
                                        return _field.reference_to === 'objects'
                                    })
                                    if (refToObjectsField) {
                                        refFilters = [['object', '=', parentDoc[refToObjectsField.name]], refFilters]
                                    }
                                }

                                // 判断如果是 reference_to = object_actions &&  reference_to_field = name, 则额外添加查询条件 object 查询条件;
                                if (refTo === 'object_actions' && refField == 'name') {
                                    const refToObjectsField = _.find(fields, (_field) => {
                                        return _field.reference_to === 'objects'
                                    })
                                    if (refToObjectsField) {
                                        refFilters = [['object', '=', parentDoc[refToObjectsField.name]], refFilters]
                                    }
                                }

                                let refObj = steedosSchema.getObject(refTo);
                                let nameFieldKey = await refObj.getNameFieldKey();
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
                                let refValue = doc[name];
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
                            let refValue = doc[name];
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
                        } else if ((fType == "master_detail" || fType == "lookup") && field.reference_to && !_.isString(field.reference_to)) {
                            let refValue = doc[name];
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
                            displayObj[name] = formatBasicFieldValue(field.data_type, field, doc[name], objConfig, userSession);
                        } else if (fType == "summary") {
                            displayObj[name] = formatBasicFieldValue('number', field, doc[name], objConfig, userSession);
                        } else if (fType == "image" || fType == "file" || fType === 'avatar') {
                            let fileValue: any = null;
                            let value = doc[name];
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
                                        url: absoluteUrl(`/api/files/${storageName}/${fileRecord._id}`),
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
                                        url: absoluteUrl(`/api/files/${storageName}/${value}`),
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
                            displayObj[name] = formatFileSize(doc[name]);
                        }
                        else if (fType === 'object') {
                            if (doc[name] && _.isObject(doc[name])) {
                                const _doc = {}
                                _.each(doc[name], function (v, k) {
                                    const newKey = `${name}.${k}`
                                    _doc[newKey] = v
                                })
                                const objectFieldDoc = await _translateToUI(_doc, Object.keys(_doc), doc)
                                const objectDoc = {}
                                _.each(objectFieldDoc, function (v, k) {
                                    const newKey = k.replace(`${name}.`, '')
                                    objectDoc[newKey] = v
                                })
                                displayObj[name] = objectDoc
                            }
                        }
                        else if (fType === 'grid') {
                            if (doc[name] && _.isArray(doc[name])) {
                                const gridDocs = []
                                for (const gridDoc of doc[name]) {
                                    const _doc = {}
                                    _.each(gridDoc, function (v, k) {
                                        const newKey = `${name}.$.${k}`
                                        _doc[newKey] = v
                                    })
                                    const objectFieldDoc = await _translateToUI(_doc, Object.keys(_doc), doc)
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
                            displayObj[name] = formatBasicFieldValue(fType, field, doc[name], objConfig, userSession);
                        }
                    }
                    else {
                        displayObj[name] = ""; // 如果值为空，均返回空字符串
                    }
                } catch (error) {
                    displayObj[name] = doc[name];
                    // console.warn(error)
                }
            }
        }
        return displayObj
    }

    let uiDoc = await _translateToUI(doc, selectorFieldNames, doc)
    uiDoc['_id'] = doc._id;
    return uiDoc;
}

function getTranslatedFieldConfig(translatedObject: any, name: string) {
    return translatedObject.fields[name.replace(/__label$/, "")];
}