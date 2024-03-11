module.exports = {
    handler: async function (org, spaceInfo, idFieldName, parentFieldName) {
        const orgObj = this.getObject("organizations");
        // 创建或者更新组织
        const orgs = await orgObj.directFind({filters: [idFieldName, '=', org[idFieldName]], fields: ['_id']})
        if(orgs.length > 0){
            await orgObj.directUpdate(orgs[0]._id, Object.assign({
                modified_by: spaceInfo.owner,
                modified: new Date()
            }, org))
        }else{
            await orgObj.directInsert(Object.assign({
                space: spaceInfo._id,
                owner: spaceInfo.owner,
                created_by: spaceInfo.owner,
                created: new Date()
            }, org))
        }
    }
}