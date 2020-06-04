const _ = require('underscore');
const odataMongodb = require("odata-v4-mongodb");

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

const geByFilters = function(spaceId, filtersFun){
    let all = getInternalPermissionSet(spaceId);
    let pers = []
    _.each(all, function(doc){
        if(filtersFun(doc)){
            pers.push(doc)
        }
    })
    return pers;
}

const find = function(query){
    let filters = parserFilters(odataMongodb.createFilter(query.filters));
    console.log('filters', JSON.stringify(filters));

    return geByFilters(query.space, (doc)=>{
        let rev = true;
        _.each(filters, function(v, k){
            if(_.isString(v) && _.has(doc, k)){
                rev = doc[k] === v
            }
        })
        return rev;
    })
}

module.exports = {
    beforeFind: async function () {
        console.log('beforeFind......');
    },
    afterFind: async function () {
        if(_.isArray(this.data.values)){
            // let filters = parserFilters(odataMongodb.createFilter(this.query.filters));
            // if(filters._id && _.include(['admin','user','supplier','customer'], filters._id)){
            //     let dbPerms = Creator.getCollection("permission_set").find({space: filters.spaceId, name: filters._id}).fetch();
            //     if(dbPerms){
            //         this.data.values = dbPerms
            //         return ;
            //     }
            // }
            _.forEach(getInternalPermissionSet(this.spaceId), (doc)=>{
                this.data.values.unshift(doc)
            })
        }
    },
    afterFindOne: async function () {
        let id = this.id;
        let spaceId = this.spaceId;
        console.log('afterFindOne this ---> ', this);
        if(id && _.isEmpty(this.data.values)){
            if(_.include(['admin','user','supplier','customer'], id) && spaceId){
                let dbPerms = Creator.getCollection("permission_set").findOne({space: spaceId, name: id});
                if(dbPerms){
                    this.data.values = dbPerms
                    return ;
                }
            }
            Object.assign(this.data.values, _.find(internalPermissionSet, (doc)=>{
                return doc._id === id
            }))
        }
        // console.log('afterFindOne......', this);
    }
}