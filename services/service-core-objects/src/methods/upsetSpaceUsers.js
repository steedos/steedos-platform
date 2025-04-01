const _ = require('lodash');
module.exports = {
    handler: async function (spaceUsers, spaceInfo, idFieldName, orgIdFieldName) {
        // 创建或者更新用户
        for (const spaceUser of spaceUsers) {
            await this.upsetSpaceUser(spaceUser, spaceInfo, idFieldName)
        }

        // 更新部门的users属性
        const orgObj = this.getObject("organizations");
        const spaceUsersObj = this.getObject("space_users");
        
        const orgs = await orgObj.find({fields: ['_id']});
        for (const org of orgs) {
            if(org[orgIdFieldName]){
                const spaceUsers = await spaceUsersObj.directFind({filters: ['organization', '=', org._id]});
                orgObj.directUpdate(org._id, {
                    users: _.map(spaceUsers, 'user'),
                    modified_by: spaceInfo.owner,
                    modified: new Date()
                })
            }
        }
    }
}