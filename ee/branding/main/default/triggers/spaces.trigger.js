/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-07-01 14:05:45
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-07-01 14:40:48
 * @Description: 
 */

const {
    checkIsEnterprise
} = require('../manager/spaces')

module.exports = {
    listenTo: "spaces",

    beforeInsert: async function () {
        await checkIsEnterprise(this)
    },

    beforeUpdate: async function () {
        await checkIsEnterprise(this)
    }
}