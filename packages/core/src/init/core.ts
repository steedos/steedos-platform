const objectql = require("@steedos/objectql");
const steedosAuth = require("@steedos/auth");
const express = require('express');
const graphqlHTTP = require('express-graphql');
const _ = require("underscore");
const app = express();
const router = express.Router();
import { Publish } from '../publish'

export class Core {

    static run() {
        this.expandSimpleSchemaPres();
        this.loadObjects();
        this.initObjects();
        this.initGraphqlAPI();
        this.initPublishAPI()
    }

    private static expandSimpleSchemaPres() {
        SimpleSchema.extendOptions({
            filtersFunction: Match.Optional(Match.OneOf(Function, String))
        });
        SimpleSchema.extendOptions({
            optionsFunction: Match.Optional(Match.OneOf(Function, String))
        });
        SimpleSchema.extendOptions({
            createFunction: Match.Optional(Match.OneOf(Function, String))
        });
    }

    private static loadObjects() {
        _.each(Creator.Objects, function (obj, object_name) {
            return Creator.loadObjects(obj, object_name);
        });
    }

    private static initObjects() {
        let newObjects = {}, objectsRolesPermission = {};
        _.each(Creator.Objects, function (obj: any, key: any) {
            var _key, _obj;
            if (/^[_a-zA-Z][_a-zA-Z0-9]*$/.test(key) === false) {
                _obj = _.clone(obj);
                _obj.tableName = _.clone(key);
                _key = key.replace(new RegExp('\\.', 'g'), '_');
                _obj.name = _key;
                newObjects[_key] = _obj;
            } else {
                newObjects[key] = obj;
            }
            objectsRolesPermission[key] = obj.permission_set;
            return Creator.getCollection('permission_objects').find({
                object_name: key
            }).forEach(function (po) {
                var permission_set;
                permission_set = Creator.getCollection('permission_set').findOne(po.permission_set_id, {
                    fields: {
                        name: 1
                    }
                });
                return objectsRolesPermission[key][permission_set.name] = {
                    allowCreate: po.allowCreate,
                    allowDelete: po.allowDelete,
                    allowEdit: po.allowEdit,
                    allowRead: po.allowRead,
                    modifyAllRecords: po.modifyAllRecords,
                    viewAllRecords: po.viewAllRecords,
                    modifyCompanyRecords: po.modifyCompanyRecords,
                    viewCompanyRecords: po.viewCompanyRecords,
                    disabled_list_views: po.disabled_list_views,
                    disabled_actions: po.disabled_actions,
                    unreadable_fields: po.unreadable_fields,
                    uneditable_fields: po.uneditable_fields,
                    unrelated_objects: po.unrelated_objects
                };
            });
        });
        Creator.steedosSchema = objectql.getSteedosSchema();
        Creator.steedosSchema.addDataSource('default', {
            driver: 'meteor-mongo',
            objects: newObjects,
            objectsRolesPermission: objectsRolesPermission
        });
    }

    private static initGraphqlAPI() {
        router.use("/:dataSourceName", function (req, res, next) {
            var authToken, user;
            authToken = Steedos.getAuthToken(req, res);
            user = null;
            if (authToken) {
                user = Meteor.wrapAsync(function (authToken, cb) {
                    return steedosAuth.getSession(authToken).then(function (resolve, reject) {
                        return cb(reject, resolve);
                    });
                })(authToken);
            }
            if (user) {
                return next();
            } else {
                return res.status(401).send({
                    errors: [
                        {
                            'message': 'You must be logged in to do this.'
                        }
                    ]
                });
            }
        });
        router.use("/:dataSourceName/:spaceId", function (req, res, next) {
            var authToken, spaceId, user;
            authToken = Steedos.getAuthToken(req, res);
            spaceId = req.params.spaceId;
            console.log('spaceId: ', spaceId);
            user = null;
            if (authToken) {
                user = Meteor.wrapAsync(function (authToken, spaceId, cb) {
                    return steedosAuth.getSession(authToken, spaceId).then(function (resolve, reject) {
                        return cb(reject, resolve);
                    });
                })(authToken, spaceId);
            }
            if (user) {
                console.log('userSession: ', user);
                req.userSession = user;
                return next();
            } else {
                return res.status(401).send({
                    errors: [
                        {
                            'message': 'You must be logged in to do this.'
                        }
                    ]
                });
            }
        });
        _.each(Creator.steedosSchema.getDataSources(), function (datasource: any, name) {
            if (datasource.driver === 'mongo' || datasource.driver === 'meteor-mongo') {
                return router.use("/" + name + "/:spaceId", graphqlHTTP({
                    schema: datasource.buildGraphQLSchema(),
                    graphiql: true
                }));
            } else {
                return router.use("/" + name, graphqlHTTP({
                    schema: datasource.buildGraphQLSchema(),
                    graphiql: true
                }));
            }
        });
        app.use('/graphql', router);
        return WebApp.connectHandlers.use(app);
    }

    private static initPublishAPI(){
        Publish.init();
    }
}