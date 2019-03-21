import {
    GraphQLList,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLFloat,
    GraphQLBoolean
} from 'graphql';
var _ = require("underscore");
import { MongoClient } from 'mongodb';

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
        if (v.type == 'lookup') {
            objTypeFields[k] = { type: v.reference_to };
        }
        else if (v.type == 'master_detail') {
            if (v.multiple) {
                objTypeFields[k] = { type: [v.reference_to] };
            } else {
                objTypeFields[k] = { type: v.reference_to };
            }
        }
        // basic?
        else if (BASIC_TYPE_MAPPING[v.type]) {
            objTypeFields[k] = { type: BASIC_TYPE_MAPPING[v.type] }
        }
        else {
            console.error(`The type ${v.type} on property ${k} is unknown.`);
        }
    })

    return objTypeFields
}

export function makeSchema(customObj: any | any[]) {
    let customObjArray = toArray(customObj);
    let rootQueryfields = {};
    _.each(customObjArray, function (obj) {
        let objName = obj.name;
        rootQueryfields[objName] = {
            type: new GraphQLList(new GraphQLObjectType({ name: objName, fields: convertFields(obj.fields) })),
            args: { 'selector': ({ type: GraphQLString }) },
            resolve: async function (source, args, context, info) {
                // console.log('source: ');
                // console.log(source);
                console.log('args: ');
                console.log(args);
                // console.log('context: ');
                // console.log(context);
                // console.log('info: ');
                // console.log(info);
                // console.log(DB);
                // let selector = JSON.parse(args['selector']);
                let selector = {};
                let Collection = DB.collection(info.fieldName);
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