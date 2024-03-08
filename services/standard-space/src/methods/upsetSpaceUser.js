const _ =require('lodash');
const __ = require('underscore')

const getOrgParents = async (orgIds, orgObj)=>{
    const orgs = await orgObj.find({
        filters: [
            ['_id', 'in', orgIds]
        ],
        fields: ['parents']
    });
    return __.compact(__.uniq(__.flatten([orgIds, __.pluck(orgs, 'parents')])));
}

module.exports = {
    handler: async function (spaceUser, spaceInfo, idFieldName) {
        const spaceUsersObj = this.getObject("space_users");

        const userInfo = {
            name: spaceUser.name,
            username: spaceUser.username,
            mobile: spaceUser.mobile,
            email: spaceUser.email,
            locale: spaceUser.locale
        };

        if(idFieldName){
            userInfo[idFieldName] = spaceUser[idFieldName]
        }
        const user = await this.upsetUser(userInfo, spaceInfo, idFieldName);
        const { organizations } = spaceUser
        const organization = _.first(organizations);
        const organizations_parents = await getOrgParents(organizations, this.getObject("organizations"))
        const sUser = await spaceUsersObj.find({filters: [idFieldName, '=', spaceUser[idFieldName]]});
        if(sUser.length > 0){
            await spaceUsersObj.directUpdate(sUser[0]._id, Object.assign({
                organization,
                organizations_parents,
                modified_by: spaceInfo.owner,
                modified: new Date()
            }, spaceUser))
        }else{
            const sUser2 = await spaceUsersObj.find({filters: ['username', '=', spaceUser.username]});
            if(sUser2.length > 0){
                await spaceUsersObj.directUpdate(sUser2[0]._id, Object.assign({
                    organization,
                    organizations_parents,
                    modified_by: spaceInfo.owner,
                    modified: new Date()
                }, spaceUser))
            }else{
                await spaceUsersObj.directInsert(Object.assign({
                    organization,
                    organizations_parents,
                    user: user._id,
                    space: spaceInfo._id,
                    owner: spaceInfo.owner,
                    created_by: spaceInfo.owner,
                    created: new Date()
                }, spaceUser))
            }
        }
    }
}