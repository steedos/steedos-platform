import steedosI18n = require("@steedos/i18n");
import { getPlugins } from '../';
import { requireAuthentication } from './auth'
import { getObject, getObjectLayouts, getLayout, getAppConfigs, getAssignedMenus, getAssignedApps } from '@steedos/objectql' 
//, FieldPermission
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
        // let filters = [['space', '=', spaceId],['profiles', '=', spaceUser.profile]];
        // if(objectName){
        //     filters.push(['object_name', '=', objectName])
        // }
        // return await getObject("object_layouts").directFind({filters: filters})
        return await getObjectLayouts(spaceUser.profile, spaceId, objectName)
    }
};

async function getUserObjects(userId, spaceId, objects){
    const objectsLayout = await getUserProfileObjectsLayout(userId, spaceId);
    for (const objectName in objects) {
        // objects[objectName].list_views = await getUserObjectListViews(userId, spaceId, objectName)
        let userObjectLayout = null;
        if(objectsLayout){
            userObjectLayout = _.find(objectsLayout, function(objectLayout){
                return objectLayout.object_name === objectName
            })
        }
        if(!userObjectLayout && false){
            userObjectLayout = getLayout(objectName, 'default');
        }
        if(userObjectLayout){
            objects[userObjectLayout.object_name] = await getUserObject(userId, spaceId, objects[userObjectLayout.object_name], userObjectLayout)
        }
    }
}

async function getUserObject(userId, spaceId, object, layout?){
    if(!layout){
        const layouts = await getUserProfileObjectsLayout(userId, spaceId, object.name); 
        if(layouts && layouts.length > 0){
            layout = layouts[0];
        }
    }
    let _object = clone(object);
    if(_object && layout){
        _.each(_object.actions, (action, key) => {
            if (!_.has(action, 'name')) {
                action.name = key;
            }
        });
        let _fields = {};
        let sort_no = 1;
        _.each(layout.fields, function(_item){
            _fields[_item.field_name] = _object.fields[_item.field_name]
            if(_fields[_item.field_name]){
                if(_.has(_item, 'group')){
                    _fields[_item.field_name].group = _item.group
                }
                
                if(_item.is_required){
                    _fields[_item.field_name].readonly = false
                    _fields[_item.field_name].disabled = false
                    _fields[_item.field_name].required = true
                }else if(_item.is_readonly){
                    _fields[_item.field_name].readonly = true
                    _fields[_item.field_name].disabled = true
                    _fields[_item.field_name].required = false
                }

                if(_item.visible_on){
                    _fields[_item.field_name].visible_on = _item.visible_on
                }

                if(['created','created_by','modified','modified_by'].indexOf(_item.field_name) < 0){
                    _fields[_item.field_name].omit = false;
                    _fields[_item.field_name].hidden = false;
                }

                _fields[_item.field_name].sort_no = sort_no;
                sort_no++;
            }
        })

        const layoutFieldKeys = _.keys(_fields);
        const objectFieldKeys = _.keys(_object.fields);

        const difference = _.difference(objectFieldKeys, layoutFieldKeys);

        _.each(layoutFieldKeys, function(fieldApiName){
            _object.fields[fieldApiName] = _fields[fieldApiName];
        })
        
        _.each(difference, function(fieldApiName){
            _object.fields[fieldApiName].hidden = true;
            _object.fields[fieldApiName].sort_no = 99999;
        })

        // let _buttons = {};
        _.each(layout.buttons, function(button){
            const action = _object.actions[button.button_name];
            if(action){
                if(button.visible_on){
                    action._visible = button.visible_on;
                }
                // _buttons[button.button_name] = action
            }
        })

        const layoutButtonsName = _.pluck(layout.buttons,'button_name');
        _.each(_object.actions, function(action){
            if(!_.include(layoutButtonsName, action.name)){
                action.visible = false
                action._visible = function(){return false}.toString()
            }
        })

        // _object.actions = _buttons;
        // _object.allow_customActions = userObjectLayout.custom_actions || []
        // _object.exclude_actions = userObjectLayout.exclude_actions || []
        _object.related_lists = layout.related_lists || []
        _.each(_object.related_lists, (related_list)=>{
            if(related_list.sort_field_name && _.isArray(related_list.sort_field_name) && related_list.sort_field_name.length > 0){
                related_list.sort = [];
                _.each(related_list.sort_field_name, (fName)=>{
                    related_list.sort.push({field_name: fName, order: related_list.sort_order || 'asc'})
                })
            }
        })
    }
    return _object;
}


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
        //TODO 无需再从getAllPermissions中获取用户的对象权限
        let result = Creator.getAllPermissions(spaceId, userId);
        let lng = _getLocale(db.users.findOne(userId, { fields: { locale: 1 } }))
        steedosI18n.translationObjects(lng, result.objects);
        result.user = userSession

        result.space = space

        result.dashboards = clone(Creator.Dashboards)

        result.object_workflows = Meteor.call('object_workflows.get', spaceId, userId)
        result.object_listviews = await getUserObjectsListViews(userId, spaceId)
        // result.apps = clone(Creator.Apps)
        result.apps = await getAppConfigs(spaceId);
        result.assigned_apps = await getAssignedApps(userSession);
        let datasources = Creator.steedosSchema.getDataSources();
        // for (const datasourceName in datasources) {
        //     if(datasourceName != 'default'){
        //         let datasource = datasources[datasourceName];
        //         const datasourceObjects = datasource.getObjects();
        //         for (const objectName in datasourceObjects) {
        //             const object = datasourceObjects[objectName];
        //             const _obj = Creator.convertObject(clone(object.toConfig()), spaceId)
        //             _obj.name = objectName
        //             _obj.database_name = datasourceName
        //             _obj.permissions = await object.getUserObjectPermission(userSession)
        //             result.objects[_obj.name] = _obj
        //         }
        //     }
        // }
        const spaceProcessDefinition = await getObject("process_definition").find({ filters: [['space', '=', spaceId], ['active', '=', true]] })
        const spaceObjectsProcessDefinition = _.groupBy(spaceProcessDefinition, 'object_name');

        const dbListViews = await getObject("object_listviews").directFind({ filters: [['space', '=', userSession.spaceId], [['owner', '=', userSession.userId], 'or', ['shared', '=', true]]] })
        const dbObjectsListViews = _.groupBy(dbListViews, 'object_name');

        const layouts = await getObjectLayouts(userSession.profile, spaceId)
        const objectsLayouts = _.groupBy(layouts, 'object_name');
        // const objectsFieldsPermissionGroupRole = await FieldPermission.getObjectsFieldsPermissionGroupRole();
        // console.log('objectsFieldsPermissionGroupRole', false && objectsFieldsPermissionGroupRole);
        for (const datasourceName in datasources) {
            let datasource = datasources[datasourceName];
            const datasourceObjects = await datasource.getObjects();
            for (const object of datasourceObjects) {
                const objectConfig  = object.metadata;
                if (!result.objects[objectConfig.name] || objectConfig.name.endsWith("__c")) {
                    try {
                        const userObjectConfig = await getObject(objectConfig.name).getRecordView(userSession, {
                            // objectConfig: objectConfig,
                            layouts: objectsLayouts[objectConfig.name] || [],
                            spaceProcessDefinition: spaceObjectsProcessDefinition[objectConfig.name] || [],
                            dbListViews: dbObjectsListViews[objectConfig.name] || [],
                            // rolesFieldsPermission: objectsFieldsPermissionGroupRole[objectConfig.name] || []
                        });
                        let _objectConfig = null;
                        if (userObjectConfig) {
                            _objectConfig = userObjectConfig
                        } else {
                            _objectConfig = clone(objectConfig)
                        }
                        const _obj = Creator.convertObject(_objectConfig, spaceId)
                        _obj.name = objectConfig.name
                        _obj.database_name = datasourceName
                        if (userObjectConfig) {
                            _obj.permission = userObjectConfig.permissions
                        } else {
                            _obj.permissions = await getObject(objectConfig.name).getUserObjectPermission(userSession)
                            steedosI18n.translationObject(lng, _obj.name, _obj);
                        }
                        result.objects[_obj.name] = _obj
                    } catch (error) {
                        console.error(error.message)
                    }
                }
            }
        }
        // _.each(Creator.steedosSchema.getDataSources(), function(datasource, name){
        //     result.apps = _.extend(result.apps, clone(datasource.getAppsConfig()))
        //     result.dashboards = _.extend(result.dashboards, datasource.getDashboardsConfig())
        // })

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
        let assigned_menus = await getAssignedMenus(userSession);
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
        await getUserObjects(userId, spaceId, result.objects);
        // TODO object layout 是否需要控制审批记录显示？

        _.each(spaceProcessDefinition, function(item){
            if(result.objects[item.object_name]){
                result.objects[item.object_name].enable_process = true
            }
        })
        for (const key in result.objects) {
            if (Object.prototype.hasOwnProperty.call(result.objects, key)) {
                const objectConfig = result.objects[key];
                try {
                    const object = getObject(key);
                    const relationsInfo = await object.getRelationsInfo();
                    objectConfig.details = relationsInfo.details;
                    objectConfig.masters = relationsInfo.masters;
                    objectConfig.lookup_details = relationsInfo.lookup_details;
                    _.each(objectConfig.triggers, function(trigger, key){
                        if(trigger?.on != 'client'){
                            delete objectConfig.triggers[key];
                        }
                    })
                    delete objectConfig.listeners
                    delete objectConfig.__filename
                    delete objectConfig.extend
                } catch (error) {
                    
                }
            }
        }
        return res.status(200).send(result);
    }).run();
}

async function getObjectConfig(objectName, spaceId, userSession) {
    let objectConfig: any = {}
    try {
        let object = getObject(objectName)
        let _objectConfig = null;
        const userObjectConfig = await object.getRecordView(userSession);
        if (userObjectConfig) {
            _objectConfig = userObjectConfig
        } else {
            _objectConfig = clone(object.toConfig())
        }
        objectConfig = Creator.convertObject(_objectConfig, spaceId);
        objectConfig.name = objectName
        objectConfig.datasource = object.datasource.name;
        objectConfig.permissions = await object.getUserObjectPermission(userSession);
        const relationsInfo = await object.getRelationsInfo();
        objectConfig.details = relationsInfo.details;
        objectConfig.masters = relationsInfo.masters;
        objectConfig.lookup_details = relationsInfo.lookup_details;
        return objectConfig;
    } catch (error) {
        console.warn('not load object', objectName)
    }
}

async function getUserObjectsListViews(userId, spaceId) {
    const listViews = {};
    const objectsViews = await getObject("object_listviews").find({filters: [['space', '=', spaceId],[ [ "owner", "=", userId ], "or", [ "shared", "=", true ] ]]});
    let objectNames = _.pluck(objectsViews, 'object_name');
    objectNames = _.uniq(objectNames);
    const _getUserObjectListViews = function(object_name) {
      var _user_object_list_views, olistViews;
      _user_object_list_views = {};
      olistViews = _.filter(objectsViews, function(ov) {
        return ov.object_name === object_name;
      });
      _.each(olistViews, function(listview) {
        return _user_object_list_views[listview._id] = listview;
      });
      return _user_object_list_views;
    };
    _.forEach(objectNames, function(key) {
      var list_view;
      list_view = _getUserObjectListViews(key);
      if (!_.isEmpty(list_view)) {
        return listViews[key] = list_view;
      }
    });
    return listViews;
  };

// async function getUserObjectListViews(userId, spaceId, object_name){
//     const _user_object_list_views = {};
//     const object_listview = await getObject("object_listviews").find({filters: [['object_name', '=', object_name],['space', '=', spaceId],[ [ "owner", "=", userId ], "or", [ "shared", "=", true ] ]]});
//     object_listview.forEach(function(listview) {
//       return _user_object_list_views[listview._id] = listview;
//     });
//     return _user_object_list_views;
// }

export async function getSpaceObjectBootStrap(req, res) {
    return Fiber(async function () {
        let userSession = req.user;
        let userId = userSession.userId;
        let urlParams = req.params;
        let spaceId = req.headers['x-space-id'] || urlParams.spaceId
        if (!userSession) {
            return res.status(500).send();
        }
        const objectNames = urlParams.objectNames
        const objects = {};
        if (objectNames) {
            const objectNamesArray = objectNames.split(',');
            let dbObjects = Creator.getCollection('objects').find({ name: { $in: objectNamesArray } }).fetch() || []
            let creatorObjects = Creator.getAllPermissions(spaceId, userId).objects;
            let lng = _getLocale(db.users.findOne(userId, { fields: { locale: 1 } }))
            for (const objectName of objectNamesArray) {
                let _object = _.find(dbObjects, function (item) { return item.name === objectName }) || {}
                let objectConfig: any = {}
                if (_.isEmpty(_object)) {
                    objectConfig = creatorObjects[objectName];
                    if (_.isEmpty(objectConfig)) {
                        objectConfig = await getObjectConfig(objectName, spaceId, userSession);
                    } else {
                        const object = getObject(objectName);
                        const relationsInfo = await object.getRelationsInfo();
                        objectConfig.details = relationsInfo.details;
                        objectConfig.masters = relationsInfo.masters;
                        objectConfig.lookup_details = relationsInfo.lookup_details;
                    }
                } else {
                    if (userSession.is_space_admin || _object.in_development == '0' && _object.is_enable) {
                        if (_object.datasource == 'meteor') {
                            objectConfig = creatorObjects[objectName]
                            const object = getObject(objectName);
                            const relationsInfo = await object.getRelationsInfo();
                            objectConfig.details = relationsInfo.details;
                            objectConfig.masters = relationsInfo.masters;
                            objectConfig.lookup_details = relationsInfo.lookup_details;
                        } else {
                            objectConfig = await getObjectConfig(objectName, spaceId, userSession);
                        }
                    }
                }
                if (objectConfig) {
                    delete objectConfig.db
                    // objectConfig.list_views = await getUserObjectListViews(userId, spaceId, objectName)
                    steedosI18n.translationObject(lng, objectConfig.name, objectConfig)

                    objectConfig = await getUserObject(userId, spaceId, objectConfig)

                    // TODO object layout 是否需要控制审批记录显示？
                    let spaceProcessDefinition = await getObject("process_definition").directFind({ filters: [['space', '=', spaceId], ['object_name', '=', objectName], ['active', '=', true]] })
                    if (spaceProcessDefinition.length > 0) {
                        objectConfig.enable_process = true
                    }

                    _.each(objectConfig.triggers, function (trigger, key) {
                        if (trigger?.on != 'client') {
                            delete objectConfig.triggers[key];
                        }
                    })

                    delete objectConfig.listeners
                    delete objectConfig.__filename
                    delete objectConfig.extend
                    objects[objectConfig.name] = objectConfig;
                }
            }
        }
        return res.status(200).send({
            objects: objects
        });
    }).run();
}

bootStrapExpress.use('/api/bootstrap/:spaceId/:objectNames', requireAuthentication, getSpaceObjectBootStrap)
bootStrapExpress.use('/api/bootstrap/:spaceId/', requireAuthentication, getSpaceBootStrap)

