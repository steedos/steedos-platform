/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-06-15 15:49:44
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2023-01-16 17:39:58
 * @Description: 
 */

import _ = require("underscore");
import moment = require('moment');
import { getObjectServiceName } from "../..";
import { absoluteUrl, SteedosObjectTypeConfig } from "../../..";
// const clone = require("clone");
import { translationObject } from '@steedos/i18n';
const { moleculerGql: gql } = require("moleculer-apollo-server");
import { getSteedosSchema, getUserLocale } from '../../..';
import { getQueryFields } from "./getQueryFields";
import { getPrimaryFieldType } from "./getPrimaryFieldType";

import { BASIC_TYPE_MAPPING, EXPAND_SUFFIX, DISPLAY_PREFIX, RELATED_PREFIX, GRAPHQL_ACTION_PREFIX, UI_PREFIX, PERMISSIONS_PREFIX } from "./consts";

export function generateActionGraphqlProp(actionName: string, objectConfig: SteedosObjectTypeConfig) {
    let gplObj: any = {};
    let objectName = objectConfig.name;
    if (objectName == 'users') {
        return gplObj;
    }
    switch (actionName) {
        case 'graphqlCount':
            gplObj.query = gql`
                type Query {
                    ${objectName}__count(fields: JSON, filters: JSON, top: Int, skip: Int, sort: String): Int
                }
            `;
            break;
        case 'graphqlFind':
            gplObj.query = gql`
                type Query {
                    ${objectName}(fields: JSON, filters: JSON, top: Int, skip: Int, sort: String): [${objectName}]
                }
            `;
            break;
        case 'findOne':
            gplObj.query = gql`
                type Query {
                    ${objectName}__${actionName}(id: JSON): ${objectName}
                }
            `;
            break;
        case 'insert':
            gplObj.mutation = gql`
                type Mutation {
                    ${objectName}__${actionName}(doc: JSON): ${objectName}
                }
            `;
            break;
        case 'update':
            gplObj.mutation = gql`
                type Mutation {
                    ${objectName}__${actionName}(id: JSON, doc: JSON): ${objectName}
                }
            `;
            break;
        case 'delete':
            gplObj.mutation = gql`
                type Mutation {
                    ${objectName}__${actionName}(id: JSON): JSON
                }
            `;
            break;
        default:
            // console.error(`need to handle action: ${actionName}`);
            break;
    }
    // console.log(gplObj);
    return gplObj;
}

const callObjectServiceAction = async function(actionName, userSession, data?){
    const broker = getSteedosSchema().broker;
    return broker.call(actionName, data, { meta: { user: userSession}})
}

const formatFileSize = function(fileSize) {
    var rev, unit;
    rev = fileSize / 1024.00;
    unit = 'KB';
    if (rev > 1024.00) {
      rev = rev / 1024.00;
      unit = 'MB';
    }
    if (rev > 1024.00) {
      rev = rev / 1024.00;
      unit = 'GB';
    }
    return rev.toFixed(2) + unit;
  };

export function generateSettingsGraphql(objectConfig: SteedosObjectTypeConfig) {
    let objectName = objectConfig.name;
    let fields = objectConfig.fields;
    const primaryFieldType = getPrimaryFieldType(objectConfig);
    let type = `type ${objectName} { ${primaryFieldType} `;
    let resolvers = {};
    resolvers[objectName] = {};
    const fieldNamesMap = {}
    _.each(fields, (field, name) => {
        if (name.indexOf(".") > -1) {
            return;
        }
        fieldNamesMap[name] = name;
        if (!field.type) {
            // console.error(`The field ${name} of ${objectName} has no type property.`);
            type += `${name}: JSON `;
            return;
        }
        let isLookup = (field.type == "lookup" || field.type == "master_detail") &&
            field.reference_to && _.isString(field.reference_to);
        let isFile = field.type == "image" || field.type == "file";
        if (BASIC_TYPE_MAPPING[field.type]) {
            type += `${name}: ${BASIC_TYPE_MAPPING[field.type]} `;
        } else if (isLookup || isFile) {
            let refTo = field.reference_to as string;
            const referenceToField = field.reference_to_field
            if (isFile) {
                // TODO: cfs_images_filerecord对象不存在，需要额外处理
                refTo = field.type == "image" ? "cfs_images_filerecord" : "cfs_files_filerecord";
            }
            let objMetaData = getLocalService(refTo);
            if (refTo != objectName && (!objMetaData || objMetaData.settings.deleted)) {
                return;
            }
            if (field.multiple) {
                type += `${name}: [JSON] `;
                type += `${name}${EXPAND_SUFFIX}: [${refTo}] `;
                resolvers[objectName][`${name}${EXPAND_SUFFIX}`] = {
                    action: `${getObjectServiceName(
                        refTo
                    )}.${GRAPHQL_ACTION_PREFIX}${EXPAND_SUFFIX}_multiple`,
                    rootParams: {
                        [name]: "ids",
                    },
                    params: {
                        objectName: refTo,
                        referenceToField
                    },
                };
            } else {
                type += `${name}: JSON `;
                type += `${name}${EXPAND_SUFFIX}: ${refTo} `;
                resolvers[objectName][`${name}${EXPAND_SUFFIX}`] = {
                    action: `${getObjectServiceName(
                        refTo
                    )}.${GRAPHQL_ACTION_PREFIX}${EXPAND_SUFFIX}`,
                    rootParams: {
                        [name]: "id",
                    },
                    params: {
                        objectName: refTo,
                        referenceToField
                    },
                };
            }
        } else {
            type += `${name}: JSON `;
        }
    });

    // _display
    let _display_type_name = `${DISPLAY_PREFIX}_${objectName}`;
    type += `${DISPLAY_PREFIX}: ${_display_type_name} `;
    // resolvers[objectName][DISPLAY_PREFIX] = async function (parent, args, context, info) {
    //     let userSession = context.ctx.meta.user;
    //     return await translateToDisplay(objectName, fields, parent, userSession);
    // }
    resolvers[objectName][DISPLAY_PREFIX] = {
        action: `${getObjectServiceName(
            objectName
        )}.${GRAPHQL_ACTION_PREFIX}${DISPLAY_PREFIX}`,
        rootParams: {
            _id: "_id",
            ...fieldNamesMap // 对象的字段名，用于将值传递到display，而不需要再查一次
        },
        params: {
            '__objectName': objectName,
        },
    };
    // define _display type
    let _display_type = _getDisplayType(_display_type_name, fields);
    type = gql`
        ${_display_type}
        ${type}
    `;

    // _ui
    let _ui_type_name = `${UI_PREFIX}_${objectName}`;
    type += `${UI_PREFIX}: ${_ui_type_name} `;
    resolvers[objectName][UI_PREFIX] = {
        action: `${getObjectServiceName(
            objectName
        )}.${GRAPHQL_ACTION_PREFIX}${UI_PREFIX}`,
        rootParams: {
            _id: "_id",
            ...fieldNamesMap // 对象的字段名，用于将值传递到ui，而不需要再查一次
        },
        params: {
            '__objectName': objectName
        },
    };
    // define _ui_type
    let _ui_type = _getUIType(_ui_type_name, fields);
    type = gql`
        ${_ui_type}
        ${type}
    `;

    // _permissions
    let _permissions_type_name = `${PERMISSIONS_PREFIX}_${objectName}`;
    type += `${PERMISSIONS_PREFIX}: ${_permissions_type_name} `;
    resolvers[objectName][PERMISSIONS_PREFIX] = {
        action: `${getObjectServiceName(
            objectName
        )}.${GRAPHQL_ACTION_PREFIX}${PERMISSIONS_PREFIX}`,
        rootParams: {
            _id: "_id"
        },
        params: {
            '__objectName': objectName
        },
    };
    // define _permissions_type
    let _permissions_type = _getPermissionsType(_permissions_type_name, fields);
    type = gql`
        ${_permissions_type}
        ${type}
    `;

    // _related
    if (objectConfig.enable_files) {
        let relatedObjName = "cms_files";
        let relatedFieldName = `${RELATED_PREFIX}_files`;
        type += _getRelatedType(relatedFieldName, relatedObjName);
        resolvers[objectName][
            relatedFieldName
        ] = _getRelatedResolverForEnableProperty(
            objectName,
            relatedObjName,
            "parent"
        );
    }
    if (objectConfig.enable_tasks) {
        let relatedObjName = "tasks";
        let relatedFieldName = `${RELATED_PREFIX}_${relatedObjName}`;
        type += _getRelatedType(relatedFieldName, relatedObjName);
        resolvers[objectName][
            relatedFieldName
        ] = _getRelatedResolverForEnableProperty(
            objectName,
            relatedObjName,
            "related_to"
        );
    }
    if (objectConfig.enable_notes) {
        let relatedObjName = "notes";
        let relatedFieldName = `${RELATED_PREFIX}_${relatedObjName}`;
        type += _getRelatedType(relatedFieldName, relatedObjName);
        resolvers[objectName][
            relatedFieldName
        ] = _getRelatedResolverForEnableProperty(
            objectName,
            relatedObjName,
            "related_to"
        );
    }
    if (objectConfig.enable_events) {
        let relatedObjName = "events";
        let relatedFieldName = `${RELATED_PREFIX}_${relatedObjName}`;
        type += _getRelatedType(relatedFieldName, relatedObjName);
        resolvers[objectName][
            relatedFieldName
        ] = _getRelatedResolverForEnableProperty(
            objectName,
            relatedObjName,
            "related_to"
        );
    }
    if (objectConfig.enable_audit) {
        let relatedObjName = "audit_records";
        let relatedFieldName = `${RELATED_PREFIX}_${relatedObjName}`;
        type += _getRelatedType(relatedFieldName, relatedObjName);
        resolvers[objectName][
            relatedFieldName
        ] = _getRelatedResolverForEnableProperty(
            objectName,
            relatedObjName,
            "related_to"
        );
    }
    if (objectConfig.enable_instances) {
        let relatedObjName = "instances";
        let relatedFieldName = `${RELATED_PREFIX}_${relatedObjName}`;
        type += _getRelatedType(relatedFieldName, relatedObjName);
        resolvers[objectName][
            relatedFieldName
        ] = _getRelatedResolverForEnableProperty(
            objectName,
            relatedObjName,
            "record_ids"
        );
    }
    if (objectConfig.enable_approvals) {
        let relatedObjName = "approvals";
        let relatedFieldName = `${RELATED_PREFIX}_${relatedObjName}`;
        type += _getRelatedType(relatedFieldName, relatedObjName);
        resolvers[objectName][
            relatedFieldName
        ] = _getRelatedResolverForEnableProperty(
            objectName,
            relatedObjName,
            "related_to"
        );
    }

    type += "}";
    return {
        type: type,
        resolvers: resolvers,
    };
}

export async function dealWithRelatedFields(
    objectConfig: SteedosObjectTypeConfig,
    graphql
) {
    let steedosSchema = getSteedosSchema();
    let objectName = objectConfig.name;
    let obj = steedosSchema.getObject(objectName);

    const relationsInfo = await obj.getRelationsInfo();
    let detailsInfo = relationsInfo.details || [];
    let lookupsInfo = relationsInfo.lookup_details || [];

    let relatedInfos = detailsInfo.concat(lookupsInfo);
    for (const info of relatedInfos) {
        if (!info.startsWith("__")) {
            let infos = info.split(".");
            let detailObjectApiName = infos[0];
            let detailFieldName = infos[1];
            let relatedFieldName = correctName(
                `${RELATED_PREFIX}_${detailObjectApiName}_${detailFieldName}`
            );
            let relatedType = _getRelatedType(relatedFieldName, detailObjectApiName);
            if (graphql.type.indexOf(relatedType) > -1) {
                // 防止重复定义field
                continue;
            }
            graphql.type =
                graphql.type.substring(0, graphql.type.length - 1) + relatedType + "}";
            graphql.resolvers[objectName][relatedFieldName] = getRelatedResolver(
                objectName,
                detailObjectApiName,
                detailFieldName,
                ""
            );
        }
    }
}

export function correctName(name: string) {
    return name.replace(/\./g, "_").replace(/\$/g, "_");
}

export function _getRelatedType(relatedFieldName, relatedObjName) {
    return `${relatedFieldName}(fields: [String], filters: JSON, top: Int, skip: Int, sort: String): [${relatedObjName}] `;
}

export function getGraphqlActions(objectConfig: SteedosObjectTypeConfig) {
    let actions = {};
    let objName = objectConfig.name;

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

    if (
        [
            "cms_files",
            "tasks",
            "notes",
            "events",
            "audit_records",
            "instances",
            "approvals",
        ].includes(objName)
    ) {
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
    }

    actions[`${GRAPHQL_ACTION_PREFIX}${RELATED_PREFIX}`] = {
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
            return await callObjectServiceAction(`@${__objectName}.getRecordPermissionsById`, userSession, {
                recordId: params._id
            });;
        },
    };

    return actions;
}

function _getRelatedResolverForEnableProperty(
    parentObjectName,
    relatedObjName,
    foreignKey
) {
    return {
        action: `${getObjectServiceName(
            relatedObjName
        )}.${GRAPHQL_ACTION_PREFIX}${RELATED_PREFIX}_enabled`,
        rootParams: {
            _id: "_parentId",
        },
        params: {
            _related_params: {
                objectName: relatedObjName,
                parentObjectName: parentObjectName,
                foreignKey: foreignKey,
            },
        },
    };
}

export function getRelatedResolver(
    objectApiName,
    detailObjectApiName,
    detailFieldName,
    detailFieldReferenceToFieldName
) {
    return {
        action: `${getObjectServiceName(
            detailObjectApiName
        )}.${GRAPHQL_ACTION_PREFIX}${RELATED_PREFIX}`,
        rootParams: {
            _id: "_parentId",
        },
        params: {
            _related_params: {
                objectName: detailObjectApiName,
                parentObjectName: objectApiName,
                fieldName: detailFieldName,
                referenceToParentFieldName: detailFieldReferenceToFieldName,
            },
        },
    };
}

function getTranslatedFieldConfig(translatedObject: any, name: string) {
    return translatedObject.fields[name.replace(/__label$/, "")];
}

const numberToString = (number: number | string, scale: number, notThousands: boolean = false) => {
    if (typeof number === "number") {
        number = number.toString();
    }
    if (!number) {
        return '';
    }
    if (number !== "NaN") {
        if (scale || scale === 0) {
            number = Number(number).toFixed(scale);
        }
        if (!notThousands) {
            if (!(scale || scale === 0)) {
                // 没定义scale时，根据小数点位置算出scale值
                let regDots = number.match(/\.(\d+)/);
                scale = regDots && regDots[1] && regDots[1].length
                if (!scale) {
                    scale = 0;
                }
            }
            let reg = /(\d)(?=(\d{3})+\.)/g;
            if (scale === 0) {
                reg = /(\d)(?=(\d{3})+\b)/g;
            }
            number = number.replace(reg, '$1,');
        }
        return number;
    } else {
        return "";
    }
}

async function translateToDisplay(objectName, doc, userSession: any, selectorFieldNames) {
    const lng = getUserLocale(userSession);
    let steedosSchema = getSteedosSchema();
    let object = steedosSchema.getObject(objectName);
    let objConfig = await object.toConfig();
    let fields = objConfig.fields;
    // let _object = clone(objConfig);
    translationObject(lng, objConfig.name, objConfig, true);
    let displayObj = { _id: doc._id };
    let utcOffset = userSession.utcOffset || 8;
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
                    displayObj[name] = `${doc[name] * 100}%`;
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
                } else {
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
    return displayObj;
}

function _getDisplayType(typeName, fields) {
    let type = `type ${typeName} { _id: String `;
    if (_.has(fields, "_id")) {
        type = `type ${typeName} { `;
    }
    _.each(fields, (field, name) => {
        if (name.indexOf(".") > -1) {
            return;
        }
        type += `${name}: JSON `;
    });
    type += "}";
    return type;
}

const getFileStorageName = (type) => {
    switch (type) {
        case 'avatar':
            return 'avatars'
        case 'image':
            return 'images'
        case 'file':
            return 'files'
        default:
            break;
    }
};

async function translateToUI(objectName, doc, userSession: any, selectorFieldNames) {
    const lng = getUserLocale(userSession);
    let steedosSchema = getSteedosSchema();
    let object = steedosSchema.getObject(objectName);
    let objConfig = await object.toConfig();
    let fields = objConfig.fields;
    // let _object = clone(objConfig);
    translationObject(lng, objConfig.name, objConfig, true);
    let displayObj = { _id: doc._id };
    for (const name of selectorFieldNames) {
        if (Object.prototype.hasOwnProperty.call(fields, name)) {
            const field = fields[name];
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
                        }
                    }
                    displayObj[name] = fileValue;
                }else if(fType == "filesize"){
                    displayObj[name] = formatFileSize(doc[name]); 
                } else {
                    displayObj[name] = formatBasicFieldValue(fType, field, doc[name], objConfig, userSession);
                }
            } else {
                displayObj[name] = ""; // 如果值为空，均返回空字符串
            }
        }
    }
    return displayObj;
}

function formatBasicFieldValue(valueType, field, value, objectConfig, userSession) {
    switch (valueType) {
        case 'text':
        case 'textarea':
        case 'html_text':
        case 'autonumber':
        case 'url':
        case 'email':
        case 'html':
            return value || "";
        case 'boolean':
            return value ? "√" : ""
        case 'date':
            return value ? moment.utc(value).format("YYYY-MM-DD") : '';
        case 'datetime':
            return value ? moment(value).utcOffset(userSession.utcOffset || 8).format("YYYY-MM-DD HH:mm") : '';
        case 'time':
            return value ? moment.utc(value).format("HH:mm") : '';
        case 'number':
        case 'currency':
            return value ? numberToString(value, field.scale) : "";
        case 'percent':
            return `${value * 100}%`
        case 'password':
            return _.isString(value) ? "******" : ""
        default:
            console.error(
                `Graphql Display: need to handle new field type ${field.type} for ${objectConfig.name}.`
            );
            return value || "";
    }
}



function _getUIType(typeName, fields) {
    let type = `type ${typeName} { _id: String `;
    if (_.has(fields, "_id")) {
        type = `type ${typeName} { `;
    }
    _.each(fields, (field, name) => {
        if (name.indexOf(".") > -1) {
            return;
        }
        type += `${name}: JSON `;
    });
    type += "}";
    return type;
}

function _getPermissionsType(typeName, fields) {
    return `
        type ${typeName} {
            allowCreate: Boolean
            allowCreateFiles: Boolean
            allowDelete: Boolean
            allowDeleteFiles: Boolean
            allowEdit: Boolean
            allowEditFiles: Boolean
            allowRead: Boolean
            allowReadFiles: Boolean
            disabled_actions: [String]
            disabled_list_views: [String]
            field_permissions: JSON
            modifyAllFiles: Boolean
            modifyAllRecords: Boolean
            modifyAssignCompanysRecords: [String]
            modifyCompanyRecords: Boolean
            uneditable_fields: [String]
            unreadable_fields: [String]
            unrelated_objects: [String]
            viewAllFiles: Boolean
            viewAllRecords: Boolean
            viewAssignCompanysRecords: [String]
            viewCompanyRecords: Boolean
        }
    `
}

// 获取object元数据
export function getLocalService(objectApiName: string) {
    let steedosSchema = getSteedosSchema();
    return steedosSchema.broker.getLocalService(getObjectServiceName(objectApiName));
}

export * from './getQueryFields';
export * from './consts';