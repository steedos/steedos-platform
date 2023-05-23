/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-08 14:15:29
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2023-05-23 16:03:50
 * @Description: 
 */
"use strict";
// @ts-check
const { getObject, getSteedosSchema, getSteedosConfig, getDataSource } = require('@steedos/objectql');
const _ = require('underscore')

async function checkEmailValid(email) {
    const userObj = getObject('users');
    const existed = await userObj.count({
        filters: [
            ['emails.address', '=', email]
        ]
    });
    if (existed > 0) {
        throw new Error("users_error_email_exists");
    }
}

module.exports = {
    listenTo: 'users',

    beforeInsert: async function () {
        const { doc, userId } = this
        const broker = getSteedosSchema().broker
        const spaceObj = getObject('spaces');

        var ref, ref1, ref2, ref3, ref4, ref5, space, space_registered;
        space_registered = (ref = doc.profile) != null ? ref.space_registered : void 0;
        // # 从工作区特定的注册界面注册的用户，需要先判断下工作区是否存在
        if (space_registered) {
            space = await spaceObj.findOne(space_registered);
            if (!space) {
                throw new Error('space_users_error_space_not_found');
            }
        }
        if (doc.username) {
            await broker.call('users.validateUsername', { username: doc.username, userId: doc._id })
        }
        doc.created = new Date();
        doc.is_deleted = false;
        if (userId) {
            doc.created_by = userId;
        }
        if ((ref1 = doc.services) != null ? ref1.google : void 0) {
            if (doc.services.google.email && !doc.emails) {
                doc.emails = [
                    {
                        address: doc.services.google.email,
                        verified: true
                    }
                ];
            }
            if (doc.services.google.picture) {
                doc.avatarUrl = doc.services.google.picture;
            }
        }
        if ((ref2 = doc.services) != null ? ref2.facebook : void 0) {
            if (doc.services.facebook.email && !doc.emails) {
                doc.emails = [
                    {
                        address: doc.services.facebook.email,
                        verified: true
                    }
                ];
            }
        }
        if (doc.emails && !doc.steedos_id) {
            if (doc.emails.length > 0) {
                doc.steedos_id = doc.emails[0].address;
            }
        }
        if (((ref3 = doc.profile) != null ? ref3.name : void 0) && !doc.name) {
            doc.name = doc.profile.name;
        }
        if (((ref4 = doc.profile) != null ? ref4.locale : void 0) && !doc.locale) {
            doc.locale = doc.profile.locale;
        }
        if (((ref5 = doc.profile) != null ? ref5.mobile : void 0) && !doc.mobile) {
            doc.mobile = doc.profile.mobile;
        }
        if (!doc.steedos_id && doc.username) {
            doc.steedos_id = doc.username;
        }
        if (!doc.name) {
            doc.name = doc.steedos_id.split('@')[0];
        }
        if (!doc.type) {
            doc.type = "user";
        }
        if (!doc.active) {
            doc.active = true;
        }
        if (!doc.roles) {
            doc.roles = ["user"];
        }
        if (!doc.utcOffset) {
            doc.utcOffset = 8;
        }
        if (!_.isEmpty(doc.emails)) {
            for (const obj of doc.emails) {
                await checkEmailValid(obj.address)
            }
        }
    },

    beforeUpdate: async function () {
        const { doc } = this
        let setKeys = _.keys(doc || {});
        if (!_.isEmpty(setKeys) && _.find(setKeys, function (key) {
            return _.include(['name', 'username', 'email', 'email_verified', 'mobile',
                'mobile_verified', 'locale', 'avatar', 'email_notification', 'sms_notification'], key)
        })) {
            throw new Error('禁止修改');
        }
    },

    beforeDelete: async function () {
        throw new Error("users_error_cloud_admin_required");
    },

    afterInsert: async function () {
        const { doc } = this
        const orgObj = getObject('organizations');
        const suObj = getObject('space_users');
        const spaceObj = getObject('spaces');

        var newId, ref, ref1, ref2, rootOrg, space_name, space_registered, user_email;
        space_registered = (ref = doc.profile) != null ? ref.space_registered : void 0;
        if (space_registered) {
            // 从工作区特定的注册界面注册的用户，需要自动加入到工作区中
            user_email = doc.emails[0].address;
            rootOrg = (await orgObj.find({
                filters: [
                    ['space', '=', space_registered],
                    ['parent', '=', null]
                ],
                fields: ['_id']
            }))[0];
            await suObj.insert({
                email: user_email,
                user: doc._id,
                name: doc.name,
                organizations: [rootOrg._id],
                space: space_registered,
                user_accepted: true,
                is_registered_from_space: true
            });
        }
        if (!space_registered && !(((ref1 = doc.spaces_invited) != null ? ref1.length : void 0) > 0)) {
            // 不是从工作区特定的注册界面注册的用户，也不是邀请的用户
            // 即普通的注册用户，则为其新建一个自己的工作区
            space_name = doc.company || ((ref2 = doc.profile) != null ? ref2.company : void 0);
            if (!space_name) {
                space_name = doc.name + " " + t("space");
            }
            newId = await spaceObj._makeNewID();
            await spaceObj.insert({
                _id: newId,
                name: space_name,
                owner: doc._id,
                admins: [doc._id],
                space: newId
            });
        }
    },

    afterUpdate: async function () {
        const { doc, id } = this
        const suObj = getObject('space_users');
        if (doc.last_logon) {
            await suObj.updateMany([['user', '=', id]], { last_logon: doc.last_logon });
        }
    },

    afterDelete: async function () {

    },

}