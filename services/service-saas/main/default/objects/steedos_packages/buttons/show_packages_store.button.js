/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-15 13:35:27
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-15 13:38:04
 * @Description: 
 */
module.exports = {
    show_packages_storeVisible: function () {
        if(Meteor.settings.public.enable_saas && Creator.USER_CONTEXT.user.spaceId != Creator.USER_CONTEXT.user.masterSpaceId){
            return false
        }
        return true
    }
}