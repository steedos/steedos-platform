/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-05-28 11:07:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-03-05 16:04:33
 * @Description: 
 */
const { afterInsertAutoNumber } = require('../../util/autonumberTirggerHelper')

module.exports = {
    listenTo: 'base',
    afterInsert: async function () {
        return await afterInsertAutoNumber.apply(this, arguments)
    }
}