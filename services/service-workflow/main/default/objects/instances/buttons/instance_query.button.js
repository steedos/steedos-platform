/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2023-03-10 23:23:26
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-03-11 11:40:54
 * @FilePath: /project-ee/Users/yinlianghui/Documents/GitHub/steedos-platform2-4/services/service-workflow/main/default/objects/instances/buttons/instance_new.button.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
module.exports = {
    instance_queryVisible: function (object_name, record_id, record_permissions, data) {
        if(data && data._isRelated){
            return false;
        }
        return true;
    }
}