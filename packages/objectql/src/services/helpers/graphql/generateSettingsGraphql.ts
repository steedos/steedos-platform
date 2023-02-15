/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2023-02-06 17:00:46
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2023-02-13 10:52:16
 * @Description: 
 */

const { moleculerGql: gql } = require("moleculer-apollo-server");
import { SteedosObjectTypeConfig } from "../../..";
import {
    BASIC_TYPE_MAPPING,
    EXPAND_SUFFIX,
    DISPLAY_PREFIX,
    RELATED_PREFIX,
    GRAPHQL_ACTION_PREFIX,
    UI_PREFIX,
    PERMISSIONS_PREFIX,
    // OBJECT_FIELD_TYPE,
    // GRID_FIELD_TYPE
} from "./consts";
import { getPrimaryFieldType } from "./getPrimaryFieldType";
import _ = require("underscore");
import {
    getLocalService,
    _getRelatedType,
    // correctName,
} from './utils'
import { getObjectServiceName } from "../..";

export function generateSettingsGraphql(objectConfig: SteedosObjectTypeConfig) {
    let objectName = objectConfig.name;
    let fields = objectConfig.fields;
    const primaryFieldType = getPrimaryFieldType(objectConfig);
    let type = `type ${objectName} { ${primaryFieldType} `;
    let resolvers = {};
    resolvers[objectName] = {};
    const fieldNamesMap = {}
    // const objectFieldNames = []
    // const gridFieldNames = []
    // const subFields = {}

    _.each(fields, (field, name) => {
        // if (field.type == 'object' && field.omit != true && field.hidden != true && field.blackbox != true && !name.endsWith('.$')) {
        //     objectFieldNames.push(name)
        // }
        // else if (field.type == 'grid' && field.omit != true && field.hidden != true && field.blackbox != true) {
        //     gridFieldNames.push(name)
        // }

        if (name.indexOf(".") > -1) {
            // subFields[name] = field
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
            let objMetaData = getLocalService(refTo);
            if (refTo != objectName && (!objMetaData || objMetaData.settings.deleted)) {
                type += `${name}: ${field.multiple ? "[JSON]" : "JSON"} `; // 未找到关联对象时仍返回字段值
                return type;
            }
            if (field.multiple) {
                type += `${name}: [JSON] `;
                type += `${name}${EXPAND_SUFFIX}: [${refTo}] `;
                resolvers[typeName][`${name}${EXPAND_SUFFIX}`] = {
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
                resolvers[typeName][`${name}${EXPAND_SUFFIX}`] = {
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
        }
        // else if (field.type == 'object' && field.omit != true && field.hidden != true && field.blackbox != true) {
        //     type += `${name}: ${objectName}${OBJECT_FIELD_TYPE}_${correctName(field._originFieldName || name)} `;
        // }
        // else if (field.type == 'grid' && field.omit != true && field.hidden != true && field.blackbox != true) {
        //     type += `${name}: [${objectName}${GRID_FIELD_TYPE}_${correctName(field._originFieldName || name)}] `;
        // }
        else {
            type += `${name}: JSON `;
        }
        return type
    }
    // 定义object字段类型的type
    // for (const objFieldName of objectFieldNames) {
    //     const objTypeName = `${objectName}${OBJECT_FIELD_TYPE}_${correctName(objFieldName)}`
    //     resolvers[objTypeName] = {};
    //     let objType = `type ${objTypeName} { `
    //     _.each(subFields, function (field: Object, name) {
    //         if (new RegExp(`^${objFieldName}\.[_0-9A-Za-z]+$`).test(name)) {
    //             const newFieldName = name.replace(objFieldName + '.', "") // 如： current.modified => modified
    //             const newField = {
    //                 ...field,
    //                 name: newFieldName,
    //                 _originFieldName: name
    //             }
    //             objType += _getFieldType(newField, objTypeName)
    //         }
    //     })
    //     objType += "}";
    //     if (objType.length <= `type ${objTypeName} { }`.length) {
    //         // console.log('objType:', objType)
    //         continue
    //     }
    //     type = gql`
    //         ${objType}
    //         ${type}
    //     `;
    // }
    // 定义grid字段类型的type
    // for (const gridFieldName of gridFieldNames) {
    //     const gridTypeName = `${objectName}${GRID_FIELD_TYPE}_${correctName(gridFieldName)}`
    //     resolvers[gridTypeName] = {};
    //     let gridType = `type ${gridTypeName} { `
    //     _.each(subFields, function (field: Object, name) {
    //         if (new RegExp(`^${gridFieldName}\.\\$\.[_0-9A-Za-z]+$`).test(name)) {
    //             const newFieldName = name.replace(gridFieldName + '.$.', "") // 如： current.steps.$.name => name
    //             const newField = {
    //                 ...field,
    //                 name: newFieldName,
    //                 _originFieldName: name
    //             }
    //             gridType += _getFieldType(newField, gridTypeName)
    //         }
    //     })
    //     gridType += "}";
    //     if (gridType.length <= `type ${gridTypeName} { }`.length) {
    //         // console.log('gridType:', gridType)
    //         continue
    //     }
    //     type = gql`
    //         ${gridType}
    //         ${type}
    //     `;
    // }

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