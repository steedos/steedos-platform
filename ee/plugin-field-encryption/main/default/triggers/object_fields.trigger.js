/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-06-23 15:17:20
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-06-25 10:08:38
 * @Description: 
 */
const {
    checkIsEnterprise,
    checkMasterKey
} = require('../helpers/triggerHelper.js');

module.exports = {
    listenTo: "object_fields",

    beforeInsert: async function () {
        await checkIsEnterprise(this)
        checkMasterKey(this)
    },

    beforeUpdate: async function () {
        await checkIsEnterprise(this)
        checkMasterKey(this)
    },

}