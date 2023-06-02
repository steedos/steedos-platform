/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2023-03-10 23:23:26
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-04-12 14:34:29
 * @FilePath: /project-ee/Users/yinlianghui/Documents/GitHub/steedos-platform2-4/services/service-workflow/main/default/objects/instances/buttons/instance_new.button.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
module.exports = {
    instance_queryVisible: function (object_name, record_id, record_permissions, data) {
        return false;
        if(data && data._isRelated){
            return false;
        }
        return true;
    }
}