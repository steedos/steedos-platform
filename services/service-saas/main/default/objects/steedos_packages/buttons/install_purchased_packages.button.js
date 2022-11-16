/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-15 13:35:27
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-15 13:37:56
 * @Description: 
 */
module.exports = {
    install_purchased_packagesVisible: function (object_name, record_id) {
        if(Meteor.settings.public.enable_saas && Creator.USER_CONTEXT.user.spaceId != Creator.USER_CONTEXT.user.masterSpaceId){
            return false
        }
        return true;
    }
}