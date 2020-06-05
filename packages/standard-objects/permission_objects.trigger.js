const _ = require('underscore');
const objectql = require("@steedos/objectql");
const odataMongodb = require("odata-v4-mongodb");
const InternalData = require("./core/internalData");

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
          if(!objectJSON._id && !objectJSON.hidden && !_.include(InternalData.hiddenObjects, objectName)){
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

const find = function(query){
    let filters = parserFilters(odataMongodb.createFilter(query.filters));
    let permissionSetId = filters.permission_set_id;
    if(permissionSetId && !_.include(['admin','user','supplier','customer'], permissionSetId)){
        var dbPerm = Creator.getCollection("permission_set").findOne({_id: permissionSetId}, {fields:{_id:1, name:1}});
        if(dbPerm && _.include(['admin','user','supplier','customer'], dbPerm.name)){
            permissionSetId = dbPerm.name
        }
    }
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
        return true;
    });
    return permissionObjects;
}

module.exports = {
    afterFind: async function () {
        let filters = parserFilters(odataMongodb.createFilter(this.query.filters));
        let isSystem = filters.is_system;
        if(!_.isEmpty(isSystem) || _.isBoolean(isSystem)){
            if(_.isBoolean(isSystem) && isSystem){
                this.data.values = find(this.query);
            }else{
                return ;
            }
            if(isSystem.$ne){
                return 
            }
        }else{
            let permissionObjects = find(this.query);
            if(_.isArray(this.data.values)){
                this.data.values = this.data.values.concat(permissionObjects)
            }
        }
        
    },
    afterCount: async function () {
        let filters = parserFilters(odataMongodb.createFilter(this.query.filters));
        let isSystem = filters.is_system;
        if(!_.isEmpty(isSystem) || _.isBoolean(isSystem)){
            if(_.isBoolean(isSystem) && isSystem){
                this.data.values = find(this.query).length;
            }else{
                return ;
            }
            if(isSystem.$ne){
                return 
            }
        }else{
            let permissionObjects = find(this.query);
            this.data.values = this.data.values + permissionObjects.length
        }
        
    },
    afterFindOne: async function () {
        let id = this.id;
        if(id && _.isEmpty(this.data.values)){
            Object.assign(this.data.values, getPermissionById(id))
        }
    }
}