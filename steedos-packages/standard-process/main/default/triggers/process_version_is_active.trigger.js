/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-03-29 19:55:08
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-03-29 20:16:28
 * @Description: 
 */
'use strict';
//@ts-check

module.exports = {
    listenTo: 'process_versions',

    afterUpdate: async function () {
        const { doc, previousDoc } = this;
        // 如已发布则更新process的版本
        if (doc.is_active && !previousDoc.is_active) {
            await this.getObject('process').update(doc.process, { version: doc.version });
        }
    }
}