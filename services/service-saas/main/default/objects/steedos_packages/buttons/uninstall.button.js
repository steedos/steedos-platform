/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-15 13:35:27
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-15 13:38:07
 * @Description: 
 */
module.exports = {
    uninstallVisible: function (object_name,record_id) {
        if(Meteor.settings.public.enable_saas && Creator.USER_CONTEXT.user.spaceId != Creator.USER_CONTEXT.user.masterSpaceId){
            return false
        }
        const record = Creator.odata.get(object_name,record_id);
        if(record.local){
            return false;
        }
        if(record.status){
            return true;
        }
        return false
    }
}