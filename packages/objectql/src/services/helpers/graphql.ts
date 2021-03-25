import _ = require("underscore");
import moment = require('moment');
import { getObjectServiceName } from "..";
import { SteedosObjectTypeConfig } from "../..";
const clone = require("clone");
import { translationObject } from '@steedos/i18n';
const { moleculerGql: gql } = require("moleculer-apollo-server");
import { getSteedosSchema, getUserLocale } from '../../';
const BASIC_TYPE_MAPPING = {
    'text': 'String',
    'textarea': 'String',
    'html': 'String',
    'select': 'String',
    'url': 'String',
    'email': 'String',
    'date': 'String',
    'datetime': 'String',
    'number': 'Float',
    'currency': 'Float',
    'boolean': 'Boolean'
};
const EXPAND_SUFFIX = '__expand';
const DISPLAY_PREFIX = '_display';
export const RELATED_PREFIX = '_related';

export function generateActionGraphqlProp(actionName: string, objectConfig: SteedosObjectTypeConfig) {
    let gplObj: any = {};
    let objectName = objectConfig.name;
    switch (actionName) {
        case 'count':
            gplObj.query = gql`
                type Query {
                    ${objectName}__${actionName}(fields: JSON, filters: JSON, top: Int, skip: Int, sort: String): Int
                }
            `;
            break;
        case 'find':
            gplObj.query = gql`
                type Query {
                    ${objectName}(fields: JSON, filters: JSON, top: Int, skip: Int, sort: String): [${objectName}]
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
        case 'updateOne':
            gplObj.mutation = gql`
                type Mutation {
                    ${objectName}__${actionName}(id: String, doc: JSON): ${objectName}
                }
            `;
            break;
        case 'updateMany':
            gplObj.mutation = gql`
                type Mutation {
                    ${objectName}__${actionName}(queryFilters: [JSON], doc: JSON): [${objectName}]
                }
            `;
            break;
        case 'delete':
            gplObj.mutation = gql`
                type Mutation {
                    ${objectName}__${actionName}(id: String): Boolean
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

export function generateSettingsGraphql(objectConfig: SteedosObjectTypeConfig) {
    let objectName = objectConfig.name;
    let fields = objectConfig.fields;
    let type = `type ${objectName} { _id: String `;
    let resolvers = {};
    resolvers[objectName] = {};
    _.each(fields, (field, name) => {
        if (name.indexOf('.') > -1) {
            return;
        }
        if (!field.type) {
            console.error(`The field ${name} of ${objectName} has no type property.`);
            return;
        }
        if (BASIC_TYPE_MAPPING[field.type]) {
            type += `${name}: ${BASIC_TYPE_MAPPING[field.type]} `;
        }
        else if ((field.type == 'lookup' || field.type == 'master_detail') && field.reference_to && _.isString(field.reference_to)) {
            let refTo = field.reference_to;
            if (field.multiple) {
                type += `${name}: [String] `;
                type += `${name}${EXPAND_SUFFIX}: [${refTo}] `;
                resolvers[objectName][`${name}${EXPAND_SUFFIX}`] = async function (parent, args, context, info) {
                    let fieldName = info.fieldName.split(EXPAND_SUFFIX)[0];
                    let filters = [];
                    _.each(parent[fieldName], function (f) {
                        filters.push(`(_id eq '${f}')`);
                    })

                    if (filters.length === 0) {
                        return null;
                    }
                    return context.ctx.call(`${getObjectServiceName(refTo)}.find`, { filters: filters });
                }
            } else {
                type += `${name}: String `;
                type += `${name}${EXPAND_SUFFIX}: ${refTo} `;
                resolvers[objectName][`${name}${EXPAND_SUFFIX}`] = async function (parent, args, context, info) {
                    let fieldName = info.fieldName.split(EXPAND_SUFFIX)[0];
                    let id = parent[fieldName];
                    if (!id) {
                        return;
                    }
                    return context.ctx.call(`${getObjectServiceName(refTo)}.findOne`, { id: id });
                }
            }
        }
        else {
            type += `${name}: JSON `;
        }
    })

    // _display
    let _display_type_name = `${DISPLAY_PREFIX}_${objectName}`;
    type += `${DISPLAY_PREFIX}: ${_display_type_name} `;
    resolvers[objectName][DISPLAY_PREFIX] = async function (parent, args, context, info) {
        let userSession = context.ctx.meta.user;
        return await translateToDisplay(objectName, fields, parent, userSession);
    }
    // define _display type
    let _display_type = _getDisplayType(_display_type_name, fields);
    type = gql`
        ${_display_type}
        ${type}
    `;

    // _related
    if (objectConfig.enable_files) {
        let relatedObjName = 'cms_files';
        let relatedFieldName = `${RELATED_PREFIX}_files`;
        type += _getRelatedType(relatedFieldName, relatedObjName);
        resolvers[objectName][relatedFieldName] = _getRelatedResolverForEnableProperty(objectName, relatedObjName, 'parent');
    }
    if (objectConfig.enable_tasks) {
        let relatedObjName = 'tasks';
        let relatedFieldName = `${RELATED_PREFIX}_${relatedObjName}`;
        type += _getRelatedType(relatedFieldName, relatedObjName);
        resolvers[objectName][relatedFieldName] = _getRelatedResolverForEnableProperty(objectName, relatedObjName, 'related_to');
    }
    if (objectConfig.enable_notes) {
        let relatedObjName = 'notes';
        let relatedFieldName = `${RELATED_PREFIX}_${relatedObjName}`;
        type += _getRelatedType(relatedFieldName, relatedObjName);
        resolvers[objectName][relatedFieldName] = _getRelatedResolverForEnableProperty(objectName, relatedObjName, 'related_to');
    }
    if (objectConfig.enable_events) {
        let relatedObjName = 'events';
        let relatedFieldName = `${RELATED_PREFIX}_${relatedObjName}`;
        type += _getRelatedType(relatedFieldName, relatedObjName);
        resolvers[objectName][relatedFieldName] = _getRelatedResolverForEnableProperty(objectName, relatedObjName, 'related_to');
    }
    if (objectConfig.enable_audit) {
        let relatedObjName = 'audit_records';
        let relatedFieldName = `${RELATED_PREFIX}_${relatedObjName}`;
        type += _getRelatedType(relatedFieldName, relatedObjName);
        resolvers[objectName][relatedFieldName] = _getRelatedResolverForEnableProperty(objectName, relatedObjName, 'related_to');
    }
    if (objectConfig.enable_instances) {
        let relatedObjName = 'instances';
        let relatedFieldName = `${RELATED_PREFIX}_${relatedObjName}`;
        type += _getRelatedType(relatedFieldName, relatedObjName);
        resolvers[objectName][relatedFieldName] = _getRelatedResolverForEnableProperty(objectName, relatedObjName, 'record_ids');
    }
    if (objectConfig.enable_approvals) {
        let relatedObjName = 'approvals';
        let relatedFieldName = `${RELATED_PREFIX}_${relatedObjName}`;
        type += _getRelatedType(relatedFieldName, relatedObjName);
        resolvers[objectName][relatedFieldName] = _getRelatedResolverForEnableProperty(objectName, relatedObjName, 'related_to');
    }

    type += '}';
    return {
        type: type,
        resolvers: resolvers
    }
}

export function correctName(name: string) {
    return name.replace(/\./g, '_');
}

export function _getRelatedType(relatedFieldName, relatedObjName) {
    return `${relatedFieldName}(fields: [String], filters: JSON, top: Int, skip: Int, sort: String): [${relatedObjName}] `;
}

function _getRelatedResolverForEnableProperty(objectName, relatedObjName, foreignKey) {
    return async function (parent, args, context, info) {
        let userSession = context.ctx.meta.user;
        let steedosSchema = getSteedosSchema();
        let object = steedosSchema.getObject(relatedObjName);
        let filters = [];
        filters = [[`${foreignKey}.o`, "=", objectName], [`${foreignKey}.ids`, "=", parent._id]];
        if (args && args.filters) {
            filters.push(args.filters);
        }
        args.filters = filters;
        return await object.find(args, userSession);
    }
}

function getTranslatedFieldConfig(translatedObject: any, name: string) {
    return translatedObject.fields[name.replace(/__label$/, "")];
}

async function translateToDisplay(objectName, fields, doc, userSession: any) {
    const lng = getUserLocale(userSession);
    let steedosSchema = getSteedosSchema();
    let object = steedosSchema.getObject(objectName);
    let objConfig = await object.toConfig();
    let _object = clone(objConfig);
    translationObject(lng, _object.name, _object);
    let displayObj = { _id: doc._id };
    let utcOffset = userSession.utcOffset;
    for (const name in fields) {
        if (Object.prototype.hasOwnProperty.call(fields, name)) {
            const field = fields[name];
            if (_.has(doc, name)) {
                const fType = field.type;
                if (fType == 'text') {
                    displayObj[name] = doc[name] || '';
                }
                else if (fType == 'textarea') {
                    displayObj[name] = doc[name] || '';
                }
                else if (fType == 'html_text') {
                    displayObj[name] = doc[name] || '';
                }
                else if (fType == 'html') {
                    displayObj[name] = doc[name] || '';
                }
                else if (fType == 'select') {
                    let label = '';
                    let map = {};
                    let value = doc[name];
                    let translatedField = getTranslatedFieldConfig(_object, name);
                    let translatedFieldOptions = translatedField && translatedField.options;
                    _.forEach(translatedFieldOptions, function (o) {
                        map[o.value] = o.label;
                    });
                    if (field.multiple) {
                        let labels = [];
                        _.forEach(value, function (v) {
                            labels.push(map[v]);
                        })
                        label = labels.join(',');
                    } else {
                        label = map[value];
                    }
                    displayObj[name] = label;
                }
                else if (fType == 'boolean') {
                    if (doc[name]) {
                        displayObj[name] = '√';
                    } else {
                        displayObj[name] = '';
                    }
                }
                else if (fType == 'date') {
                    displayObj[name] = moment(doc[name]).utcOffset(utcOffset).format("YYYY-MM-DD")
                }
                else if (fType == 'datetime') {
                    displayObj[name] = moment(doc[name]).utcOffset(utcOffset).format("YYYY-MM-DD H:mm")
                }
                else if (fType == 'number') {
                    displayObj[name] = doc[name] || '';
                }
                else if (fType == 'currency') {
                    displayObj[name] = doc[name] || '';
                }
                else if (fType == 'percent') {
                    displayObj[name] = `${doc[name] * 100}%`;
                }
                else if (fType == 'password') {
                    displayObj[name] = '';
                    if (_.isString(doc[name])) {
                        for (let i = 0; i < doc[name].length; i++) {
                            displayObj[name] += '*';
                        }
                    }
                }
                else if (fType == 'lookup' && _.isString(field.reference_to)) {
                    let lookupLabel = '';
                    let refTo = field.reference_to;
                    let refValue = doc[name];
                    let refObj = steedosSchema.getObject(refTo);
                    let nameFieldKey = await refObj.getNameFieldKey();
                    if (field.multiple) {
                        let refRecords = await refObj.find({ filters: [`_id`, 'in', refValue] });
                        lookupLabel = _.pluck(refRecords, nameFieldKey).join(',');
                    } else {
                        let refRecord = (await refObj.find({ filters: [`_id`, '=', refValue] }))[0];
                        if (refRecord) {
                            lookupLabel = refRecord[nameFieldKey];
                        }
                    }
                    displayObj[name] = lookupLabel;
                }
                else if (fType == 'master_detail' && _.isString(field.reference_to)) {
                    let masterDetailLabel = '';
                    let refTo = field.reference_to;
                    let refValue = doc[name];
                    let refObj = steedosSchema.getObject(refTo);
                    let nameFieldKey = await refObj.getNameFieldKey();
                    if (field.multiple) {
                        let refRecords = await refObj.find({ filters: [`_id`, 'in', refValue] });
                        masterDetailLabel = _.pluck(refRecords, nameFieldKey).join(',');
                    } else {
                        let refRecord = (await refObj.find({ filters: [`_id`, '=', refValue] }))[0];
                        if (refRecord) {
                            masterDetailLabel = refRecord[nameFieldKey];
                        }
                    }
                    displayObj[name] = masterDetailLabel;
                }
                else if (fType == 'autonumber') {
                    displayObj[name] = doc[name] || '';
                }
                else if (fType == 'url') {
                    displayObj[name] = doc[name] || '';
                }
                else if (fType == 'email') {
                    displayObj[name] = doc[name] || '';
                }
                else if (fType == 'formula') {
                    displayObj[name] = doc[name] || '';
                }
                else if (fType == 'summary') {
                    displayObj[name] = doc[name] || '';
                }
                else if (fType == 'image') {
                    displayObj[name] = doc[name] || '';
                }
                else {
                    console.error(`Graphql Display: need to handle new field type ${field.type} for ${objectName}.`);
                    displayObj[name] = doc[name] || '';
                }
            } else {
                displayObj[name] = ''; // 如果值为空，均返回空字符串
            }
        }
    }
    return displayObj;
}

function _getDisplayType(typeName, fields) {
    let type = `type ${typeName} { _id: String `;
    _.each(fields, (field, name) => {
        if (name.indexOf('.') > -1) {
            return;
        }
        type += `${name}: JSON `
    })
    type += '}';
    return type;
}