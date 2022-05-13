/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-05-03 11:23:08
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-05-13 00:31:23
 * @Description: 
 */
const { encryptFieldValue } = require('../helpers/triggerHelper.js');

module.exports = {
    listenTo: '*',

    beforeInsert: async function () {
        const { object_name, doc } = this;
        // 查找要求加密的字段并加密
        await encryptFieldValue(object_name, doc);
    },

    beforeUpdate: async function () {
        const { object_name, doc } = this;
        // 查找要求加密的字段并加密
        await encryptFieldValue(object_name, doc);
    },

}
