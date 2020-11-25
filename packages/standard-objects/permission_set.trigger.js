const _ = require('underscore');
const InternalData = require('./core/internalData');
const objectql = require('@steedos/objectql');
const getLng = function(userId){
    return Steedos.locale(userId, true);
}

const getSourcePermissionSets = function(type){
    switch (type) {
        case 'permission_set':
            return objectql.getSourcePermissionsets();
        case 'profile':
            return objectql.getSourceProfiles();
        default:
            return objectql.getSourceProfiles().concat(objectql.getSourcePermissionsets());
    }
    
}

const getSourcePermissionSetsKeys = function(type){
    switch (type) {
        case 'permission_set':
            return objectql.getSourcePermissionsetKeys();
        case 'profile':
            return objectql.getSourceProfilesKeys();
        default:
            return objectql.getSourceProfilesKeys().concat(objectql.getSourcePermissionsetKeys())
    }
}


const getLngInternalPermissionSet = function(lng, type){
    const internalPermissionSet = getSourcePermissionSets(type);
    if(!lng){
        return internalPermissionSet;
    }

    let lngInternalPermissionSet = [];
    _.each(internalPermissionSet, function(ps){
        lngInternalPermissionSet.push(Object.assign({}, ps, {label: ps.label || TAPi18n.__(`permission_set_${ps.name}`, {}, lng)}))
    })
    return lngInternalPermissionSet;
}

const getInternalPermissionSet = function(spaceId, lng, type){
    
    let lngInternalPermissionSet = getLngInternalPermissionSet(lng, type);

    if(!spaceId){
        return lngInternalPermissionSet;
    }
    let dbPerms = Creator.getCollection("permission_set").find({space: spaceId, name: {$in: getSourcePermissionSetsKeys(type) || []}}, {fields:{_id:1, name:1}}).fetch();
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
            if(!_.has(filters, 'type') || (_.has(filters, 'type'))){
                let lng = getLng(this.userId);
                let records = getInternalPermissionSet(this.spaceId, lng, filters.type);
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
            if(!_.has(filters, 'type') || (_.has(filters, 'type'))){
                let lng = getLng(this.userId);
                this.data.values = this.data.values.concat(getInternalPermissionSet(this.spaceId, lng, filters.type))
            }
            
        }
    },
    afterCount: async function () {
        let filters = InternalData.parserFilters(this.query.filters);
        if(!_.has(filters, 'type') || (_.has(filters, 'type'))){
            this.data.values = this.data.values + getInternalPermissionSet(this.spaceId, null, filters.type).length
        }
    },
    afterFindOne: async function () {
        let id = this.id;
        let spaceId = this.spaceId;
        if(id && _.isEmpty(this.data.values)){
            if(_.include(getSourcePermissionSetsKeys(), id) && spaceId){
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