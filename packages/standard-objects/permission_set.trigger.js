const _ = require('underscore');
const InternalData = require('./core/internalData');

const permissions = {
    allowEdit: false,
    allowDelete: false,
    allowRead: true,
}

const baseRecord = {
    is_system:true,
    type: 'profile',
    record_permissions:permissions,
    password_history: '3',
    max_login_attempts: '10',
    lockout_interval: '15'
}

const internalPermissionSet = [
    {_id: 'admin', name: 'admin',label: 'admin', license: 'platform', ...baseRecord},
    {_id: 'user', name: 'user',label: 'user', license: 'platform', ...baseRecord},
    {_id: 'supplier', name: 'supplier',label: 'supplier', license: 'community', ...baseRecord},
    {_id: 'customer', name: 'customer', label: 'customer', license: 'community',...baseRecord}
];

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
            let filters = InternalData.parserFilters(this.query.filters);
            if(!_.has(filters, 'type') || (_.has(filters, 'type') && filters.type === 'profile')){
                let lng = getLng(this.userId);
                let records = getInternalPermissionSet(this.spaceId, lng);
                if(_.has(filters, 'name')){
                    records = _.filter(records, function(record){
                        return record.name == filters.name
                    })
                }

                if(_.has(filters, 'license')){
                    records = _.filter(records, function(record){
                        return record.license == filters.license
                    })
                }

                this.data.values = this.data.values.concat(records)
            }
            
        }
    },
    afterAggregate: async function () {
        if(_.isArray(this.data.values)){
            let filters = InternalData.parserFilters(this.query.filters);
            if(!_.has(filters, 'type') || (_.has(filters, 'type') && filters.type === 'profile')){
                let lng = getLng(this.userId);
                this.data.values = this.data.values.concat(getInternalPermissionSet(this.spaceId, lng))
            }
            
        }
    },
    afterCount: async function () {
        let filters = InternalData.parserFilters(this.query.filters);
        if(!_.has(filters, 'type') || (_.has(filters, 'type') && filters.type === 'profile')){
            this.data.values = this.data.values + getInternalPermissionSet(this.spaceId, null).length
        }
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
            if(this.userId){
                let lng = getLng(this.userId);
                Object.assign(this.data.values, _.find(getLngInternalPermissionSet(lng), (doc)=>{
                    return doc._id === id
                }))
            }
        }
    }
}