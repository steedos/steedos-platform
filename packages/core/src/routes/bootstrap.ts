import steedosI18n = require("@steedos/i18n");
import { getPlugins } from '../';
import { requireAuthentication } from './auth'
import { getObject, getLayout } from '@steedos/objectql'
require("@steedos/license");
const Fiber = require('fibers')
const clone = require("clone");
const _ = require('underscore');

var express = require('express');
export const bootStrapExpress = express.Router();

function _getLocale(user) {
    var locale, ref, ref1;
    if ((user != null ? (ref = user.locale) != null ? ref.toLocaleLowerCase() : void 0 : void 0) === 'zh-cn') {
        locale = "zh-CN";
    } else if ((user != null ? (ref1 = user.locale) != null ? ref1.toLocaleLowerCase() : void 0 : void 0) === 'en-us') {
        locale = "en";
    } else {
        locale = "zh-CN";
    }
    return locale;
};

async function getUserProfileObjectsLayout(userId, spaceId, objectName?) {
    let spaceUser;
    let spaceUsers = await getObject("space_users").directFind({filters: [['space', '=', spaceId], ['user', '=', userId]]});
    if(spaceUsers.length > 0){
        spaceUser = spaceUsers[0];
    }
    if (spaceUser && spaceUser.profile) {
        let filters = [['space', '=', spaceId],['profiles', '=', spaceUser.profile]];
        if(objectName){
            filters.push(['object_name', '=', objectName])
        }
        return await getObject("object_layouts").directFind({filters: filters})
    }
};

export async function getSpaceBootStrap(req, res) {
    return Fiber(async function () {
        let userSession = req.user;
        let userId = userSession.userId;
        let urlParams = req.params;
        let spaceId = req.headers['x-space-id'] || urlParams.spaceId

        if (!userSession) {
            return res.status(500).send();
        }

        let space = Creator.Collections["spaces"].findOne({ _id: spaceId }, { fields: { name: 1 } })

        let result = Creator.getAllPermissions(spaceId, userId);

        let lng = _getLocale(db.users.findOne(userId, { fields: { locale: 1 } }))

        steedosI18n.translationObjects(lng, result.objects);

        result.user = userSession

        result.space = space

        result.apps = clone(Creator.Apps)

        result.dashboards = clone(Creator.Dashboards)
        
        result.object_listviews = Creator.getUserObjectsListViews(userId, spaceId, result.objects)
        
        result.object_workflows = Meteor.call('object_workflows.get', spaceId, userId)
        
        let datasources = Creator.steedosSchema.getDataSources();
        
        for (const datasourceName in datasources) {
            if(datasourceName != 'default'){
                let datasource = datasources[datasourceName];
                const datasourceObjects = datasource.getObjects();
                for (const objectName in datasourceObjects) {
                    const object = datasourceObjects[objectName];
                    const _obj = Creator.convertObject(clone(object.toConfig()), spaceId)
                    _obj.name = objectName
                    _obj.database_name = datasourceName
                    _obj.permissions = await object.getUserObjectPermission(userSession)
                    result.objects[_obj.name] = _obj
                }
            }
        }

        _.each(Creator.steedosSchema.getDataSources(), function(datasource, name){
            result.apps = _.extend(result.apps, clone(datasource.getAppsConfig()))
            result.dashboards = _.extend(result.dashboards, datasource.getDashboardsConfig())
        })

        var _dbApps = await getObject("apps").directFind({filters: [['space', '=', spaceId],['is_creator', '=', true],['visible', '=', true]]});
        let dbApps = {};
        _.each(_dbApps, function(dbApp){
            return dbApps[dbApp._id] = dbApp;
        })

        result.apps = _.extend( result.apps || {}, dbApps);

        var _dbDashboards = await getObject("dashboard").directFind({filters: [['space', '=', spaceId]]});
        let dbDashboards = {};
        _.each(_dbDashboards, function(dashboard){
            dbDashboards[dashboard._id] = dashboard;
        })
        result.dashboards = _.extend( result.dashboards || {}, dbDashboards)
        
        let _Apps = {}
        _.each(result.apps, function(app, key){
            if(!app._id){
                app._id = key
            }
            if(app.code){
                app._dbid = app._id
                app._id = app.code
            }
            _Apps[app._id] = app
        });

        var unvisibleApps = await getObject("apps").directFind({filters: [['space', '=', spaceId],['is_creator', '=', true],['visible', '=', false]]});
        _.each(unvisibleApps, function(unvisibleApp){
            delete _Apps[unvisibleApp.code];
        });

        steedosI18n.translationApps(lng, _Apps);
        result.apps = _Apps;
        let assigned_menus = clone(result.assigned_menus);
        steedosI18n.translationMenus(lng, assigned_menus);
        result.assigned_menus = assigned_menus;

        let _Dashboards = {}
        _.each( result.dashboards, function(dashboard, key){
            if(!dashboard._id){
                dashboard._id = key
            }
            _Dashboards[dashboard._id] = dashboard
        })
        result.dashboards = _Dashboards

        result.plugins = getPlugins ? getPlugins() : null

        let objectsLayout = await getUserProfileObjectsLayout(userId, spaceId);
        _.each(result.objects, function(_object, objectName){
            let userObjectLayout = null;
            if(objectsLayout){
                userObjectLayout = _.find(objectsLayout, function(objectLayout){
                    return objectLayout.object_name === objectName
                })
            }
            if(!userObjectLayout){
                userObjectLayout = getLayout(objectName, 'default');
            }

            if(userObjectLayout){
                let _object = clone(result.objects[userObjectLayout.object_name]);
                if(_object){
                    let _fields = {};
                    _.each(userObjectLayout.fields, function(_item){
                        _fields[_item.field] = _object.fields[_item.field]
                        if(_fields[_item.field]){
                            if(_.has(_item, 'group')){
                                _fields[_item.field].group = _item.group
                            }
                            
                            if(_item.required){
                                _fields[_item.field].readonly = false
                                _fields[_item.field].disabled = false
                                _fields[_item.field].required = true
                            }else if(_item.readonly){
                                _fields[_item.field].readonly = true
                                _fields[_item.field].disabled = true
                                _fields[_item.field].required = false
                            }
                        }
                    })
                    _object.fields = _fields
                    _object.allow_customActions = userObjectLayout.custom_actions || []
                    _object.exclude_actions = userObjectLayout.exclude_actions || []
                    _object.allow_relatedList = userObjectLayout.relatedList || []
                }
                result.objects[userObjectLayout.object_name] = _object
            }
        })
        
        // TODO object layout 是否需要控制审批记录显示？
        let spaceProcessDefinition = await getObject("process_definition").find({filters: [['space', '=', spaceId], ['active', '=', true]]})
        _.each(spaceProcessDefinition, function(item){
            if(result.objects[item.object_name]){
                result.objects[item.object_name].enable_process = true
            }
        })
        return res.status(200).send(result);
    }).run();
}

async function getObjectConfig(objectName, spaceId, userSession) {
    let objectConfig: any = {}
    try {
        let object = getObject(objectName)
        objectConfig = Creator.convertObject(clone(object.toConfig()), spaceId);
        objectConfig.name = objectName
        objectConfig.datasource = object.datasource.name;
        objectConfig.permissions = await object.getUserObjectPermission(userSession);
        return objectConfig;
    } catch (error) {
        console.warn('not load object', objectName)
    }
}
export async function getSpaceObjectBootStrap(req, res) {
    return Fiber(async function () {
        let userSession = req.user;
        let userId = userSession.userId;
        let urlParams = req.params;
        const objectName = urlParams.objectName
        let spaceId = req.headers['x-space-id'] || urlParams.spaceId
        if (!userSession) {
            return res.status(500).send();
        }
        let _object = Creator.getCollection('objects').findOne({ name: objectName }) || {}
        let lng = _getLocale(db.users.findOne(userId, { fields: { locale: 1 } }))
        let objectConfig: any = {}
        if (_.isEmpty(_object)) {
            objectConfig = Creator.getAllPermissions(spaceId, userId).objects[objectName];
            if (_.isEmpty(objectConfig)) {
                objectConfig = await getObjectConfig(objectName, spaceId, userSession);
            }
        } else {
            if (userSession.is_space_admin || _object.in_development == '0' && _object.is_enable) {
                if (_object.datasource == 'default') {
                    objectConfig = Creator.getAllPermissions(spaceId, userId).objects[objectName]
                } else {
                    objectConfig = await getObjectConfig(objectName, spaceId, userSession);
                }
            }
        }
        if (objectConfig) {
            delete objectConfig.db
            // objectConfig.list_views = Creator.getUserObjectListViews(userId, spaceId, objectName)
            steedosI18n.translationObject(lng, objectConfig.name, objectConfig)

            let objectsLayout = await getUserProfileObjectsLayout(userId, spaceId, objectName);

            let userObjectLayout = null;
            if (objectsLayout) {
                userObjectLayout = _.find(objectsLayout, function (objectLayout) {
                    return objectLayout.object_name === objectName
                })
            }
            if (!userObjectLayout) {
                userObjectLayout = getLayout(objectName, 'default');
            }

            if (userObjectLayout) {
                let _fields = {};
                _.each(userObjectLayout.fields, function (_item) {
                    _fields[_item.field] = objectConfig.fields[_item.field]
                    if (_fields[_item.field]) {
                        if (_.has(_item, 'group')) {
                            _fields[_item.field].group = _item.group
                        }
                        if (_item.required) {
                            _fields[_item.field].readonly = false
                            _fields[_item.field].disabled = false
                            _fields[_item.field].required = true
                        } else if (_item.readonly) {
                            _fields[_item.field].readonly = true
                            _fields[_item.field].disabled = true
                            _fields[_item.field].required = false
                        }
                    }
                })
                objectConfig.fields = _fields
                objectConfig.allow_customActions = userObjectLayout.custom_actions || []
                objectConfig.exclude_actions = userObjectLayout.exclude_actions || []
                objectConfig.allow_relatedList = userObjectLayout.relatedList || []
            }

            // TODO object layout 是否需要控制审批记录显示？
            let spaceProcessDefinition = await getObject("process_definition").directFind({ filters: [['space', '=', spaceId], ['object_name', '=', objectName], ['active', '=', true]] })
            if (spaceProcessDefinition.length > 0) {
                objectConfig.enable_process = true
            }
        }
        return res.status(200).send(objectConfig || {});
    }).run();
}

bootStrapExpress.use('/api/bootstrap/:spaceId/:objectName', requireAuthentication, getSpaceObjectBootStrap)
bootStrapExpress.use('/api/bootstrap/:spaceId/', requireAuthentication, getSpaceBootStrap)

