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
    'apps',
    'audit_login',
    'autonumber',
    'cfs_files_filerecord',
    'cms_files',
    'company',
    'connected_apps',
    'object_webhooks',
    'object_workflows',
    'organizations',
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
    'space_users',
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

exports.getObjects = function(userId){
    let objects = {};
    let lng = getLng(userId)
    _.each(Creator.steedosSchema.getDataSources(), function(datasource, name) {
        var datasourceObjects = datasource.getObjects();
          _.each(datasourceObjects, function(v, k) {
            var _obj = clone(v.toConfig());
            if(!_obj._id && !_.include(hiddenObjects, k)){
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

function getObject(id, userId){
    try {
        let lng = getLng(userId)
        let object = clone(objectql.getObject(id).toConfig());
        object._id = object.name;
        object.datasource = "default";
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
            fields.push(Object.assign({_id: `${objectName}_${field.name}`, _name: field.name, object: objectName, record_permissions: permissions}, field))
        })
        return fields
    }
}
exports.getObjectFields = getObjectFields

exports.getObjectField = function(objectName, userId, fieldId){
    let fields = getObjectFields(objectName, userId);
    return _.find(fields, function(field){ return field._id === fieldId})
}