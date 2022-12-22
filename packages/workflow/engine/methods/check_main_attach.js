/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-22 10:48:25
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-22 10:48:51
 * @Description: 
 */
module.exports = {
    check_main_attach: function (ins_id, name) {
        check(ins_id, String);
        uuflowManager.checkMainAttach(ins_id, name);
        return 'success';
    }
};
