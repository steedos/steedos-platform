import {
    GraphQLList,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLFloat,
    GraphQLBoolean,
    isInputType
} from 'graphql';
// import GraphQLJSON from 'graphql-type-json';
var _ = require("underscore");
import { MongoClient } from 'mongodb';
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

let DB = null;
export const connectToDatabase = async () => {
    const client = await MongoClient.connect('mongodb://localhost:27017', {
        useNewUrlParser: true,
    });
    DB = client.db('steedos');
    console.log('connectted db!!');
    return DB;
};

function convertFields(fields) {
    let objTypeFields = {};
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
        else {
            objTypeFields[k] = { type: GraphQLJSON };
        }
    })

    console.log(objTypeFields);
    return objTypeFields
}

export function makeSchema(customObj: any | any[]) {
    console.log('GraphQLJSON isInputType : ', isInputType(GraphQLJSON));
    let customObjArray = toArray(customObj);
    let rootQueryfields = {};
    _.each(customObjArray, function (obj) {
        let objName = correctName(obj.name);
        console.log('GraphqlQueryType::::::> ', objName);
        rootQueryfields[objName] = {
            type: new GraphQLList(new GraphQLObjectType({ name: objName, fields: convertFields(obj.fields) })),
            args: { 'selector': ({ type: GraphQLJSON }), 'options': ({ type: GraphQLJSON }) },
            resolve: async function (source, args, context, info) {
                console.log('args: ', args);
                var selector = args['selector'] || {};
                console.log('selector: ', selector);
                let db = context.db;
                let Collection = db.collection(info.fieldName);
                let cursor = Collection.find(selector);
                // if (skip) cursor = cursor.skip(skip);
                // if (limit) cursor = cursor.limit(limit);
                // if (sort) cursor = cursor.sort(sort);
                return cursor
                    .toArray()
                    .then(data => {
                        return data;
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
        })
    });

    return schema;
}

function toArray(x: any | any[]): any[] {
    return x instanceof Array
        ? x // already array
        : [x] // single item -> array
}

function correctName(name: string) {
    return name.replace(/\./g, '_');
}