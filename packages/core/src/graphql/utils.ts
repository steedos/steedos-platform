import {
    GraphQLList,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLFloat,
    GraphQLBoolean
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

function convertFields(fields, knownTypes) {
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
            let reference_to = v.reference_to;
            objTypeFields[k] = {
                type: knownTypes[reference_to],
                args: {},
                resolve: async function (source, args, context, info) {
                    let db = context.db;
                    let Collection = db.collection(reference_to);
                    let recordPromise = Collection.findOne({ _id: source[info.fieldName] });
                    return recordPromise
                        .then(result => {
                            return result;
                        })
                        .catch(e => {
                            console.log(e);
                        });
                }
            };
            if (v.type == 'lookup' && v.multiple) {
                objTypeFields[k].type = new GraphQLList(knownTypes[reference_to]);
                objTypeFields[k].resolve = async function (source, args, context, info) {
                    let db = context.db;
                    let Collection = db.collection(reference_to);
                    let selector = { _id: { $in: source[info.fieldName] } };
                    let cursor = Collection.find(selector);
                    return cursor
                        .toArray()
                        .then(result => {
                            return result;
                        })
                        .catch(e => {
                            console.log(e);
                        });
                }
            }
        }
        else {
            objTypeFields[k] = {
                type: GraphQLJSON,

            };
        }
    })

    return objTypeFields
}

export function makeSchema(customObj: any | any[]) {
    let customObjArray = toArray(customObj);
    let rootQueryfields = {};
    let knownTypes = {};
    _.each(customObjArray, function (obj) {
        let objName = correctName(obj.name);
        knownTypes[objName] = new GraphQLObjectType({
            name: objName, fields: function () {
                return convertFields(obj.fields, knownTypes);
            }
        })
        console.log(knownTypes[objName]);
        rootQueryfields[objName] = {
            type: new GraphQLList(knownTypes[objName]),
            args: { 'selector': ({ type: GraphQLJSON }), 'options': ({ type: GraphQLJSON }) },
            resolve: async function (source, args, context, info) {
                var selector = args['selector'] || {};
                let db = context.db;
                let Collection = db.collection(obj.name);
                let cursor = Collection.find(selector);
                return cursor
                    .toArray()
                    .then(result => {
                        return result;
                    })
                    .catch(e => {
                        console.log(e);
                    });
            }
        }
    })

    let rootMutationfields = {};
    _.each(knownTypes, function (type, objName) {
        rootMutationfields[objName + '_INSERT_ONE'] = {
            type: GraphQLJSON,
            args: { 'data': ({ type: GraphQLJSON }) },
            resolve: async function (source, args, context, info) {
                console.log('args: ', args);
                var data = args['data'];
                data._id = data._id || new ObjectId().toHexString();
                let db = context.db;
                let Collection = db.collection(type.name);
                let resultPromise = Collection.insertOne(data);
                return resultPromise
                    .then(result => {
                        return _.head(result.ops);
                    })
                    .catch(e => {
                        console.log(e);
                    });
            }
        }
        rootMutationfields[objName + '_UPDATE_ONE'] = {
            type: GraphQLJSON,
            args: { 'selector': ({ type: GraphQLJSON }), 'data': ({ type: GraphQLJSON }) },
            resolve: async function (source, args, context, info) {
                console.log('args: ', args);
                let data = args['data'];
                let selector = args['selector'];
                let db = context.db;
                let Collection = db.collection(type.name);
                let resultPromise = Collection.updateOne(selector, { $set: data });
                return resultPromise
                    .then(result => {
                        return result;
                    })
                    .catch(e => {
                        console.log(e);
                    });
            }
        }
        rootMutationfields[objName + '_DELETE_ONE'] = {
            type: GraphQLJSON,
            args: { 'selector': ({ type: GraphQLJSON }) },
            resolve: async function (source, args, context, info) {
                console.log('args: ', args);
                let selector = args['selector'];
                let db = context.db;
                let Collection = db.collection(type.name);
                let resultPromise = Collection.deleteOne(selector);
                return resultPromise
                    .then(result => {
                        return result;
                    })
                    .catch(e => {
                        console.log(e);
                    });
            }
        }
    })



    var schema = new GraphQLSchema({
        query: new GraphQLObjectType({
            name: 'RootQueryType',
            fields: rootQueryfields
        }),
        mutation: new GraphQLObjectType({
            name: 'MutationRootType',
            fields: rootMutationfields
        })
    });

    return schema;
}

function toArray(x: any | any[]): any[] {
    return x instanceof Array ? x : [x]
}

function correctName(name: string) {
    return name.replace(/\./g, '_');
}