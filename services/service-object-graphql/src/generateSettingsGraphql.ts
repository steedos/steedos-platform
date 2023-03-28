/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2023-02-06 17:00:46
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2023-03-28 15:53:33
 * @Description: 
 */

const { moleculerGql: gql } = require("moleculer-apollo-server");
import { SteedosObjectTypeConfig, getObject } from "@steedos/objectql";
import {
    BASIC_TYPE_MAPPING,
    EXPAND_SUFFIX,
    DISPLAY_PREFIX,
    RELATED_PREFIX,
    GRAPHQL_ACTION_PREFIX,
    UI_PREFIX,
    PERMISSIONS_PREFIX,
} from "./consts";
import { getPrimaryFieldType } from "./getPrimaryFieldType";
import _ = require("underscore");
import {
    getLocalService,
    _getRelatedType,
    correctName,
} from './utils'
// import { getGraphqlServiceName } from "./utils";

export async function generateSettingsGraphql(objectConfig: SteedosObjectTypeConfig, graphqlServiceName: string) {
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

        type += _getFieldType(field, objectName)

    });
    function _getFieldType(field, typeName) {
        let type = ''
        const name = field.name
        if (!field.type) {
            // console.error(`The field ${name} of ${objectName} has no type property.`);
            type += `${name}: JSON `;
            return type
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
            try {
                let obj = getObject(refTo);
                if (refTo != objectName && (!obj)) {
                    type += `${name}: ${field.multiple ? "[JSON]" : "JSON"} `; // 未找到关联对象时仍返回字段值
                    return type;
                }
            } catch (error) {
                // console.error(error.message);
                type += `${name}: ${field.multiple ? "[JSON]" : "JSON"} `; // 未找到关联对象时仍返回字段值
                return type;
            }
            if (field.multiple) {
                type += `${name}: [JSON] `;
                type += `${name}${EXPAND_SUFFIX}: [${refTo}] `;
                resolvers[typeName][`${name}${EXPAND_SUFFIX}`] = {
                    action: `${graphqlServiceName}.${GRAPHQL_ACTION_PREFIX}${EXPAND_SUFFIX}_multiple`,
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
                resolvers[typeName][`${name}${EXPAND_SUFFIX}`] = {
                    action: `${graphqlServiceName}.${GRAPHQL_ACTION_PREFIX}${EXPAND_SUFFIX}`,
                    rootParams: {
                        [name]: "id",
                    },
                    params: {
                        objectName: refTo,
                        referenceToField
                    },
                };
            }
        }
        else {
            type += `${name}: JSON `;
        }
        return type
    }

    // _related
    let obj = getObject(objectName);
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
            if (type.indexOf(relatedType) > -1) {
                // 防止重复定义field
                continue;
            }
            type += relatedType

            resolvers[objectName][relatedFieldName] = _getRelatedResolver(
                objectName,
                detailObjectApiName,
                detailFieldName,
                "",
                graphqlServiceName
            );
        }
    }


    // _display
    let _display_type_name = `${DISPLAY_PREFIX}_${objectName}`;
    type += `${DISPLAY_PREFIX}: ${_display_type_name} `;

    resolvers[objectName][DISPLAY_PREFIX] = {
        action: `${graphqlServiceName}.${GRAPHQL_ACTION_PREFIX}${DISPLAY_PREFIX}`,
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
        action: `${graphqlServiceName}.${GRAPHQL_ACTION_PREFIX}${UI_PREFIX}`,
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
        action: `${graphqlServiceName}.${GRAPHQL_ACTION_PREFIX}${PERMISSIONS_PREFIX}`,
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
            "parent",
            graphqlServiceName
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
            "related_to",
            graphqlServiceName
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
            "related_to",
            graphqlServiceName
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
            "related_to",
            graphqlServiceName
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
            "related_to",
            graphqlServiceName
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
            "record_ids",
            graphqlServiceName
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
            "related_to",
            graphqlServiceName
        );
    }

    type += "}";
    return {
        type: type,
        resolvers: resolvers,
    };
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

function _getRelatedResolverForEnableProperty(
    parentObjectName,
    relatedObjName,
    foreignKey,
    graphqlServiceName
) {
    return {
        action: `${graphqlServiceName}.${GRAPHQL_ACTION_PREFIX}${RELATED_PREFIX}_enabled`,
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

function _getRelatedResolver(
    objectApiName,
    detailObjectApiName,
    detailFieldName,
    detailFieldReferenceToFieldName,
    graphqlServiceName
) {
    return {
        action: `${graphqlServiceName}.${GRAPHQL_ACTION_PREFIX}${RELATED_PREFIX}`,
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