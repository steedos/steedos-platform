const objectql = require("@steedos/objectql");
const steedosI18n = require("@steedos/i18n");
const odataMongodb = require("odata-v4-mongodb");
const clone = require("clone");

const permissions = {
    allowEdit: false,
    allowDelete: false,
    allowRead: true,
}

const objectBaseFields = {
    is_enable: true,
    record_permissions: permissions, 
    is_system:true, 
    in_development: '0'
}

const hiddenObjects = [
    'core',
    'audit_login',
    'autonumber',
    'cfs_files_filerecord',
    'cms_files',
    'connected_apps',
    'object_webhooks',
    'object_workflows',
    'roles',
    'sessions',
    'spaces',
    'chat_messages',
    'chat_rooms',
    'chat_subscriptions',
    'approvals',
    'categories',
    'flow_positions',
    'flow_roles',
    'instance_number_rules',
    'space_user_signs',
    'billing_pay_records',
    'oa_home',
    'datasources',
    'objects',
    'object_actions',
    'object_fields',
    'object_triggers',
    'instances_statistic',
    'process_delegation_rules',
    'webhooks',
    'base',
    'users',
    'flows',
    'forms',
    'instances',
    'settings',
    'object_recent_viewed',
    'OAuth2Clients',
    'OAuth2AccessTokens',
    'follows',
    'favorites',
    'audit_records',
    'users_verify_code',
    'permission_objects',
    'permission_set',
    'permission_shares',
    'picklists',
    'picklist_options',
    'queue_import',
    'object_listviews',
    'notifications',
    'cms_categories',
    'cms_posts',
    'cms_sites'
]

exports.hiddenObjects = hiddenObjects


function parserFilters(filters){
    if(_.isString(filters)){
        filters = odataMongodb.createFilter(filters)
    }
    let query = {};
    if(_.isArray(filters)){
        _.each(filters,function(filter){
            Object.assign(query, parserFilters(filter))
        })
    }else{
        _.each(filters, function (v, k) {
            if (k === '$and') {
                Object.assign(query, parserFilters(v))
            } else {
                Object.assign(query, {[k]: v})
            }
        })
    }
    return query;
}

exports.parserFilters = parserFilters

const getLng = function(userId){
    return Steedos.locale(userId, true);
}

function getObjects(userId){
    let objects = {};
    let lng = getLng(userId)
    _.each(Creator.steedosSchema.getDataSources(), function(datasource, name) {
        var datasourceObjects = datasource.getObjects();
          _.each(datasourceObjects, function(v, k) {
            var _obj = clone(v.toConfig());
            if(!_obj._id && !_obj.hidden &&  !_.include(hiddenObjects, k)){
                _obj._id = k;
                _obj.name = k;
                _obj.datasource = name;
                objects[_obj.name] = Object.assign({}, _obj, objectBaseFields)
            }
          });
      });
      steedosI18n.translationObjects(lng, objects)
      return _.values(objects);
}

exports.getObjects = getObjects

exports.findObjects = function(userId, filters){
    let query = parserFilters(filters);
    let isSystem = query.is_system;
    let datasource = query.datasource;
    let objects = getObjects(userId);

    if(datasource){
        objects = _.filter(objects, function(obj){ return obj.datasource === datasource})
    }

    if(!_.isEmpty(isSystem) || _.isBoolean(isSystem)){
        if(_.isBoolean(isSystem) && isSystem){
            return objects;
        }else{
            return [];
        }
    }else{
        return objects;
    }
}
function getObject(id, userId){
    try {
        let lng = getLng(userId);
        let _object = objectql.getObject(id)
        let object = clone(_object.toConfig());
        object._id = object.name;
        object.datasource = _object.datasource.name;
        steedosI18n.translationObject(lng, object.name, object)
        return Object.assign({}, object, objectBaseFields);
    } catch (error) {
        return null;
    }
}
exports.getObject = getObject

function getObjectFields(objectName, userId){
    let object = getObject(objectName, userId);
    if(object){
        let fields = [];
        _.each(object.fields, function(field){
            if(!field._id){
                fields.push(Object.assign({_id: `${objectName}.${field.name}`, _name: field.name, object: objectName, record_permissions: permissions}, field))
            }
        })
        return fields
    }
}
exports.getObjectFields = getObjectFields

exports.getObjectField = function(objectName, userId, fieldId){
    let fields = getObjectFields(objectName, userId);
    return _.find(fields, function(field){ return field._id === fieldId})
}

function getObjectActions(objectName, userId){
    let object = getObject(objectName, userId);
    if(object){
        let actions = [];
        _.each(object.actions, function(action){
            if(!action._id){
                actions.push(Object.assign({_id: `${objectName}.${action.name}`, _name: action.name, object: objectName, is_enable: true, record_permissions: permissions}, action))
            }
        })
        return actions
    }
}
exports.getObjectActions = getObjectActions

exports.getObjectAction = function(objectName, userId, id){
    let actions = getObjectActions(objectName, userId);
    return _.find(actions, function(action){ return action._id === id})
}

function getTriggerWhen(when){
    switch (when) {
        case 'before.insert':
            return 'beforeInsert'
        case 'after.insert':
            return 'afterInsert'
        case 'before.update':
            return 'beforeUpdate'
        case 'after.update':
            return 'afterUpdate'
        case 'before.remove':
            return 'beforeDelete'
        case 'after.remove':
            return 'afterDelete'
        default:
            return when
    }
}

function getObjectTriggers(objectName, userId){
    let object = getObject(objectName, userId);
    if(object){
        let triggers = [];
        if(Creator.getObject(objectName)){
            _.each(Creator.getObject(objectName).triggers, function(trigger){
                let when = getTriggerWhen(trigger.when);
                triggers.push(Object.assign({_id: `${objectName}.${trigger.name}`, object: objectName, is_enable: true, record_permissions: permissions}, trigger, {when: when, todo: trigger.todo.toString()}))
            })
        }else{
            _.each(object.triggers, function(trigger, _name){
                let name = trigger.name || _name
                triggers.push(Object.assign({_id: `${objectName}.${name}`, name: name, object: objectName, is_enable: true, record_permissions: permissions}, trigger))
            })
        }
        return triggers
    }
}
exports.getObjectTriggers = getObjectTriggers

exports.getObjectTrigger = function(objectName, userId, id){
    let triggers = getObjectTriggers(objectName, userId);
    return _.find(triggers, function(trigger){ return trigger._id === id})
}

function getObjectListViews(objectName, userId){
    let object = getObject(objectName, userId);
    if(object){
        let listViews = [];
        if(Creator.getObject(objectName)){
            _.each(Creator.getObject(objectName).list_views, function(listView){
                if(!listView._id || listView._id === listView.name){
                    listViews.push(Object.assign({}, listView, {_id: `${objectName}.${listView.name}`, object: objectName, is_enable: true, record_permissions: permissions}))
                }
            })
        }else{
            _.each(object.list_views, function(listView, _name){
                if(!listView._id || listView._id === _name){
                    let name = listView.name || _name
                    listViews.push(Object.assign({}, listView, {_id: `${objectName}.${name}`, name: name, object: objectName, is_enable: true, record_permissions: permissions}))
                }
            })
        }
        return listViews
    }
}
exports.getObjectListViews = getObjectListViews

exports.getObjectListView = function(objectName, userId, id){
    let listViews = getObjectListViews(objectName, userId);
    return _.find(listViews, function(listView){ return listView._id === id})
}