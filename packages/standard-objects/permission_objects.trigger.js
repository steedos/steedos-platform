const _ = require('underscore');
const objectql = require("@steedos/objectql");
const odataMongodb = require("odata-v4-mongodb");

const hiddenObjects = [
    'core',
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
    'users_verify_code',
    'users_verify_code',
    'users_verify_code',
    'users_verify_code',
    'users_verify_code',
    'users_verify_code',
]

const permissions = {
    allowEdit: false,
    allowDelete: false,
    allowRead: true,
}

const baseRecord = {
    is_system:true,
    record_permissions:permissions
}

const getInternalPermissionObjects = function(){
    let objectsPermissions = [];
    const datasources = objectql.getSteedosSchema().getDataSources();
    _.each(datasources, function(datasource, name){
        let datasourceObjects = datasource.getObjects();
        _.each(datasourceObjects, function(object, objectName) {
          let objectJSON = object.toConfig();
          if(!objectJSON.hidden && !_.include(hiddenObjects, objectName)){
            let permission_set = objectJSON.permission_set
            _.each(permission_set, function(v, code){
                objectsPermissions.push(Object.assign({}, v, {_id: `${code}_${objectName}`, name: `${code}_${objectName}`, permission_set_id: code, object_name: objectName}, baseRecord))
            })
          }
        });
    })
    return objectsPermissions;
}


const getPermissionByFilters = function(filtersFun){
    let allPer = getInternalPermissionObjects();
    let pers = []
    _.each(allPer, function(doc){
        if(filtersFun(doc)){
            pers.push(doc)
        }
    })
    return pers;
}

const getPermissionById = function(id){
    let allPer = getInternalPermissionObjects();
    return _.find(allPer, (doc)=>{
        return doc._id === id
    })
}

function parserFilters(filters){
    let query = {};
    _.each(filters, function(v,k){
        console.log(v, k);
        if(k === '$and'){
            Object.assign(query, parserFilters(v))
        }else{
            if(_.isArray(v)){
               Object.assign(query, parserFilters(v))
            }else{
                 _.each(v, function(item){
                    Object.assign(query, ...item)
                })
            }
        }
    })
    return query
}

const find = function(query){
    let filters = parserFilters(odataMongodb.createFilter(query.filters));
    console.log('filters', JSON.stringify(filters));
    let permissionSetId = filters.permission_set_id;
    let objectName = filters.object_name;
    let permissionObjects = getPermissionByFilters((doc)=>{
        if(permissionSetId && objectName){
            return permissionSetId === doc.permission_set_id && objectName === doc.object_name
        }
        if(permissionSetId){
            return permissionSetId === doc.permission_set_id
        }
        if(objectName){
            return objectName === doc.object_name
        }
    });
    return permissionObjects;
}

module.exports = {
    afterFind: async function () {
        let permissionObjects = find(this.query);
        if(_.isArray(this.data.values)){
            _.forEach(permissionObjects, (doc)=>{
                this.data.values.unshift(doc)
            })
        }
    },
    afterCount: async function () {
        let permissionObjects = find(this.query);
        this.data.values = this.data.values + permissionObjects.length
    },
    afterFindOne: async function () {
        let id = this.id;
        if(id && _.isEmpty(this.data.values)){
            Object.assign(this.data.values, getPermissionById(id))
        }
    }
}