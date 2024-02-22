const objectql = require("@steedos/objectql");
const register = require("@steedos/metadata-registrar")
const steedosI18n = require("@steedos/i18n");
const odataMongodb = require("@steedos/odata-v4-mongodb");
const clone = require("clone");
const auth = require("@steedos/auth");
const objectsCache = {
}

const getLng = async function(userId){
    const userSession = await auth.getSessionByUserId(userId);
    return userSession ? userSession.language : 'zh-CN';
}
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
    if(_.isArray(filters) && filters.length > 0 && _.isArray(filters[0])){
        _.each(filters,function(filter){
            Object.assign(query, parserFilters(filter))
        })
    }else if(_.isArray(filters) && filters.length > 0){
        if(filters[1] && filters[1] == '='){
            let key = filters[0]
            let value = filters[2]
            Object.assign(query, {[key]: value})
        }else if(filters[1] && (filters[1] == '!=' || filters[1] == '<>')){
            let key = filters[0]
            let value = filters[2]
            Object.assign(query, {[key]: {$ne: value}})
        }else if(filters[1] && filters[1] == 'in'){
            let key = filters[0]
            let value = filters[2]
            Object.assign(query, {[key]: {$in: value}})
        }else{
            _.each(filters,function(filter){
                let parsedFilters = parserFilters(filter);
                if(query._id && query._id.$ne && parsedFilters._id && parsedFilters._id.$ne){
                    parsedFilters._id.$ne = [parsedFilters._id.$ne]
                    parsedFilters._id.$ne = parsedFilters._id.$ne.concat(query._id.$ne);
                    delete query._id;
                }
                Object.assign(query, parsedFilters)
            })
        }
    }else{
        _.each(filters, function (v, k) {
            if(_.isArray(v) && v.length > 0){
                Object.assign(query, parserFilters(v))
            }else{
                if (k === '$and') {
                    Object.assign(query, parserFilters(v))
                } else {
                    if(_.isArray(filters) && _.isObject(v)){
                        Object.assign(query, v)
                    }else{
                        Object.assign(query, {[k]: v})
                    }
                }
            }
            
        })
    }
    return query;
}

exports.parserFilters = parserFilters

async function getObjects(userId){
    let objects = {};
    let lng = await getLng(userId)

    if(objectsCache[lng] && objectsCache[lng].timestamp + 1000 > new Date().getTime()){
        return objectsCache[lng].data;
    }

    let allObjectConfigs = await objectql.getSteedosSchema().getAllObject();
    _.each(allObjectConfigs, function(objectConfig) {
        var _obj = clone(objectConfig.metadata);
        var k = _obj.name;
        if(!_obj._id && !_obj.hidden &&  !_.include(hiddenObjects, k)){
            _obj._id = k;
            _obj.name = k;
            // _obj.datasource = name;
            _obj.fields = {}
            // TODO 测试字段是否齐全
            // _.each(getObjectFields(k, userId), function(_f){
            //     _obj.fields[_f.name] = _f;
            // });
            delete _obj.actions
            delete _obj.triggers
            delete _obj.list_views
            delete _obj.permission_set
            if(_obj.enable_inline_edit !== false){
                // 默认值配置为true
                _obj.enable_inline_edit = true;
            }
            objects[_obj.name] = Object.assign({}, _obj, objectBaseFields, {record_permissions: Object.assign({}, permissions, {allowEdit: false})})
        }
      });
      steedosI18n.translationObjects(lng, objects)
      objectsCache[lng] = {
        data: _.values(objects),
        timestamp: new Date().getTime()
      };
      return objectsCache[lng].data;
    
}

exports.getObjects = getObjects

exports.findObjects = async function(userId, filters){
    let query = parserFilters(filters);
    let isSystem = query.is_system;
    let datasource = query.datasource;
    let name = query.name;
    let _id = query._id;
    let objects = await getObjects(userId);

    if(datasource){
        objects = _.filter(objects, function(obj){ return obj.datasource === datasource})
    }

    if(name){
        objects = _.filter(objects, function(obj){ return obj.name === name})
    }

    if(_id){
        objects = _.filter(objects, function(obj){ return obj._id === _id})
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
async function getObject(id, userId){
    try {
        let lng = await getLng(userId);
        let _object = objectql.getObject(id);

        const records = await objectql.getObject('objects').directFind({filters: [['name', '=', id]]});
        if(records.length > 0){
            if(!records[0].is_enable){
                return null;
            }
        }

        let objectConfig = await _object.toConfig();
        let object = clone(objectConfig);
        object._id = object.name;
        object.datasource = objectConfig.datasource;
        steedosI18n.translationObject(lng, object.name, object)
        if(object.enable_inline_edit !== false){
            // 默认值配置为true
            object.enable_inline_edit = true;
        }
        return Object.assign({}, object, objectBaseFields, {record_permissions: Object.assign({}, permissions, {allowEdit: false})});
    } catch (error) {
        console.log(`error`, error)
        return null;
    }
}
exports.getObject = getObject

async function isDBObject(objectName){
    const records = await objectql.getObject('objects').directFind({filters: [['name', '=', objectName]]});
    if(records.length > 0){
        return true
    }
    return false
}

async function getObjectFields(objectName, userId, all){
    let object = await getObject(objectName, userId);
    if(object){
        let fields = [];
        let originalFieldsName = ['owner', 'created', 'created_by', 'modified', 'modified_by', 'locked', 'company_id', 'company_ids', 'instance_state']//'created', 'modified', 'owner'
        
        const baseObject = register.getObjectConfig('__MONGO_BASE_OBJECT');

        // 从 originalFieldsName 中排出掉 baseObject中的fields
        if(baseObject && baseObject.fields){
            originalFieldsName = originalFieldsName.concat(_.difference(object.originalFields, _.keys(baseObject.fields)));
        }
        const canEditField = await isDBObject(objectName);
        _.each(object.fields, function(field){
            if(!field._id && (all || _.include(originalFieldsName, field.name))){
                fields.push(Object.assign({_id: `${objectName}.${field.name}`, is_system: true, _name: field.name, object: objectName, record_permissions: Object.assign({}, permissions, {allowEdit: canEditField})}, field))
            }
        })
        return fields
    }
}
exports.getObjectFields = getObjectFields

exports.getDefaultSysFields = async function(object, userId){
    if(object && (!object.datasource || object.datasource === 'default' || object.datasource === 'meteor')){
        let baseObject = await getObject('base', userId)
        return _.pick(baseObject.fields, 'owner', 'created', 'created_by', 'modified', 'modified_by', 'locked', 'company_id', 'company_ids', 'instance_state');
    }
}

exports.getObjectField = async function(objectName, userId, fieldId){
    let fields = await getObjectFields(objectName, userId);
    return _.find(fields, function(field){ return field._id === fieldId})
}

async function getObjectActions(objectName, userId){
    let object = await getObject(objectName, userId);
    if(object){
        let actions = [];
        // let originalActions = _.keys(getOriginalObjectActions(objectName))
        _.each(object.actions, function(action){
            // if(!action._id && _.include(originalActions, action.name)){ //
                actions.push(Object.assign({_id: `${objectName}.${action.name}`, is_system: true,_name: action.name, object: objectName, is_enable: true, record_permissions: permissions}, action))
            // }
        })
        return actions
    }
}
exports.getObjectActions = getObjectActions

exports.getObjectLayouts = async function(objectApiName, spaceId){
    const layouts = await objectql.getObjectLayouts(null, spaceId, objectApiName);
    const _layouts = []
    _.each(layouts, function(layout){
        _layouts.push(Object.assign({}, layout, objectBaseFields))
    })
    return _layouts;
}

exports.getObjectLayout = async function(objectLayoutFullName){
    const layout = await objectql.getObjectLayout(objectLayoutFullName);
    return Object.assign({},{_id: `${layout.object_name}.${layout.name}`}, layout, objectBaseFields);
}

exports.getObjectAction = async function(objectName, userId, id){
    let actions = await getObjectActions(objectName, userId);
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

async function getObjectTriggers(objectName, userId){
    let object = await getObject(objectName, userId);
    if(object){
        let baseTriggers, baseTriggersKey=[];
        if(objectName != 'base' && objectName != 'core'){
            if(object.datasource === 'default'){
                baseTriggers = await getObjectTriggers('base', userId);
            }else{
                baseTriggers = await getObjectTriggers('core', userId);
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

exports.getObjectTrigger = async function(objectName, userId, id){
    let triggers = await getObjectTriggers(objectName, userId);
    return _.find(triggers, function(trigger){ return trigger._id === id})
}

async function getObjectListViews(objectName, userId){
    let object = await getObject(objectName, userId);
    if(object){
        let listViews = [];
        _.each(object.list_views, function(listView, _name){
            if(!listView._id || listView._id === _name){
                let name = listView.name || _name
                listViews.push(Object.assign({}, listView, {_id: `${objectName}.${name}`,is_system: true, name: name, object_name: objectName, is_enable: true, record_permissions: permissions}))
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

exports.getObjectListView = async function(objectName, userId, id){
    let listViews = await getObjectListViews(objectName, userId);
    return formatListView(_.find(listViews, function(listView){ return listView._id === id}))
}