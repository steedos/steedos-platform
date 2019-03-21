import { GraphQLList, GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLFloat, isScalarType } from 'graphql';
var _ = require("underscore");
import { MongoClient } from 'mongodb';

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
    let gObj = {};
    _.each(fields, function (v, k) {
        if (v.type == 'text') {
            gObj[k] = { type: GraphQLString }
        }
        else if (v.type == 'number') {
            gObj[k] = { type: GraphQLFloat }
        }
    })

    return gObj
}

export function getSchema(customObj) {
    console.log('isScalarType: GraphQLString', isScalarType(GraphQLString));

    let objName = customObj.name;
    let rootQueryfields = {};
    rootQueryfields[objName] = {
        type: new GraphQLList(new GraphQLObjectType({ name: objName, fields: convertFields(customObj.fields) })),
        args: { 'selector': ({ type: GraphQLString }) },
        resolve: async function (source, args, context, info) {
            console.log('source: ');
            console.log(source);
            console.log('args: ');
            console.log(args);
            console.log('context: ');
            // console.log(context);
            console.log('info: ');
            console.log(info);
            console.log(DB);
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

    var schema = new GraphQLSchema({
        query: new GraphQLObjectType({
            name: 'RootQueryType',
            fields: rootQueryfields
        })
    });

    return schema;
}