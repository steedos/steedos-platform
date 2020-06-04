const _ = require('underscore');

const permissions = {
    allowEdit: false,
    allowDelete: false,
    allowRead: true,
}

const baseRecord = {
    is_system:true,
    type: 'profile',
    record_permissions:permissions
}

const internalPermissionSet = [
    {_id: 'admin', name: 'admin',label: 'admin', ...baseRecord},
    {_id: 'user', name: 'user',label: 'user', ...baseRecord},
    {_id: 'supplier', name: 'supplier',label: 'supplier', ...baseRecord},
    {_id: 'customer', name: 'customer', label: 'customer',...baseRecord}
];

const getInternalPermissionSet = function(spaceId){
    if(!spaceId){
        return internalPermissionSet;
    }
    let dbPerms = Creator.getCollection("permission_set").find({space: spaceId, name: {$in: ['admin','user','supplier','customer']}}, {fields:{_id:1, name:1}}).fetch();
    let perms = [];
    _.forEach(internalPermissionSet, function(doc){
        if(!_.find(dbPerms, function(p){
            return p.name === doc.name
        })){
            perms.push(doc);
        }
    })
    return perms;
}

module.exports = {
    beforeFind: async function () {
        console.log('beforeFind......');
    },
    afterFind: async function () {
        let spaceId = this.spaceId;
        console.log('afterFind......spaceId ', spaceId);
        if(_.isArray(this.data.values)){
            _.forEach(getInternalPermissionSet(spaceId), (doc)=>{
                this.data.values.unshift(doc)
            })
        }
    },
    afterFindOne: async function () {
        let id = this.id;
        if(id && _.isEmpty(this.data.values)){
            Object.assign(this.data.values, _.find(internalPermissionSet, (doc)=>{
                return doc._id === id
            }))
        }
        // console.log('afterFindOne......', this);
    }
}