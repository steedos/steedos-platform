const _ = require('underscore');
const objectql = require('@steedos/objectql');
const auth = require("@steedos/auth");


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
    beforeFind: async function () {
        delete this.query.fields;
    },

    beforeAggregate: async function () {
        delete this.query.fields;
    },

    afterFind: async function(){
        const { spaceId } = this;
        let dataList = await getSourcePermissionSets();
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
        let dataList = await getSourcePermissionSets();
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
            const all = await getSourcePermissionSets();
            const id = this.id;
            this.data.values = _.find(all, function(item){
                return item._id === id
            });
        }
    }
}