/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-08 15:16:53
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2023-01-16 10:53:05
 * @Description: 
 */
'use strict';
// @ts-check
const { getObject } = require('@steedos/objectql');

module.exports = {
    listenTo: 'instance_tasks',

    beforeInsert: async function () { },

    beforeUpdate: async function () { },

    beforeDelete: async function () { },

    afterInsert: async function () { },

    afterUpdate: async function () {
        // console.log('[trigger][instance_tasks]', 'afterUpdate')
        const { doc, previousDoc } = this
        // 未完成到已完成
        if (!previousDoc.is_finished && doc.is_finished) {
        }
    },

    afterDelete: async function () { },

}