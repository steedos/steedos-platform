/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-05-03 11:23:08
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-05-07 16:15:47
 * @Description: 
 */
const { encryptFieldValue, decryptFieldValue } = require('../helpers/triggerHelper.js');

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

    afterAggregate: async function () {
        const { object_name, data } = this;
        const docs = data.values;
        // 查找要求加密的字段并解密
        await decryptFieldValue(object_name, docs);
    },

    afterFind: async function () {
        const { object_name, data } = this;
        const docs = data.values;
        // 查找要求加密的字段并解密
        await decryptFieldValue(object_name, docs);
    },

    afterFindOne: async function () {
        const { object_name, data } = this;
        const doc = data.values;
        // 查找要求加密的字段并解密
        await decryptFieldValue(object_name, doc);
    }

}
