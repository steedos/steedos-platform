const objectql = require("@steedos/objectql");
const steedosAuth = require("@steedos/auth");
const express = require('express');
const graphqlHTTP = require('express-graphql');
const _ = require("underscore");
const app = express();
const router = express.Router();
var path = require('path')
var util = require('../util/index')
const UglifyJS = require("uglify-js");
import { Publish } from '../publish'

export class Core {

    static load(){
        this.expandSimpleSchemaPres();
        this.loadObjects();
        this.initObjects();
    }

    static run() {
        this.initGraphqlAPI();
        this.initPublishAPI()
        this.initRoutes();
    }

    static addStaticJs(){
        let baseObject = JSON.stringify(Creator.baseObject, function (key, val) {
            if (typeof val === 'function') {
                return "$FS$" + val.toString().replace(/\"/g, "'")+"$FE$";
            }
            return val;
        });
        let minifyJs = UglifyJS.minify("Creator.baseObject=" + baseObject)
        let minifyJsCode = minifyJs.code;
        let minifyJsError = minifyJs.error;
        if(minifyJsCode){
            minifyJsCode = minifyJsCode.replace(/"\$FS\$/g, "").replace(/\$FE\$"/g, "").replace(/'\$FS\$/g, "").replace(/\$FE\$'/g, "").replace(/\\r/g, "").replace(/\\n/g, "")
            WebAppInternals.addStaticJs(minifyJsCode);
        }else{
            throw new Error(minifyJsError)
        }
    }

    static createBaseObject(){
        let standardObjectsDir = path.dirname(require.resolve("@steedos/standard-objects"))
        if (standardObjectsDir) {
            let baseObject = util.loadFile(path.join(standardObjectsDir, "base.object.yml"))
            Creator.baseObject = baseObject
        }
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
        let self = this;
        _.each(Creator.Objects, function (obj, object_name) {
            self.dynamicLoadObjectMethods(object_name, obj);
            self.dynamicLoadObjectTriggers(object_name, obj);
            self.dynamicLoadObjectActions(object_name, obj);
            return Creator.loadObjects(obj, object_name);
        });
    }

    private static dynamicLoadObjectMethods(objectName: string, objectConfig){
        _.each(objectql.objectDynamicLoad.getMethods(objectName), (item)=>{
            objectql.extend(objectConfig, {methods: {[item.methodName]: item.method}})
        })
    }

    private static transformTriggerWhen(triggerWhen: string){
        let when = triggerWhen;
        switch (triggerWhen) {
            case 'beforeInsert':
                when = 'before.insert'
                break;
            case 'beforeUpdate':
                when = 'before.update'
                break;
            case 'beforeDelete':
                when = 'before.delete'
                break;
            case 'afterInsert':
                when = 'after.insert'
                break;
            case 'afterUpdate':
                when = 'after.update'
                break;
            case 'afterDelete':
                when = 'after.delete'
                break;
            default:
                break;
        }
        return when
    }

    private static dynamicLoadObjectTriggers(objectName: string, objectConfig){
        _.each(objectql.objectDynamicLoad.getTriggers(objectName), (item)=>{
            item.trigger.when = this.transformTriggerWhen(item.trigger.when);
            objectql.extend(objectConfig, {triggers: {[item.triggerName]: item.trigger}})
        })
    }

    private static dynamicLoadObjectActions(objectName: string, objectConfig){
        _.each(objectql.objectDynamicLoad.getActions(objectName), (item)=>{
            objectql.extend(objectConfig, {actions: {[item.actionName]: item.action}})
        })
    }

    private static initObjects() {
        let newObjects = {}, objectsRolesPermission = {};
        _.each(Creator.Objects, function (obj: any, key: any) {
            var _key, _obj;
            if (/^[_a-zA-Z][_a-zA-Z0-9]*$/.test(key) === false) {
                _obj = _.clone(obj);
                _obj.table_name = _.clone(key);
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
        router.use("/", steedosAuth.setRequestUser);
        router.use("/", function (req, res, next) {
            if (req.user) {
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


        router.use("/", graphqlHTTP({
            schema: objectql.buildGraphQLSchema(objectql.getSteedosSchema()),
            graphiql: true
        }));
        app.use('/graphql', router);
        return WebApp.connectHandlers.use(app);
    }

    private static initPublishAPI() {
        Publish.init();
    }

    private static initRoutes() {
        // /api/v4/users/login, /api/v4/users/validate
        app.use(steedosAuth.authExpress);
        
        let routers = objectql.objectDynamicLoad.getRouters()
        _.each(routers, (item)=>{
            app.use(item.routerPath, item.router)
        })

        WebApp.connectHandlers.use(app);
    }

    static initDesignSystem(){
        const router = express.Router()

        let dsPath = require.resolve("@salesforce-ux/design-system/package.json")
        dsPath = dsPath.replace("package.json", 'assets')
        let routerPath = "/assets/"
        if (__meteor_runtime_config__ && __meteor_runtime_config__.ROOT_URL_PATH_PREFIX)
            routerPath = __meteor_runtime_config__.ROOT_URL_PATH_PREFIX + "/assets/";
        router.use(routerPath, express.static(dsPath));
        WebApp.rawConnectHandlers.use(router);
    }
}