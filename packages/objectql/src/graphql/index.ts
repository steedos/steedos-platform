import { SteedosSchema, SteedosDataSourceType } from "../types";
import {
    GraphQLList,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLFloat,
    GraphQLBoolean,
    GraphQLNonNull,
    GraphQLInt
} from 'graphql';
var _ = require("underscore");
import { ObjectId } from 'mongodb';
var GraphQLJSON = require('graphql-type-json');

/** Maps basic creator field types to basic GraphQL types */
const BASIC_TYPE_MAPPING = {
    'text': GraphQLString,
    'textarea': GraphQLString,
    'html': GraphQLString,
    'select': GraphQLString,
    'url': GraphQLString,
    'email': GraphQLString,
    'date': GraphQLString,
    'datetime': GraphQLString,
    'number': GraphQLFloat,
    'currency': GraphQLFloat,
    'boolean': GraphQLBoolean
}

const knownTypes = {};

function convertFields(steedosSchema: SteedosSchema, fields, knownTypes) {
    let objTypeFields = {};
    objTypeFields["_id"] = {
        type: GraphQLString
    }

    _.each(fields, function (v, k) {
        if (k.indexOf('.') > -1) {
            return;
        }

        if (!v.type) {
            console.error(`The field ${k} has no type property.`);
            return;
        }

        if (BASIC_TYPE_MAPPING[v.type]) {
            objTypeFields[k] = { type: BASIC_TYPE_MAPPING[v.type] }
        }

        else if ((v.type == 'lookup' || v.type == 'master_detail') && v.reference_to && _.isString(v.reference_to)) {
            let objectName = v.reference_to;
            let corName = correctName(objectName);
            if (!knownTypes[corName]) {
                let object = steedosSchema.getObject(objectName);
                if (object) {
                    knownTypes[corName] = buildGraphQLObjectType(object, steedosSchema, knownTypes)
                }
            }

            objTypeFields[k] = {
                type: knownTypes[corName],
                args: {},
                resolve: async function (source, args, context, info) {
                    let object = steedosSchema.getObject(objectName);
                    let userSession = context ? context.user : null;
                    let record = await object.findOne(source[info.fieldName], {}, userSession);
                    return record;
                }
            };
            if (v.type == 'lookup' && v.multiple) {
                objTypeFields[k].type = new GraphQLList(knownTypes[corName]);
                objTypeFields[k].resolve = async function (source, args, context, info) {
                    let object = steedosSchema.getObject(objectName);
                    let filters = [];
                    _.each(source[info.fieldName], function (f) {
                        filters.push(`(_id eq '${f}')`);
                    })
                    if (filters.length === 0) {
                        return null;
                    }
                    let userSession = context ? context.user : null;
                    return await object.find({
                        filters: filters.join(' or ')
                    }, userSession);
                }
            }
        }
        else {
            objTypeFields[k] = {
                type: GraphQLJSON
            };
        }
    })

    return objTypeFields
}

function correctName(name: string) {
    return name.replace(/\./g, '_');
}

function buildGraphQLObjectType(obj, steedosSchema, knownTypes) {

    let corName = correctName(obj.name);

    return new GraphQLObjectType({
        name: corName, fields: function () {
            return convertFields(steedosSchema, obj.fields, knownTypes);
        }
    })
}

export function buildGraphQLSchema(steedosSchema: SteedosSchema, datasource?: SteedosDataSourceType): GraphQLSchema {
    let rootQueryfields = {};
    _.each(steedosSchema.getDataSources(), function (datasource) {
        _.each(datasource.getObjects(), function (obj, object_name) {

            if (!obj.name) {
                return;
            }

            let corName = correctName(obj.name);
            let objName: string = correctName(obj.name);

            if (!knownTypes[objName]) {
                knownTypes[objName] = buildGraphQLObjectType(obj, steedosSchema, knownTypes)
            }

            rootQueryfields[corName] = {
                type: new GraphQLList(knownTypes[objName]),
                args: { 'fields': { type: new GraphQLList(GraphQLString) || GraphQLString }, 'filters': { type: GraphQLJSON }, 'top': { type: GraphQLInt }, 'skip': { type: GraphQLInt }, 'sort': { type: GraphQLString } },
                resolve: async function (source, args, context, info) {
                    let object = steedosSchema.getObject(`${obj.name}`);
                    let userSession = context ? context.user : null;
                    return object.find(args, userSession);
                }
            }
        })
    })


    let rootMutationfields = {};
    _.each(rootQueryfields, function (type, objName) {
        rootMutationfields[objName + '_INSERT_ONE'] = {
            type: GraphQLJSON,
            args: { 'data': { type: new GraphQLNonNull(GraphQLJSON) } },
            resolve: async function (source, args, context, info) {
                console.log('args: ', args);
                var data = args['data'];
                data._id = data._id || new ObjectId().toHexString();
                let object = steedosSchema.getObject(`${type.type.ofType.name}`);
                let userSession = context ? context.user : null;
                return object.insert(data, userSession);
            }
        }
        rootMutationfields[objName + '_UPDATE_ONE'] = {
            type: GraphQLJSON,
            args: { '_id': { type: new GraphQLNonNull(GraphQLString) }, 'selector': { type: GraphQLJSON }, 'data': { type: new GraphQLNonNull(GraphQLJSON) } },
            resolve: async function (source, args, context, info) {
                console.log('args: ', args);
                let data = args['data'];
                let _id = args['_id'];
                let object = steedosSchema.getObject(`${type.type.ofType.name}`);
                let userSession = context ? context.user : null;
                return object.update(_id, data, userSession);
            }
        }
        rootMutationfields[objName + '_DELETE_ONE'] = {
            type: GraphQLJSON,
            args: { '_id': { type: new GraphQLNonNull(GraphQLString) }, 'selector': { type: GraphQLJSON } },
            resolve: async function (source, args, context, info) {
                console.log('args: ', args);
                let _id = args['_id'];
                let object = steedosSchema.getObject(`${type.type.ofType.name}`);
                let userSession = context ? context.user : null;
                return object.delete(_id, userSession);
            }
        }
    })

    var schemaConfig = {
        query: new GraphQLObjectType({
            name: 'RootQueryType',
            fields: rootQueryfields
        }),
        mutation: new GraphQLObjectType({
            name: 'MutationRootType',
            fields: rootMutationfields
        })
    };

    return new GraphQLSchema(schemaConfig);
}