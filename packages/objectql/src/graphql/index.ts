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
import { getFieldLabel } from './utils';
import {
    GraphQLDate,
    GraphQLDateTime
} from 'graphql-iso-date';

/** Maps basic creator field types to basic GraphQL types */
const BASIC_TYPE_MAPPING = {
    'text': GraphQLString,
    'textarea': GraphQLString,
    'html': GraphQLString,
    'select': GraphQLString,
    'url': GraphQLString,
    'email': GraphQLString,
    'date': GraphQLDate,
    'datetime': GraphQLDateTime,
    'number': GraphQLFloat,
    'currency': GraphQLFloat,
    'boolean': GraphQLBoolean
}

const knownTypes = {};
const relatedObjects = {};
const RELATEDPREFIX = 'related__';
const LABELSUFFIX = '__label';

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
                try {
                    let object = steedosSchema.getObject(objectName);
                    if (object) {
                        knownTypes[corName] = buildGraphQLObjectType(object, steedosSchema, knownTypes)
                    }
                } catch (error) {
                    console.error(error);
                    return;
                }
            }

            objTypeFields[k] = {
                type: knownTypes[corName],
                args: {},
                resolve: async function (source, args, context, info) {
                    let object = steedosSchema.getObject(objectName);
                    let userSession = context ? context.user : null;
                    if (object.name == 'users') {
                        userSession = null;
                    }
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
                    if (object.name == 'users') {
                        userSession = null;
                    }
                    return await object.find({
                        filters: filters.join(' or ')
                    }, userSession);
                }
            }
        }
        else if (v.type == RELATEDPREFIX) {
            let corName = v.reference_to;
            let objName = v.objectName;
            if (!knownTypes[objName]) {
                let object = steedosSchema.getObject(objName);
                if (object) {
                    knownTypes[objName] = buildGraphQLObjectType(object, steedosSchema, knownTypes)
                }
            }

            objTypeFields[k] = {
                type: new GraphQLList(knownTypes[objName]),
                args: { 'fields': { type: new GraphQLList(GraphQLString) || GraphQLString }, 'filters': { type: GraphQLJSON }, 'top': { type: GraphQLInt }, 'skip': { type: GraphQLInt }, 'sort': { type: GraphQLString } },
                resolve: async function (source, args, context, info) {
                    let field = relatedObjects[corName].fields[info.fieldName];
                    let referenceToField = field.reference_to_field;
                    let relatedObjName = field.objectName;
                    let object = steedosSchema.getObject(relatedObjName);
                    let userSession = context ? context.user : null;
                    let filters = [];
                    let _idValue = source._id;
                    if (referenceToField) {
                        _idValue = source[referenceToField];
                    }
                    if (field.by_enabled) {
                        filters = [[`${field.name}.o`, "=", corName], [`${field.name}.ids`, "=", source._id]];
                    }
                    else {
                        filters = [[field.name, "=", _idValue]];
                    }
                    if (args && args.filters) {
                        filters.push(args.filters);
                    }
                    args.filters = filters;
                    return object.find(args, userSession);
                }
            };
        }
        else if (v.type == LABELSUFFIX) {
            objTypeFields[k] = {
                type: GraphQLJSON,
                resolve: function (source, args, context, info) {
                    // let field = relatedObjects[info.parentType.name].fields[info.fieldName];
                    // return getFieldLabel(field, source[field.name], userSession);
                    let userSession = context ? context.user : null;
                    let objectName = info.parentType.name;
                    let fieldName = info.fieldName;
                    let field = relatedObjects[objectName].fields[fieldName];
                    let fieldValue = source[field.name];
                    let relatedFields = relatedObjects[objectName].fields;
                    let object = steedosSchema.getObject(objectName);
                    return getFieldLabel(fieldName, fieldValue, relatedFields, object, userSession);
                }
            };
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

    let relatedFields = relatedObjects[corName].fields;

    return new GraphQLObjectType({
        name: corName, fields: function () {
            return convertFields(steedosSchema, _.extend({}, obj.fields, relatedFields), knownTypes);
        }
    })
}

function collectRelatedObjects(steedosSchema: SteedosSchema) {
    _.each(steedosSchema.getDataSources(), function (datasource) {
        _.each(datasource.getObjects(), function (obj, object_name) {
            if (!obj.name || !obj.fields) {
                return;
            }
            let objName: string = correctName(obj.name);

            if (!relatedObjects[objName]) {
                relatedObjects[objName] = { fields: {} };
            }

            _.each(obj.fields, function (v, k) {
                if (v.type == 'master_detail' && v.reference_to && _.isString(v.reference_to)) {
                    let refName = correctName(v.reference_to);
                    if (!relatedObjects[refName]) {
                        relatedObjects[refName] = { fields: {} };
                    }

                    relatedObjects[refName].fields[`${RELATEDPREFIX}${objName}`] = {
                        type: RELATEDPREFIX,
                        reference_to: refName,
                        reference_to_field: v.reference_to_field,
                        name: k,
                        objectName: objName
                    }

                }
                else if (['boolean', 'date', 'datetime', 'select', 'percent'].includes(v.type)) {
                    relatedObjects[objName].fields[`${k}${LABELSUFFIX}`] = {
                        type: LABELSUFFIX,
                        name: k,
                        dataType: v.type,
                        options: v.options,
                        multiple: v.multiple
                    }
                }
            })
            let enabledRefNames = [];
            if (obj.enable_files) {
                enabledRefNames.push('cms_files');
            }
            if (obj.enable_tasks) {
                enabledRefNames.push('tasks');
            }
            if (obj.enable_events) {
                enabledRefNames.push('events');
            }
            if (obj.enable_audit) {
                enabledRefNames.push('audit_records');
            }
            _.forEach(enabledRefNames, function (refName) {
                relatedObjects[objName].fields[`${RELATEDPREFIX}${refName}`] = {
                    type: RELATEDPREFIX,
                    reference_to: objName,
                    name: refName == 'cms_files' ? 'parent' : 'related_to',
                    objectName: refName,
                    by_enabled: true // 通过enable方式关联的子表打上标记供查询时判断
                }
            })

        })
    })
}

export function buildGraphQLSchema(steedosSchema: SteedosSchema, datasource?: SteedosDataSourceType): GraphQLSchema {
    collectRelatedObjects(steedosSchema);

    let rootQueryfields = {};
    _.each(steedosSchema.getDataSources(), function (datasource) {
        _.each(datasource.getObjects(), function (obj, object_name) {

            if (!obj.name) {
                return;
            }

            let corName = correctName(obj.name);
            let objName: string = correctName(obj.name);

            knownTypes[objName] = buildGraphQLObjectType(obj, steedosSchema, knownTypes)

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
        rootMutationfields[objName + '__insert'] = {
            type: knownTypes[objName],
            args: { 'data': { type: new GraphQLNonNull(GraphQLJSON) || new GraphQLNonNull(GraphQLString) } },
            resolve: async function (source, args, context, info) {
                let data:any = '';
                if(_.isString(args['data'])){
                    data = JSON.parse(args['data'])
                }else{
                    data = JSON.parse(JSON.stringify(args['data']))
                }
                data._id = data._id || new ObjectId().toHexString();
                let object = steedosSchema.getObject(`${type.type.ofType.name}`);
                let userSession = context ? context.user : null;
                if (userSession && object.getField('space')) {
                    data.space = userSession.spaceId;
                }
                return object.insert(data, userSession);
            }
        }
        rootMutationfields[objName + '__update'] = {
            type: knownTypes[objName],
            args: { '_id': { type: new GraphQLNonNull(GraphQLString) }, 'selector': { type: GraphQLJSON }, 'data': { type: new GraphQLNonNull(GraphQLJSON) || new GraphQLNonNull(GraphQLString) } },
            resolve: async function (source, args, context, info) {
                let data:any = '';
                if(_.isString(args['data'])){
                    data = JSON.parse(args['data'])
                }else{
                    data = JSON.parse(JSON.stringify(args['data']))
                }
                let _id = args['_id'];
                let object = steedosSchema.getObject(`${type.type.ofType.name}`);
                let userSession = context ? context.user : null;
                delete data.space;
                return object.update(_id, data, userSession);
            }
        }
        rootMutationfields[objName + '__delete'] = {
            type: GraphQLJSON,
            args: { '_id': { type: new GraphQLNonNull(GraphQLString) }, 'selector': { type: GraphQLJSON } },
            resolve: async function (source, args, context, info) {
                let _id = args['_id'];
                let object = steedosSchema.getObject(`${type.type.ofType.name}`);
                let userSession = context ? context.user : null;
                return object.delete(_id, userSession);
            }
        }
    })

    rootQueryfields['count'] = {
        type: GraphQLInt,
        args: { 'objectName': { type: new GraphQLNonNull(GraphQLString) }, 'filters': { type: GraphQLJSON } },
        resolve: async function (source, args, context, info) {
            if (!args.objectName) {
                throw new Error('objectName is required!');
            }
            let object = steedosSchema.getObject(args.objectName);
            let userSession = context ? context.user : null;
            return object.count({ filters: args.filters }, userSession);
        }
    }

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