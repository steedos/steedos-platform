/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-15 11:16:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-15 14:04:49
 * @Description: 
 */
module.exports = {
    standard_deleteVisible: function () {
        if(Meteor.settings.public.enable_saas){
            return Creator.USER_CONTEXT.user.spaceId === Creator.USER_CONTEXT.user.masterSpaceId && Steedos.StandardObjects.Base.Actions.standard_delete.visible.apply(this, arguments)
        }
        return Steedos.StandardObjects.Base.Actions.standard_delete.visible.apply(this, arguments)
    }
}