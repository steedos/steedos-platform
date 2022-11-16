/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-15 11:17:33
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-15 11:43:12
 * @Description: 
 */
module.exports = {
    standard_editVisible: function () {
        if(Meteor.settings.public.enable_saas){
            return Creator.USER_CONTEXT.user.spaceId === Creator.USER_CONTEXT.user.masterSpaceId && Steedos.StandardObjects.Base.Actions.standard_edit.visible.apply(this, arguments)
        }
        return Steedos.StandardObjects.Base.Actions.standard_edit.visible.apply(this, arguments)
    }
}