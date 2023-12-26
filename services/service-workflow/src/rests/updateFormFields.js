/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-12-22 13:48:46
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-12-22 13:53:13
 * @Description: 
 * 1 更新表单字段
 * 2 如果绑定了对象,则更新对象字段映射
 * 3 如果绑定了对象,则更新flow的instance_fields, instance_table_fields字段.
 */


module.exports = {
    rest: {
        method: 'POST',
        fullPath: '/api/workflow/updateFormFields'
    },
    params: {
        ids: { type: 'array', items: 'string' }, // 申请单id数组
    },
    async handler(ctx) {

    }
}