import _ = require("underscore");
import { getObjectServiceName } from ".";
import { SteedosObjectTypeConfig } from "..";
const { moleculerGql: gql } = require("moleculer-apollo-server");


export function generateActionRestProp(actionName: string) {
    let rest = {
        path: `/${actionName}`,
        method: ''
    }
    switch (actionName) {
        case 'aggregate':
            rest.method = 'GET';
            break;
        case 'find':
            rest.method = 'GET';
            break;
        case 'findOne':
            rest.method = 'GET';
            break;
        case 'insert':
            rest.method = 'POST';
            break;
        case 'updateOne':
            rest.method = 'PUT';
            break;
        case 'updateMany':
            rest.method = 'PUT';
            break;
        case 'delete':
            rest.method = 'DELETE';
            break;
        case 'directAggregate':
            rest.method = 'GET';
            break;
        case 'directAggregatePrefixalPipeline':
            rest.method = 'GET';
            break;
        case 'directFind':
            rest.method = 'GET';
            break;
        case 'directInsert':
            rest.method = 'POST';
            break;
        case 'directUpdate':
            rest.method = 'PUT';
            break;
        case 'directDelete':
            rest.method = 'DELETE';
            break;
        case 'getField':
            rest.method = 'GET';
            break;
        case 'toConfig':
            rest.method = 'GET';
            break;
        default:
            break;
    }
    return rest;
}

export function generateActionGraphqlProp(actionName: string, objectConfig: SteedosObjectTypeConfig) {
    let gplObj: any = {};
    let objectName = objectConfig.name;
    switch (actionName) {
        case 'aggregate':
            gplObj.query = gql`
                type Query {
                    ${objectName}__${actionName}(query: JSON, externalPipeline: [JSON]): [${objectName}]
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
        case 'findOne':
            gplObj.query = gql`
                type Query {
                    ${objectName}__${actionName}(id: String, query: JSON): ${objectName}
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
        case 'directAggregate':
            gplObj.query = gql`
                type Query {
                    ${objectName}__${actionName}(query: JSON): [${objectName}]
                }
            `;
            break;
        case 'directAggregatePrefixalPipeline':
            gplObj.query = gql`
                type Query {
                    ${objectName}__${actionName}(query: JSON): [${objectName}]
                }
            `;
            break;
        case 'directFind':
            gplObj.query = gql`
                type Query {
                    ${objectName}__${actionName}(query: JSON): [${objectName}]
                }
            `;
            break;
        case 'directInsert':
            gplObj.mutation = gql`
                type Mutation {
                    ${objectName}__${actionName}(doc: JSON): ${objectName}
                }
            `;
            break;
        case 'directUpdate':
            gplObj.mutation = gql`
                type Mutation {
                    ${objectName}__${actionName}(id: String, doc: JSON): ${objectName}
                }
            `;
            break;
        case 'directDelete':
            gplObj.mutation = gql`
                type Mutation {
                    ${objectName}__${actionName}(id: String): Boolean
                }
            `;
            break;
        case 'getField':
            gplObj.query = gql`
                type Query {
                    ${objectName}__${actionName}(fieldName: String): JSON
                }
            `;
            break;
        case 'toConfig':
            gplObj.query = gql`
                type Query {
                    ${objectName}__${actionName}: JSON
                }
            `;
            break;
        default:
            console.error(`need to handle action: ${actionName}`);
            break;
    }
    // console.log(gplObj);
    return gplObj;
}

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

    type += '}';
    return {
        type: type,
        resolvers: resolvers
    }
}

