"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSpaceObjectBootStrap = exports.getSpaceBootStrap = void 0;
const tslib_1 = require("tslib");
const steedosI18n = require("@steedos/i18n");
const core_1 = require("@steedos/core");
const objectql_1 = require("@steedos/objectql");
require("@steedos/license");
const Fiber = require('fibers');
const clone = require("clone");
const _ = require('underscore');
const express = require('express');
const router = express.Router();
function getUserProfileObjectsLayout(userId, spaceId, objectName) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let spaceUser;
        let spaceUsers = yield (0, objectql_1.getObject)("space_users").directFind({ filters: [['space', '=', spaceId], ['user', '=', userId]] });
        if (spaceUsers.length > 0) {
            spaceUser = spaceUsers[0];
        }
        if (spaceUser && spaceUser.profile) {
            return yield (0, objectql_1.getObjectLayouts)(spaceUser.profile, spaceId, objectName);
        }
    });
}
;
function getUserObjects(userId, spaceId, objects) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const objectsLayout = yield getUserProfileObjectsLayout(userId, spaceId);
        for (const objectName in objects) {
            let userObjectLayout = null;
            if (objectsLayout) {
                userObjectLayout = _.find(objectsLayout, function (objectLayout) {
                    return objectLayout.object_name === objectName;
                });
            }
            if (!userObjectLayout && false) {
                userObjectLayout = (0, objectql_1.getLayout)(objectName, 'default');
            }
            if (userObjectLayout) {
                objects[userObjectLayout.object_name] = yield getUserObject(userId, spaceId, objects[userObjectLayout.object_name], userObjectLayout);
            }
        }
    });
}
function getUserObject(userId, spaceId, object, layout) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (!layout) {
            const layouts = yield getUserProfileObjectsLayout(userId, spaceId, object.name);
            if (layouts && layouts.length > 0) {
                layout = layouts[0];
            }
        }
        let _object = clone(object);
        if (_object && layout) {
            _.each(_object.actions, (action, key) => {
                if (!_.has(action, 'name')) {
                    action.name = key;
                }
            });
            let _fields = {};
            let sort_no = 1;
            _.each(layout.fields, function (_item) {
                _fields[_item.field_name] = _object.fields[_item.field_name];
                if (_fields[_item.field_name]) {
                    if (_.has(_item, 'group')) {
                        _fields[_item.field_name].group = _item.group;
                    }
                    if (_item.is_required) {
                        _fields[_item.field_name].readonly = false;
                        _fields[_item.field_name].disabled = false;
                        _fields[_item.field_name].required = true;
                    }
                    else if (_item.is_readonly) {
                        _fields[_item.field_name].readonly = true;
                        _fields[_item.field_name].disabled = true;
                        _fields[_item.field_name].required = false;
                    }
                    if (_item.visible_on) {
                        _fields[_item.field_name].visible_on = _item.visible_on;
                    }
                    if (['created', 'created_by', 'modified', 'modified_by'].indexOf(_item.field_name) < 0) {
                        _fields[_item.field_name].omit = false;
                        _fields[_item.field_name].hidden = false;
                    }
                    _fields[_item.field_name].sort_no = sort_no;
                    sort_no++;
                }
            });
            const layoutFieldKeys = _.keys(_fields);
            const objectFieldKeys = _.keys(_object.fields);
            const difference = _.difference(objectFieldKeys, layoutFieldKeys);
            _.each(layoutFieldKeys, function (fieldApiName) {
                _object.fields[fieldApiName] = _fields[fieldApiName];
            });
            _.each(difference, function (fieldApiName) {
                _object.fields[fieldApiName].hidden = true;
                _object.fields[fieldApiName].sort_no = 99999;
            });
            _.each(layout.buttons, function (button) {
                const action = _object.actions[button.button_name];
                if (action) {
                    if (button.visible_on) {
                        action._visible = button.visible_on;
                    }
                }
            });
            const layoutButtonsName = _.pluck(layout.buttons, 'button_name');
            _.each(_object.actions, function (action) {
                if (!_.include(layoutButtonsName, action.name)) {
                    action.visible = false;
                    action._visible = function () { return false; }.toString();
                }
            });
            _object.related_lists = layout.related_lists || [];
            _.each(_object.related_lists, (related_list) => {
                if (related_list.sort_field_name && _.isArray(related_list.sort_field_name) && related_list.sort_field_name.length > 0) {
                    related_list.sort = [];
                    _.each(related_list.sort_field_name, (fName) => {
                        related_list.sort.push({ field_name: fName, order: related_list.sort_order || 'asc' });
                    });
                }
            });
        }
        return _object;
    });
}
function getSpaceBootStrap(req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return Fiber(function () {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                let userSession = req.user;
                if (!userSession) {
                    return res.status(500).send();
                }
                let urlParams = req.params;
                const { userId, language: lng } = userSession;
                let spaceId = req.headers['x-space-id'] || urlParams.spaceId;
                let [space, object_listviews, apps, assigned_apps, spaceProcessDefinition, dbListViews, layouts, objectsFieldsPermissionGroupRole, allRelationsInfo, _dbApps, _dbDashboards, assigned_menus, allImportTemplates] = yield Promise.all([
                    (0, objectql_1.getObject)("spaces").findOne(spaceId, { fields: ['name'] }),
                    getUserObjectsListViews(userId, spaceId),
                    (0, objectql_1.getAppConfigs)(spaceId),
                    (0, objectql_1.getAssignedApps)(userSession),
                    (0, objectql_1.getObject)("process_definition").find({ filters: [['space', '=', spaceId], ['active', '=', true]] }),
                    (0, objectql_1.getObject)("object_listviews").directFind({ filters: [['space', '=', userSession.spaceId], [['owner', '=', userSession.userId], 'or', ['shared', '=', true]]] }),
                    (0, objectql_1.getObjectLayouts)(userSession.profile, spaceId),
                    objectql_1.FieldPermission.getObjectsFieldsPermissionGroupRole(),
                    (0, objectql_1.getAllRelationsInfo)(),
                    (0, objectql_1.getObject)("apps").directFind({ filters: [['space', '=', spaceId], ['is_creator', '=', true]] }),
                    (0, objectql_1.getObject)("dashboard").directFind({ filters: [['space', '=', spaceId]] }),
                    (0, objectql_1.getAssignedMenus)(userSession),
                    (0, objectql_1.getSteedosSchema)().broker.call(`~packages-@steedos/data-import.getAllImportTemplates`, {}, { meta: { user: userSession } })
                ]);
                let result = Creator.getAllPermissions(spaceId, userId);
                steedosI18n.translationObjects(lng, result.objects);
                result.user = userSession;
                result.space = space;
                result.dashboards = clone(Creator.Dashboards);
                result.object_workflows = Meteor.call('object_workflows.get', spaceId, userId);
                result.object_listviews = object_listviews;
                result.apps = apps;
                result.assigned_apps = assigned_apps;
                let datasources = Creator.steedosSchema.getDataSources();
                const spaceObjectsProcessDefinition = _.groupBy(spaceProcessDefinition, 'object_name');
                const dbObjectsListViews = _.groupBy(dbListViews, 'object_name');
                const objectsLayouts = _.groupBy(layouts, 'object_name');
                for (const datasourceName in datasources) {
                    let datasource = datasources[datasourceName];
                    const datasourceObjects = yield datasource.getObjects();
                    for (const object of datasourceObjects) {
                        const objectConfig = object.metadata;
                        if (!result.objects[objectConfig.name] || objectConfig.name.endsWith("__c")) {
                            try {
                                const userObjectConfig = yield (0, objectql_1.getObject)(objectConfig.name).getRecordView(userSession, {
                                    objectConfig: objectConfig,
                                    layouts: objectsLayouts[objectConfig.name] || [],
                                    spaceProcessDefinition: spaceObjectsProcessDefinition[objectConfig.name] || [],
                                    dbListViews: dbObjectsListViews[objectConfig.name] || [],
                                    rolesFieldsPermission: objectsFieldsPermissionGroupRole[objectConfig.name] || [],
                                    relationsInfo: {
                                        details: _.map(_.filter(allRelationsInfo.details, { objectName: objectConfig.name }), 'key'),
                                        masters: _.map(_.filter(allRelationsInfo.masters, { objectName: objectConfig.name }), 'key'),
                                        lookup_details: _.map(_.filter(allRelationsInfo.lookup_details, { objectName: objectConfig.name }))
                                    }
                                });
                                let _objectConfig = null;
                                if (userObjectConfig) {
                                    _objectConfig = userObjectConfig;
                                }
                                else {
                                    _objectConfig = clone(objectConfig);
                                }
                                const _obj = Creator.convertObject(_objectConfig, spaceId);
                                _obj.name = objectConfig.name;
                                _obj.database_name = datasourceName;
                                if (userObjectConfig) {
                                    _obj.permission = userObjectConfig.permissions;
                                }
                                else {
                                    _obj.permissions = yield (0, objectql_1.getObject)(objectConfig.name).getUserObjectPermission(userSession);
                                    steedosI18n.translationObject(lng, _obj.name, _obj);
                                }
                                result.objects[_obj.name] = _obj;
                            }
                            catch (error) {
                                console.error(error.message);
                            }
                        }
                    }
                }
                let dbApps = {};
                _.each(_dbApps, function (dbApp) {
                    if (dbApp.visible) {
                        return dbApps[dbApp._id] = dbApp;
                    }
                });
                result.apps = _.extend(result.apps || {}, dbApps);
                let dbDashboards = {};
                _.each(_dbDashboards, function (dashboard) {
                    dbDashboards[dashboard._id] = dashboard;
                });
                result.dashboards = _.extend(result.dashboards || {}, dbDashboards);
                let _Apps = {};
                _.each(result.apps, function (app, key) {
                    if (!app._id) {
                        app._id = key;
                    }
                    if (app.code) {
                        app._dbid = app._id;
                        app._id = app.code;
                    }
                    _Apps[app._id] = app;
                });
                _.each(_dbApps, function (dbApp) {
                    if (dbApp.visible === false) {
                        delete _Apps[dbApp.code];
                    }
                });
                steedosI18n.translationApps(lng, _Apps);
                result.apps = _Apps;
                steedosI18n.translationMenus(lng, assigned_menus);
                result.assigned_menus = assigned_menus;
                let _Dashboards = {};
                _.each(result.dashboards, function (dashboard, key) {
                    if (!dashboard._id) {
                        dashboard._id = key;
                    }
                    _Dashboards[dashboard._id] = dashboard;
                });
                result.dashboards = _Dashboards;
                result.plugins = core_1.getPlugins ? (0, core_1.getPlugins)() : null;
                yield getUserObjects(userId, spaceId, result.objects);
                _.each(spaceProcessDefinition, function (item) {
                    if (result.objects[item.object_name]) {
                        result.objects[item.object_name].enable_process = true;
                    }
                });
                for (const key in result.objects) {
                    if (Object.prototype.hasOwnProperty.call(result.objects, key)) {
                        const objectConfig = result.objects[key];
                        objectConfig.hasImportTemplates = !_.isEmpty(_.find(allImportTemplates, (item) => { return item.object_name === key; }));
                        try {
                            objectConfig.details = _.map(_.filter(allRelationsInfo.details, { objectName: key }), 'key');
                            objectConfig.masters = _.map(_.filter(allRelationsInfo.masters, { objectName: key }), 'key');
                            objectConfig.lookup_details = _.map(_.filter(allRelationsInfo.lookup_details, { objectName: key }));
                            _.each(objectConfig.triggers, function (trigger, key) {
                                if ((trigger === null || trigger === void 0 ? void 0 : trigger.on) != 'client') {
                                    delete objectConfig.triggers[key];
                                }
                            });
                            delete objectConfig.listeners;
                            delete objectConfig.__filename;
                            delete objectConfig.extend;
                        }
                        catch (error) {
                        }
                    }
                }
                return res.status(200).send(result);
            });
        }).run();
    });
}
exports.getSpaceBootStrap = getSpaceBootStrap;
function getObjectConfig(objectName, spaceId, userSession) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let objectConfig = {};
        try {
            let object = (0, objectql_1.getObject)(objectName);
            let _objectConfig = null;
            const userObjectConfig = yield object.getRecordView(userSession);
            if (userObjectConfig) {
                _objectConfig = userObjectConfig;
            }
            else {
                _objectConfig = clone(object.toConfig());
            }
            objectConfig = Creator.convertObject(_objectConfig, spaceId);
            objectConfig.name = objectName;
            objectConfig.datasource = object.datasource.name;
            objectConfig.permissions = yield object.getUserObjectPermission(userSession);
            const relationsInfo = yield object.getRelationsInfo();
            objectConfig.details = relationsInfo.details;
            objectConfig.masters = relationsInfo.masters;
            objectConfig.lookup_details = relationsInfo.lookup_details;
            return objectConfig;
        }
        catch (error) {
            console.warn('not load object', objectName);
        }
    });
}
function getUserObjectsListViews(userId, spaceId) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const listViews = {};
        const objectsViews = yield (0, objectql_1.getObject)("object_listviews").find({ filters: [['space', '=', spaceId], [["owner", "=", userId], "or", ["shared", "=", true]]] });
        let objectNames = _.pluck(objectsViews, 'object_name');
        objectNames = _.uniq(objectNames);
        const _getUserObjectListViews = function (object_name) {
            var _user_object_list_views, olistViews;
            _user_object_list_views = {};
            olistViews = _.filter(objectsViews, function (ov) {
                return ov.object_name === object_name;
            });
            _.each(olistViews, function (listview) {
                return _user_object_list_views[listview._id] = listview;
            });
            return _user_object_list_views;
        };
        _.forEach(objectNames, function (key) {
            var list_view;
            list_view = _getUserObjectListViews(key);
            if (!_.isEmpty(list_view)) {
                return listViews[key] = list_view;
            }
        });
        return listViews;
    });
}
;
function getSpaceObjectBootStrap(req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return Fiber(function () {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                let userSession = req.user;
                let userId = userSession.userId;
                let urlParams = req.params;
                let spaceId = req.headers['x-space-id'] || urlParams.spaceId;
                if (!userSession) {
                    return res.status(500).send();
                }
                const objectNames = urlParams.objectNames;
                const objects = {};
                if (objectNames) {
                    const objectNamesArray = objectNames.split(',');
                    let dbObjects = Creator.getCollection('objects').find({ name: { $in: objectNamesArray } }).fetch() || [];
                    let creatorObjects = Creator.getAllPermissions(spaceId, userId).objects;
                    let lng = userSession.language;
                    for (const objectName of objectNamesArray) {
                        let _object = _.find(dbObjects, function (item) { return item.name === objectName; }) || {};
                        let objectConfig = {};
                        if (_.isEmpty(_object)) {
                            objectConfig = creatorObjects[objectName];
                            if (_.isEmpty(objectConfig)) {
                                objectConfig = yield getObjectConfig(objectName, spaceId, userSession);
                            }
                            else {
                                const object = (0, objectql_1.getObject)(objectName);
                                const relationsInfo = yield object.getRelationsInfo();
                                objectConfig.details = relationsInfo.details;
                                objectConfig.masters = relationsInfo.masters;
                                objectConfig.lookup_details = relationsInfo.lookup_details;
                            }
                        }
                        else {
                            if (userSession.is_space_admin || _object.in_development == '0' && _object.is_enable) {
                                if (_object.datasource == 'meteor') {
                                    objectConfig = creatorObjects[objectName];
                                    const object = (0, objectql_1.getObject)(objectName);
                                    const relationsInfo = yield object.getRelationsInfo();
                                    objectConfig.details = relationsInfo.details;
                                    objectConfig.masters = relationsInfo.masters;
                                    objectConfig.lookup_details = relationsInfo.lookup_details;
                                }
                                else {
                                    objectConfig = yield getObjectConfig(objectName, spaceId, userSession);
                                }
                            }
                        }
                        if (objectConfig) {
                            delete objectConfig.db;
                            steedosI18n.translationObject(lng, objectConfig.name, objectConfig);
                            objectConfig = yield getUserObject(userId, spaceId, objectConfig);
                            let spaceProcessDefinition = yield (0, objectql_1.getObject)("process_definition").directFind({ filters: [['space', '=', spaceId], ['object_name', '=', objectName], ['active', '=', true]] });
                            if (spaceProcessDefinition.length > 0) {
                                objectConfig.enable_process = true;
                            }
                            _.each(objectConfig.triggers, function (trigger, key) {
                                if ((trigger === null || trigger === void 0 ? void 0 : trigger.on) != 'client') {
                                    delete objectConfig.triggers[key];
                                }
                            });
                            objectConfig.hasImportTemplates = yield (0, objectql_1.getSteedosSchema)().broker.call(`~packages-@steedos/data-import.hasImportTemplates`, {
                                objectName: objectConfig.name
                            }, { meta: { user: userSession } });
                            delete objectConfig.listeners;
                            delete objectConfig.__filename;
                            delete objectConfig.extend;
                            objects[objectConfig.name] = objectConfig;
                        }
                    }
                }
                return res.status(200).send({
                    objects: objects
                });
            });
        }).run();
    });
}
exports.getSpaceObjectBootStrap = getSpaceObjectBootStrap;
router.use('/api/bootstrap/:spaceId/:objectNames', core_1.requireAuthentication, getSpaceObjectBootStrap);
router.use('/api/bootstrap/:spaceId/', core_1.requireAuthentication, getSpaceBootStrap);
exports.default = router;
