const _ = require('underscore');
const odataMongodb = require("odata-v4-mongodb");
const auth = require("@steedos/auth");

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

const getLng = function(userId){
    return Steedos.locale(userId, true);
}

const getLngInternalPermissionSet = function(lng){

    if(!lng){
        return internalPermissionSet;
    }

    let lngInternalPermissionSet = [];
    _.each(internalPermissionSet, function(ps){
        lngInternalPermissionSet.push(Object.assign({}, ps, {label: TAPi18n.__(`permission_set_${ps.name}`, {}, lng)}))
    })
    return lngInternalPermissionSet;
}

const getInternalPermissionSet = function(spaceId, lng){
    
    let lngInternalPermissionSet = getLngInternalPermissionSet(lng);

    if(!spaceId){
        return lngInternalPermissionSet;
    }
    let dbPerms = Creator.getCollection("permission_set").find({space: spaceId, name: {$in: ['admin','user','supplier','customer']}}, {fields:{_id:1, name:1}}).fetch();
    let perms = [];
    _.forEach(lngInternalPermissionSet, function(doc){
        if(!_.find(dbPerms, function(p){
            return p.name === doc.name
        })){
            perms.push(doc);
        }
    })
    return perms;
}

// const geByFilters = function(spaceId, filtersFun){
//     let all = getInternalPermissionSet(spaceId);
//     let pers = []
//     _.each(all, function(doc){
//         if(filtersFun(doc)){
//             pers.push(doc)
//         }
//     })
//     return pers;
// }

// const find = function(query){
//     let filters = parserFilters(odataMongodb.createFilter(query.filters));
//     console.log('filters', JSON.stringify(filters));

//     return geByFilters(query.space, (doc)=>{
//         let rev = true;
//         _.each(filters, function(v, k){
//             if(_.isString(v) && _.has(doc, k)){
//                 rev = doc[k] === v
//             }
//         })
//         return rev;
//     })
// }

module.exports = {
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
            let lng = getLng(this.userId);
            this.data.values = this.data.values.concat(getInternalPermissionSet(this.spaceId, lng))
        }
    },
    afterCount: async function () {
        this.data.values = this.data.values + getInternalPermissionSet(this.spaceId, null).length
        
    },
    afterFindOne: async function () {
        let id = this.id;
        let spaceId = this.spaceId;
        if(id && _.isEmpty(this.data.values)){
            if(_.include(['admin','user','supplier','customer'], id) && spaceId){
                let dbPerms = Creator.getCollection("permission_set").findOne({space: spaceId, name: id});
                if(dbPerms){
                    this.data.values = dbPerms
                    return ;
                }
            }
            let lng = getLng(this.userId);
            Object.assign(this.data.values, _.find(getLngInternalPermissionSet(lng), (doc)=>{
                return doc._id === id
            }))
        }
        // console.log('afterFindOne......', this);
    }
}