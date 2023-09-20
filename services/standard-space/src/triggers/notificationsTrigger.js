/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-09-20 16:11:28
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-09-20 16:45:50
 * @FilePath: /steedos-platform-2.3/services/standard-space/src/triggers/notificationsTrigger.js
 * @Description: 
 */
"use strict";
const Fiber = require("fibers");

module.exports = {
    trigger: {
        listenTo: 'notifications',
        when: ['afterInsert'],
    },
    async handler(ctx) {
        const { doc, id, isAfter, isInsert } = ctx.params;

        if (isAfter) {
            if (isInsert) {
                Fiber(function () {
                    Creator.sendPushs(doc, "", [doc.owner], [id])
                }).run();
            }
        }
    }
}
