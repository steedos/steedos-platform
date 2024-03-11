const _ = require('lodash');

const getOrgParents = (org, orgs, idFieldName, parentFieldName)=>{
    const _parents = []
    const _getOrgParents = (org, orgs, parents)=>{
        var parent = _.find(orgs, (_org)=>{return _org[idFieldName] === org[parentFieldName]})
        if(parent){
            parents.push(parent._id)
            if(parent[parentFieldName]){
                parents = _.concat(parents, _getOrgParents(parent, orgs, parents))
            }else{
                return parents
            }
        }else{
            return parents;
        }
    }
    _getOrgParents(org, orgs, _parents)
    return _parents;
}


module.exports = {
    handler: async function (organizations, spaceInfo, idFieldName, parentFieldName) {
        const orgObj = this.getObject("organizations");
        // 创建或者更新组织
        for (const group of organizations) {
            await this.upsetOrg(group, spaceInfo, idFieldName, parentFieldName)
        }

        // 维护parent字段
        const orgs1 = await orgObj.find({fields: ['_id', idFieldName, parentFieldName]});
        for (const org of orgs1) {
            if(org[parentFieldName] && org[parentFieldName] !='0'){
                const parent = _.find(orgs1, (_org)=>{return _org[idFieldName] === org[parentFieldName]});
                if(parent){
                    orgObj.directUpdate(org._id, {
                        parent: parent._id,
                        modified_by: spaceInfo.owner,
                        modified: new Date()
                    })
                }else{
                    console.log(`org not find parent`, org)
                }
            }
        }

        // 维护parents字段
        const orgs2 = await orgObj.find({fields: ['_id', idFieldName, parentFieldName, 'parent']});
        for (const org of orgs2) {
            if(org[parentFieldName] && org[parentFieldName] !='0'){
                const parents = getOrgParents(org, orgs2, idFieldName, parentFieldName);
                orgObj.directUpdate(org._id, {
                    parents: parents,
                    modified_by: spaceInfo.owner,
                    modified: new Date()
                })
            }
        }

        // 维护children字段
        const orgs3 = await orgObj.find({fields: ['_id', idFieldName, parentFieldName, 'parent']});
        for (const org of orgs3) {
            if(org[idFieldName]){
                const children = _.filter(orgs3, (_org)=>{return _org.parent === org._id});
                orgObj.directUpdate(org._id, {
                    children: _.map(children, '_id'),
                    modified_by: spaceInfo.owner,
                    modified: new Date()
                })
            }
        }
    }
}