/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-05-28 11:07:57
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-08-10 15:22:02
 * @Description: 
 */
const { afterInsertAutoNumber } = require('./autonumberTirggerHelper')

module.exports = {
    listenTo: 'core',
    afterInsert: async function () {
        return await afterInsertAutoNumber.apply(this, arguments)
    }
}