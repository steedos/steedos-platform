/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-12 11:32:06
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-13 10:16:15
 * @Description: 
 */
module.exports = {
    import: function (object_name, record_id) {
        return Modal.show('import_users_modal');
    },
    importVisible: function (object_name, record_id, record_permissions, data) {
        return false;
    },
}