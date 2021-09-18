const _ = require('underscore');
const objectql = require("@steedos/objectql");
const odataMongodb = require("odata-v4-mongodb");
const InternalData = require("./core/internalData");
const auth = require("@steedos/auth");

const permissions = {
    allowEdit: false,
    allowDelete: false,
    allowRead: true,
}

const baseRecord = {
    is_system:true,
    record_permissions:permissions
}

const getInternalPermissionObjects = async function(){
    let objectsPermissions = [];
    const datasources = objectql.getSteedosSchema().getDataSources();
    for (const datasourceName in datasources) {
        let datasource = datasources[datasourceName];
        let datasourceObjects = await datasource.getObjects();
        _.each(datasourceObjects, function(object) {
          const objectJSON  = object.metadata;
          const objectName = objectJSON.name;
          if(!objectJSON._id && !objectJSON.hidden && !_.include(InternalData.hiddenObjects, objectName)){
            let permission_set = objectJSON.permission_set
            _.each(permission_set, function(v, code){
                objectsPermissions.push(Object.assign({}, v, {_id: `${code}_${objectName}`, name: `${code}_${objectName}`, permission_set_id: code, object_name: objectName}, baseRecord))
            })
          }
        });
    }
    return objectsPermissions;
}


const getPermissionByFilters = async function(filtersFun){
    let allPer = await getInternalPermissionObjects();
    let pers = []
    _.each(allPer, function(doc){
        if(filtersFun(doc)){
            pers.push(doc)
        }
    })
    return pers;
}

const getPermissionById = async function(id){
    let allPer = await getInternalPermissionObjects();
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

const getSourcePermissionSetsKeys = async function(type){
    switch (type) {
        case 'permission_set':
            return await objectql.getSourcePermissionsetKeys();
        case 'profile':
            return await objectql.getSourceProfilesKeys();
        default:
            return (await objectql.getSourceProfilesKeys()).concat((await objectql.getSourcePermissionsetKeys()))
    }
}

const find = async function(query){
    let filters = parserFilters(odataMongodb.createFilter(query.filters));
    let permissionSetId = filters.permission_set_id;
    let sourcePermissionSetsKeys = await getSourcePermissionSetsKeys();
    if(permissionSetId && !_.include(sourcePermissionSetsKeys, permissionSetId)){
        var dbPerms = await objectql.getObject("permission_set").directFind({filters: ['_id', '=', permissionSetId], fields: ['_id', 'name']});
        var dbPerm = null;
        if(dbPerms && dbPerms.length > 0){
            dbPerm = dbPerms[0];
        }
        if(dbPerm && _.include(sourcePermissionSetsKeys, dbPerm.name)){
            permissionSetId = dbPerm.name
        }
    }
    let objectName = filters.object_name;
    let permissionObjects = await getPermissionByFilters((doc)=>{
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
                this.data.values = await find(this.query);
            }else{
                return ;
            }
            if(isSystem.$ne){
                return 
            }
        }else{
            let permissionObjects = await find(this.query);
            if(_.isArray(this.data.values)){
                let that = this;
                const _ids = [];
                for (const record of that.data.values) {
                    let permission_set_id = record.permission_set_id;
                    if(record && record._id && !_.has(record, 'permission_set_id')){
                        const perObj = await objectql.getObject('permission_objects').findOne(record._id);
                        if(perObj){
                            permission_set_id = perObj.permission_set_id
                        }
                    }
                    const perSet = await objectql.getObject('permission_set').findOne(permission_set_id);
                    if(perSet){
                        const _record = await objectql.getObject('permission_objects').findOne(record._id, {fields: ['object_name']});
                        _ids.push(`${_record.object_name}.${perSet.name}`)
                    }
                }
                _.each(permissionObjects, function(_po){
                    if(!_.include(_ids, `${_po.object_name}.${_po.permission_set_id}`)){
                        that.data.values.push(_po);
                    }
                })
            }
        }
        
    },
    afterAggregate: async function () {
        let filters = parserFilters(odataMongodb.createFilter(this.query.filters));
        let isSystem = filters.is_system;
        if(!_.isEmpty(isSystem) || _.isBoolean(isSystem)){
            if(_.isBoolean(isSystem) && isSystem){
                this.data.values = await find(this.query);
            }else{
                return ;
            }
            if(isSystem.$ne){
                return 
            }
        }else{
            let permissionObjects = await find(this.query);
            if(_.isArray(this.data.values)){
                let that = this;
                const _ids = [];
                for (const record of that.data.values) {
                    let permission_set_id = record.permission_set_id;
                    if(record && record._id && !_.has(record, 'permission_set_id')){
                        const perObj = await objectql.getObject('permission_objects').findOne(record._id);
                        if(perObj){
                            permission_set_id = perObj.permission_set_id
                        }
                    }
                    const perSet = await objectql.getObject('permission_set').findOne(permission_set_id);
                    if(perSet){
                        const _record = await objectql.getObject('permission_objects').findOne(record._id, {fields: ['object_name']});
                        _ids.push(`${_record.object_name}.${perSet.name}`)
                    }
                }
                _.each(permissionObjects, function(_po){
                    if(!_.include(_ids, `${_po.object_name}.${_po.permission_set_id}`)){
                        that.data.values.push(_po);
                    }
                })
            }
        }
        
    },
    afterCount: async function () {
        delete this.query.fields
        let result = await objectql.getObject('permission_objects').find(this.query, await auth.getSessionByUserId(this.userId, this.spaceId))
        this.data.values = result.length
        // let filters = parserFilters(odataMongodb.createFilter(this.query.filters));
        // let isSystem = filters.is_system;
        // if(!_.isEmpty(isSystem) || _.isBoolean(isSystem)){
        //     if(_.isBoolean(isSystem) && isSystem){
        //         this.data.values = find(this.query).length;
        //     }else{
        //         return ;
        //     }
        //     if(isSystem.$ne){
        //         return 
        //     }
        // }else{
        //     let permissionObjects = find(this.query);
        //     let filters = parserFilters(odataMongodb.createFilter(this.query.filters));
        //     let permissionSetId = filters.permission_set_id;
        //     let query = {};
        //     let dbPOsCounts = 0;
        //     if(permissionSetId){
        //         query = {permission_set_id: permissionSetId}
        //         dbPOsCounts = Creator.getCollection("permission_objects").direct.find(query).count();
        //     }
        //     if(permissionObjects.length > 0){
        //         this.data.values = this.data.values + permissionObjects.length - dbPOsCounts
        //     }
        // }
        
    },
    afterFindOne: async function () {
        let id = this.id;
        if(id && _.isEmpty(this.data.values)){
            Object.assign(this.data.values, await getPermissionById(id))
        }
    },
    beforeInsert: function(){
        let doc = this.doc;
        let existedCount = Creator.getCollection("permission_objects").direct.find({permission_set_id: doc.permission_set_id, object_name: doc.object_name, space: doc.space}).count()
        if(existedCount > 0){
            throw new Error("此对象已有权限对象记录")
        }
    },
    beforeUpdate: async function () {
        let oldDoc = Creator.getCollection("permission_objects").direct.findOne({_id: this.id})
        let doc = this.doc;
        let permission_set_id = doc.permission_set_id || oldDoc.permission_set_id
        let object_name = doc.object_name || oldDoc.object_name
        let space = oldDoc.space
        let existedCount = Creator.getCollection("permission_objects").direct.find({permission_set_id: permission_set_id, object_name: object_name, space: space, _id: {$ne: this.id}}).count()
        if(existedCount > 0){
            throw new Error("此对象已有权限对象记录")
        }
    }
}