const _ = require('underscore');
const InternalData = require('./core/internalData');
const objectql = require('@steedos/objectql');
const auth = require("@steedos/auth");
const getLng = async function(userId){
    const userSession = await auth.getSessionByUserId(userId);
    return userSession ? userSession.language : null;
}

const getSourcePermissionSets = async function(type){
    switch (type) {
        case 'permission_set':
            return await objectql.getSourcePermissionsets();
        case 'profile':
            return await objectql.getSourceProfiles();
        default:
            return (await objectql.getSourceProfiles()).concat((await objectql.getSourcePermissionsets()));
    }
    
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


const getLngInternalPermissionSet = async function(lng, type){
    const internalPermissionSet = await getSourcePermissionSets(type);
    if(!lng){
        return internalPermissionSet;
    }

    let lngInternalPermissionSet = [];
    _.each(internalPermissionSet, function(ps){
        lngInternalPermissionSet.push(Object.assign({}, ps, {label: ps.label || TAPi18n.__(`permission_set_${ps.name}`, {}, lng)}))
    })
    return lngInternalPermissionSet;
}

const getInternalPermissionSet = async function(spaceId, lng, type){
    let lngInternalPermissionSet = await getLngInternalPermissionSet(lng, type);
    if(!spaceId){
        return lngInternalPermissionSet;
    }
    let keys = await getSourcePermissionSetsKeys(type);
    let dbPerms = await objectql.getObject("permission_set").directFind({filters: [['space', '=', spaceId],['name', '=', keys || []]], fields: ['_id', 'name']});
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
                let lng = await getLng(this.userId);
                let records = await getInternalPermissionSet(this.spaceId, lng, filters.type);
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
            let spaceId = this.spaceId;
            let filters = InternalData.parserFilters(this.query.filters);
            let filterType = "";
            try {
                filterType = filters.type || filters["$and"][0].type;
            } catch (error) {
                
            }
            if(_.has(filters, '_id') && this.data.values.length > 0){
                return this.data.values
            }
            if(_.has(filters, '_id') && this.data.values.length === 0){
                const keys = await getSourcePermissionSetsKeys();
                if(_.include(keys, filters._id) && spaceId){
                    let dbPerms = await objectql.getObject("permission_set").directFind({filters: [['space', '=', spaceId], ['name', '=', filters._id]]});
                    if(dbPerms && dbPerms.length > 0){
                        return this.data.values = this.data.values.concat(dbPerms[0])
                    }
                }
                let lng = null;
                if(this.userId){
                    lng = await getLng(this.userId);
                }
                const permSet = await getLngInternalPermissionSet(lng);
                return this.data.values = this.data.values.concat(_.find(permSet, (doc)=>{
                    return doc._id === filters._id
                }))
            }
            // TODO: 目前排查出 权限集、简档的all视图才需要同时出示 权限集和简档 的记录， 这里需要做调整。
            if(!_.has(filters, 'type') || (_.has(filters, 'type'))){
                let lng = await getLng(this.userId);
                this.data.values = this.data.values.concat((await getInternalPermissionSet(this.spaceId, lng, filterType)))
            }
            // this.data.values （许可证： platform）有值 ，（许可证： community）没值。
            // 人员对象 简档字段  还需要拿数据库保存的值 再过滤一遍。
            const allData = this.data.values;
            const firstFilterKey = _.keys(filters)[0];
            if(firstFilterKey === 'name'){
                this.data.values = _.filter(allData, (item)=>{
                    return item[firstFilterKey] === filters[firstFilterKey];
                })
            }
        }
    },
    afterCount: async function () {
        let filters = InternalData.parserFilters(this.query.filters);
        if(!_.has(filters, 'type') || (_.has(filters, 'type'))){
            this.data.values = this.data.values + (await getInternalPermissionSet(this.spaceId, null, filters.type)).length
        }
    },
    afterFindOne: async function () {
        let id = this.id;
        let spaceId = this.spaceId;
        if(id && _.isEmpty(this.data.values)){
            const keys = await getSourcePermissionSetsKeys();
            if(_.include(keys, id) && spaceId){
                let dbPerms = await objectql.getObject("permission_set").directFind({filters: [['space', '=', spaceId], ['name', '=', id]]});
                if(dbPerms && dbPerms.length > 0){
                    this.data.values = dbPerms[0]
                    return ;
                }
            }
            let lng = null;
            if(this.userId){
                lng = await getLng(this.userId);
            }
            const permSet = await getLngInternalPermissionSet(lng);
            Object.assign(this.data.values, _.find(permSet, (doc)=>{
                return doc._id === id
            }))
        }
    }
}