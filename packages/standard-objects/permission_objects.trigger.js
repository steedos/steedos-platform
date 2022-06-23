const _ = require('underscore');
const objectql = require("@steedos/objectql");
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


const initPermissionSet = async function(doc, userId, spaceId){
    const userSession = await auth.getSessionByUserId(userId, spaceId);
    if(!doc.permission_set_id){
        throw new Error('权限集不能为空')
    }
    
    const permissionSet = await objectql.getObject('permission_set').findOne(doc.permission_set_id)
    
    if(!permissionSet){
        throw new Error('无效的权限集')
    }
    
    if(permissionSet._id === permissionSet.name){
        const now = new Date();
        const dbPermissionSet = await objectql.getObject('permission_set').insert({
            name: permissionSet.name, 
            label: permissionSet.label, 
            type: permissionSet.type, 
            license: permissionSet.license,
            space: spaceId,
            owner: userId,
            created_by: userId,
            created: now,
            modified_by: userId,
            modified: now,
            company_id: userSession.company_id,
            company_ids: userSession.company_ids
        })
        doc.permission_set_id = dbPermissionSet._id;
    }
} 

module.exports = {
    beforeFind: async function () {
        delete this.query.fields;
    },

    beforeAggregate: async function () {
        delete this.query.fields;
    },

    afterFind: async function(){
        const { spaceId } = this;
        let dataList = await getInternalPermissionObjects();
        if (!_.isEmpty(dataList)) {
            dataList.forEach((doc) => {
                if (!_.find(this.data.values, (value) => {
                    return value.name === doc.name
                })) {
                    this.data.values.push(doc);
                }
            })
            const records = objectql.getSteedosSchema().metadataDriver.find(this.data.values, this.query, spaceId);
            if (records.length > 0) {
                this.data.values = records;
            } else {
                this.data.values.length = 0;
            }
        }

    },
    afterAggregate: async function(){
        const { spaceId } = this;
        let dataList = await getInternalPermissionObjects();
        if (!_.isEmpty(dataList)) {
            dataList.forEach((doc) => {
                if (!_.find(this.data.values, (value) => {
                    return value.name === doc.name
                })) {
                    this.data.values.push(doc);
                }
            })
            const records = objectql.getSteedosSchema().metadataDriver.find(this.data.values, this.query, spaceId);
            if (records.length > 0) {
                this.data.values = records;
            } else {
                this.data.values.length = 0;
            }
        }
    },
    afterCount: async function(){
        delete this.query.fields;
        let result = await objectql.getObject(this.object_name).find(this.query, await auth.getSessionByUserId(this.userId, this.spaceId))
        this.data.values = result.length;
    },
    afterFindOne: async function(){
        if(_.isEmpty(this.data.values)){
            const all = await getInternalPermissionObjects();
            const id = this.id;
            this.data.values = _.find(all, function(item){
                return item._id === id
            });
        }
    },
    beforeInsert: async function(){
        let doc = this.doc;
        let existedCount = Creator.getCollection("permission_objects").direct.find({permission_set_id: doc.permission_set_id, object_name: doc.object_name, space: doc.space}).count()
        if(existedCount > 0){
            throw new Error("此对象已有权限对象记录")
        }

        await initPermissionSet(doc, this.userId, this.spaceId);

        const permissionSet = await objectql.getObject('permission_set').findOne(doc.permission_set_id)
        if(_.isEmpty(doc.name)){
            doc.name = `${doc.object_name}.${permissionSet.name}`
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

        await initPermissionSet(Object.assign({permission_set_id: permission_set_id}, doc), this.userId, this.spaceId);
    }
}