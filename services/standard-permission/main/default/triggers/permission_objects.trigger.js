const _ = require('underscore');
const objectql = require("@steedos/objectql");
const InternalData = require('@steedos/standard-objects').internalData;
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
          if((!objectJSON._id || (objectJSON._id && !!objectJSON.extend)) && !objectJSON.hidden && !_.include(InternalData.hiddenObjects, objectName)){
            let permission_set = objectJSON.permission_set
            _.each(permission_set, function(v, code){
                objectsPermissions.push(Object.assign({}, v, {
                    _id: `${code}_${objectName}`, 
                    name: `${objectName}.${code}`, 
                    permission_set_id: code, 
                    object_name: objectName,
                    allowCreateListViews: v.allowCreateListViews == false ? false : true
                }, baseRecord))
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
    
    let permissionSet = null;
    const permissionSets = await objectql.getObject('permission_set').find({filters: [['name', '=', doc.permission_set_id], 'or', ['_id', '=', doc.permission_set_id]]});

    if(permissionSets && permissionSets.length > 0){
        permissionSet = permissionSets[0];
    }
    
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
            
            // 为了解决默认简档自定义后生成新的_id，导致无法查询到数据的问题
            if (_.isString(this.query.filters)) {
                const filtersStr = this.query.filters;
                const regex = /(?<=permission_set_id eq ')\w+(?=')/g;
                const matches = filtersStr.match(regex);
                if (matches) {
                    const permissionSetId = matches[0];
                    // 查找permissionSetId对应的permissionSet
                    const permissionSetDoc = (await objectql.getObject('permission_set').directFind({
                        filters: [
                            ['_id', '=', permissionSetId],
                        ]
                    }))[0];
                    if (permissionSetDoc) {
                        // 替换this.query.filters中全部的的permission_set_id为permissionSetDoc.name
                        this.query.filters = this.query.filters.replace(regex, permissionSetDoc.name).replace(`permission_set_id eq '${permissionSetDoc.name}'`, `(permission_set_id eq '${permissionSetDoc.name}') or (permission_set_id eq '${permissionSetId}')`);
                    }
                }
            }
            
            const records = objectql.getSteedosSchema().metadataDriver.find(this.data.values, this.query, spaceId);
            if (records.length > 0) {
                this.data.values = records;
            } else {
                this.data.values.length = 0;
            }
        }

        _.each(this.data.values, (value)=>{
            value.allowCreateListViews = value.allowCreateListViews == false ? false : true
        })

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
        }else{
            const { allowCreateListViews } = this.data.values;
            this.data.values.allowCreateListViews =  allowCreateListViews == false ? false : true
        }
    },
    beforeInsert: async function(){
        let doc = this.doc;

        let permissionSetId = doc.permission_set_id
        if(_.includes(['admin','user','supplier','customer'], doc.permission_set_id)){
            let dbPst = Creator.getCollection("permission_set").direct.find({name: doc.permission_set_id});
            if(dbPst && dbPst.length > 0){
                permissionSetId = dbPst[0]._id;
                const dbDoc = dbPst[0]
                if(_.includes(['admin','user','supplier','customer'], permissionSetId)){
                    permissionSetId =  Creator.getCollection("permission_set")._makeNewID()
                    Creator.getCollection("permission_set").insert({
                        _id: permissionSetId,
                        name: dbDoc.name, label: dbDoc.label, type: dbDoc.type, 
                        license: dbDoc.license, lockout_interval: dbDoc.lockout_interval, 
                        max_login_attempts: dbDoc.max_login_attempts, 
                        password_history: dbDoc.password_history, 
                        default_standard_buttons: dbDoc.default_standard_buttons
                    });
                }
            }
        }

        doc.permission_set_id = permissionSetId;

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