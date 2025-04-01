const _ = require('lodash');

module.exports = {
    handler: async function (user, spaceInfo, idFieldName) {
        const userObj = this.getObject("users");
        const users1 = await userObj.find({filters: [idFieldName, '=', user[idFieldName]]});
        if(users1.length > 0){
            await userObj.directUpdate(users1[0]._id, Object.assign({
                modified_by: spaceInfo.owner,
                modified: new Date()
            }, user))
        }else{
            let users2 = [];
            if(user.username){
                users2 = await userObj.find({filters: ['username', '=', user.username]});
            }
            if(users2.length > 0){
                await userObj.directUpdate(users2[0]._id, Object.assign({
                    modified_by: spaceInfo.owner,
                    modified: new Date()
                }, user))
            }else{
                const newId = await this.makeNewID();
                await userObj.directInsert(Object.assign({
                    _id: newId,
                    steedos_id: newId,
                    user_accepted: true,
                    owner: spaceInfo.owner,
                    created_by: spaceInfo.owner,
                    created: new Date()
                }, user))
            }
        }

        const users = await userObj.find({filters: [idFieldName, '=', user[idFieldName]]});
        return _.first(users)
    }
}