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

const hiddenObjects = ['core','base','cfs_instances_filerecord'];

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
                _obj.fields = {}
                _.each(getObjectFields(k, userId), function(_f){
                    _obj.fields[_f.name] = _f;
                });
                delete _obj.actions
                delete _obj.triggers
                delete _obj.list_views
                delete _obj.permission_set
                if(_obj.enable_inline_edit !== false){
                    // 默认值配置为true
                    _obj.enable_inline_edit = true;
                }
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
        if(object.enable_inline_edit !== false){
            // 默认值配置为true
            object.enable_inline_edit = true;
        }
        return Object.assign({}, object, objectBaseFields);
    } catch (error) {
        return null;
    }
}
exports.getObject = getObject

function getOriginalObjectFields(objectName){
    return objectql.getOriginalObjectConfig(objectName).fields
}

function getObjectFields(objectName, userId){
    let object = getObject(objectName, userId);
    if(object){
        let fields = [];
        let originalFieldsName = ['created_by', 'modified_by'].concat(_.keys(getOriginalObjectFields(objectName))); //'created', 'modified', 'owner'
        _.each(object.fields, function(field){
            if(!field._id && _.include(originalFieldsName, field.name)){
                fields.push(Object.assign({_id: `${objectName}.${field.name}`, _name: field.name, object: objectName, record_permissions: permissions}, field))
            }
        })
        return fields
    }
}
exports.getObjectFields = getObjectFields

exports.getDefaultSysFields = function(object, userId){
    if(object && (!object.datasource || object.datasource === 'default')){
        let baseObject = getObject('base', userId)
        return _.pick(baseObject.fields, 'created_by', 'modified_by');
    }
}

exports.getObjectField = function(objectName, userId, fieldId){
    let fields = getObjectFields(objectName, userId);
    return _.find(fields, function(field){ return field._id === fieldId})
}

function getOriginalObjectActions(objectName){
    return objectql.getOriginalObjectConfig(objectName).actions || {}
}

function getObjectActions(objectName, userId){
    let object = getObject(objectName, userId);
    if(object){
        let actions = [];
        let originalActions = _.keys(getOriginalObjectActions(objectName))
        _.each(object.actions, function(action){
            if(!action._id && _.include(originalActions, action.name)){ //
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
        let baseTriggers, baseTriggersKey=[];
        if(objectName != 'base' && objectName != 'core'){
            if(object.datasource === 'default'){
                baseTriggers = getObjectTriggers('base', userId);
            }else{
                baseTriggers = getObjectTriggers('core', userId);
            }
            if(baseTriggers){
                baseTriggersKey = _.pluck(baseTriggers, 'name');
            }
        }
        let triggers = [];
        if(Creator.getObject(objectName)){
            _.each(Creator.getObject(objectName).triggers, function(trigger){
                if(!_.include(baseTriggersKey, trigger.name)){
                    let when = getTriggerWhen(trigger.when);
                    triggers.push(Object.assign({_id: `${objectName}.${trigger.name}`, object: objectName, is_enable: true, record_permissions: permissions}, trigger, {when: when, todo: trigger.todo.toString()}))
                }
            })
        }else{
            _.each(object.triggers, function(trigger, _name){
                let name = trigger.name || _name
                if(!_.include(baseTriggersKey, name)){
                    triggers.push(Object.assign({_id: `${objectName}.${name}`, name: name, object: objectName, is_enable: true, record_permissions: permissions}, trigger))
                }
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
        _.each(object.list_views, function(listView, _name){
            if(!listView._id || listView._id === _name){
                let name = listView.name || _name
                listViews.push(Object.assign({}, listView, {_id: `${objectName}.${name}`, name: name, object_name: objectName, is_enable: true, record_permissions: permissions}))
            }
        })
        return listViews
    }
}

function formatListView(listView){
    if(!listView){
        return ;
    }
    let data = clone(listView);
    let columns = [];
    _.each(data.columns, function(column){
        if(_.isString(column)){
            columns.push({field: column})
        }else{
            columns.push(column);
        }
    })
    data.columns = columns;


    let mobile_columns = [];
    _.each(data.mobile_columns, function(column){
        if(_.isString(column)){
            mobile_columns.push({field: column})
        }else{
            mobile_columns.push(column);
        }
    })
    data.mobile_columns = mobile_columns;

    let sort = [];
    _.each(data.sort, function(item){
        if(_.isArray(item)){
            if(item.length == 2){
                sort.push({field_name: item[0], order: item[1]});
            }else if(item.length == 1){
                sort.push({field_name: item[0]});
            }
        }else{
            sort.push(item)
        }
    })
    data.sort = sort;
    return data;
}

exports.getObjectListViews = getObjectListViews

exports.getObjectListView = function(objectName, userId, id){
    let listViews = getObjectListViews(objectName, userId);
    return formatListView(_.find(listViews, function(listView){ return listView._id === id}))
}