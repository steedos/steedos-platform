/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2024-01-08 09:53:06
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2024-01-08 09:54:45
 * @FilePath: /steedos-platform-2.3/services/standard-accounts/main/default/triggers/space_users.trigger.js
 * @Description: 
 */
"use strict";
// @ts-check
const { getObject } = require('@steedos/objectql');

module.exports = {
    listenTo: 'space_users',

    afterInsert: async function () {
        const { doc } = this
        const contactsObj = getObject('contacts')
        if (doc.contact_id) {
            await contactsObj.directUpdate(doc.contact_id, {
                user: doc.user
            })
        }

    },

}