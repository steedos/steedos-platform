/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-07 14:19:57
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2023-06-16 13:43:36
 * @Description: 
 */
"use strict";
// @ts-check
const { getObject, getSteedosSchema, getSteedosConfig, getDataSource } = require('@steedos/objectql');
const _ = require("underscore");
const { t } = require('@steedos/i18n')
const auth = require("@steedos/auth");
const validator = require("validator");
const spaceUserCore = require('./space_users.core')
const password = require('../util/password')

async function addSpaceAdmin(spaceId, userId) {
    const spaceObj = getObject('spaces')
    let space = await spaceObj.findOne(spaceId, { fields: ['admins'] });
    if (space) {
        let admins = space.admins || [];
        admins.push(userId);
        await spaceObj.update(space._id, {
            admins: _.uniq(admins)
        })
    }
}

async function removeSpaceAdmin(spaceId, userId) {
    const spaceObj = getObject('spaces')
    let space = await spaceObj.findOne(spaceId, { fields: ['admins'] });
    if (space) {
        let admins = space.admins || [];
        admins = _.difference(admins, [userId]);
        await spaceObj.update(space._id, {
            admins: _.uniq(admins)
        })
    }
}

function checkMobile(mobile, config) {
    if (config.mobile_phone_locales) {
        return !(mobile.startsWith('+') || !validator.isMobilePhone(mobile, config.mobile_phone_locales || ['zh-CN']))
    } else {
        let mobileReg = config.mobile_regexp || '^[0-9]{11}$'
        return new RegExp(mobileReg).test(mobile)
    }
}

async function insertVaildate(doc) {
    const spaceObj = getObject('spaces')
    const userObj = getObject('users')
    const suObj = getObject('space_users')
    var selector, space, spaceUserCount, user, userCount;
    if (!doc.space) {
        throw new Error("space_users_error_space_required");
    }
    space = await spaceObj.findOne(doc.space);
    if (!space) {
        throw new Error("space_users_error_space_not_found");
    }

    if (doc.user) {
        user = await userObj.findOne(doc.user, { fields: ['_id'] })
        if (!user) {
            throw new Error("space_users_error_user_not_found");
        }
        spaceUserCount = await suObj.find({
            filters: [
                ['space', '=', doc.space],
                ['user', '=', doc.user]
            ],
            fields: ['_id']
        });

    } else {
        const steedosConfig = getSteedosConfig();
        const config = steedosConfig.accounts || {};
        let email = doc.email;
        let mobile = await decrypValue(doc.mobile);

        if (!email && !mobile) {
            // throw new Error("contact_need_phone_or_email");
        }
        if (email) {
            if (!validator.isEmail(email)) {
                throw new Error("email_format_error");
            }
        }

        if (mobile) {
            if (!checkMobile(mobile, config)) {
                throw new Error("mobile_format_error");
            }
        }

        // 检验手机号和邮箱是不是指向同一个用户(只有手机和邮箱都填写的时候才需要校验)
        // selector = [];
        // if (email) {
        //     selector.push(["email", '=', email]);
        // }

        // if (mobile) {
        //     if (selector.length > 0) {
        //         selector.push('or');
        //     }
        //     selector.push(["mobile", '=', mobile]);
        // }
        // if (doc.username) {
        //     if (selector.length > 0) {
        //         selector.push('or');
        //     }
        //     selector.push(["username", '=', doc.username]);
        // }
        // if (selector.length > 0) {
        //     userCount = await userObj.count({
        //         filters: selector
        //     });

        //     if (userCount > 0) {
        //         throw new Error("space_users_error_user_exists");
        //     }
        //     spaceUserCount = await suObj.count({
        //         filters: [
        //             ['space', '=', doc.space],
        //             selector
        //         ]
        //     });
        // }

        // 当mobile字段为加密后的值时，作为查询条件时，meteorMongo.ts中formatFiltersToMongoQuery的createFilter会报错，所以这里使用db.users.find
        // 检验手机号和邮箱是不是指向同一个用户(只有手机和邮箱都填写的时候才需要校验)
        selector = [];
        if (email) {
            selector.push({
                "email": email
            });
        }
        if (mobile) {
            let selectorMobile = {
                "mobile": mobile
            }
            const objFields = await getObject('space_users').getFields();
            if (objFields.mobile && objFields.mobile.enable_encryption) {
                selectorMobile.mobile = await encrypValue(mobile);
            }
            selector.push(selectorMobile);
        }
        if (doc.username) {
            selector.push({
                "username": doc.username
            });
        }
        if (selector.length > 0) {
            userCount = await new Promise((resolve, reject) => {
                Fiber(function () {
                    try {
                        resolve(db.users.find({
                            $or: selector
                        }).count())
                    } catch (error) {
                        reject(error)
                    }
                }).run()
            })

            if (userCount > 0) {
                throw new Error("space_users_error_user_exists");
            }
            spaceUserCount = await new Promise((resolve, reject) => {
                Fiber(function () {
                    try {
                        resolve(db.space_users.find({
                            space: doc.space,
                            $or: selector
                        }, {
                            fields: {
                                _id: 1
                            }
                        }).count())
                    } catch (error) {
                        reject(error)
                    }
                }).run()
            })
        }

    }

    if (spaceUserCount > 0) {
        throw new Error("space_users_error_space_user_exists");
    }
}

async function updatevaildate(suDoc, doc) {
    const broker = getSteedosSchema().broker
    const spaceObj = getObject('spaces')
    const userObj = getObject('users')
    var ref, ref2, ref3, ref4, ref5, ref6, ref8, repeatEmailUser, space;
    if (suDoc.invite_state === "refused" || suDoc.invite_state === "pending") {
        throw new Error("space_users_error_unaccepted_user_readonly");
    }
    space = await spaceObj.findOne(suDoc.space);
    if (!space) {
        throw new Error("organizations_error_org_admins_only");
    }
    if ((ref = doc) != null ? ref.email : void 0) {
        if (!validator.isEmail(doc.email)) {
            throw new Error("email_format_error");
        }
    }
    let mobile = await decrypValue(doc.mobile);

    if (doc && mobile) {
        const steedosConfig = getSteedosConfig();
        const config = steedosConfig.accounts || {};
        if (!checkMobile(mobile, config)) {
            throw new Error("mobile_format_error");
        }
    }

    if (((ref2 = doc) != null ? ref2.user_accepted : void 0) !== void 0 && !doc.user_accepted) {
        if (space.admins.indexOf(suDoc.user) > 0 || suDoc.user === space.owner) {
            throw new Error("organizations_error_can_not_set_checkbox_true");
        }
    }
    if ((ref3 = doc) != null ? ref3.space : void 0) {
        if (doc.space !== suDoc.space) {
            throw new Error("space_users_error_space_readonly");
        }
    }
    if ((ref4 = doc) != null ? ref4.user : void 0) {
        if (doc.user !== suDoc.user) {
            throw new Error("space_users_error_user_readonly");
        }
    }
    if (_.has(doc, 'email') && !doc.email) {
        throw new Error("space_users_error_email_required");
    }
    if (((ref6 = doc) != null ? ref6.email : void 0) && doc.email !== suDoc.email) {
        const repeatEmailUser = (await userObj.find({
            filters: [
                ['email', '=', doc.email]
            ]
        }))[0];
        if (repeatEmailUser && repeatEmailUser._id !== suDoc.user) {
            throw new Error("space_users_error_email_already_existed");
        }
    }
    if (((ref8 = doc) != null ? ref8.mobile : void 0) && mobile !== suDoc.mobile) {
        let selectorMobile = {
            mobile: mobile
        }
        const objFields = await getObject('space_users').getFields();
        if (objFields.mobile && objFields.mobile.enable_encryption) {
            selectorMobile.mobile = await encrypValue(mobile);
        }
        const mobileUser = await new Promise((resolve, reject) => {
            Fiber(function () {
                try {
                    resolve(db.users.findOne(selectorMobile))
                } catch (error) {
                    reject(error)
                }
            }).run()
        })
        if (mobileUser && mobileUser._id !== suDoc.user) {
            throw new Error("space_users_error_phone_already_existed");
        }
    }

    if (doc && doc.username) {
        await broker.call('users.validateUsername', { username: doc.username, userId: suDoc.user })
    }
}

// 给开启加密的字段加密
async function encryptFields(doc) {
    const objFields = await getObject('space_users').getFields();
    const datasource = getDataSource('default');
    for (const key in objFields) {
        if (Object.hasOwnProperty.call(objFields, key)) {
            const field = objFields[key];
            // 判断是加密字段并且值不为空，且还未加密过
            if (field.enable_encryption && _.has(doc, key) && doc[key] && !doc[key].buffer && !doc[key].sub_type) {
                doc[key] = await datasource.adapter.encryptValue(doc[key]);
            }
        }
    }

}

// 加密
async function encrypValue(value) {
    if (value && !value.buffer && !value.sub_type) {
        const datasource = getDataSource('default');
        return await datasource.adapter.encryptValue(value);
    }
    return value
}

// 解密
async function decrypValue(value) {
    if (value && value.buffer && value.sub_type) {
        const datasource = getDataSource('default');
        return await datasource.adapter.decryptValue(value);
    }
    return value
}

async function vaildateUserUsedByOther(doc) {
    const flowPositionObj = getObject('flow_positions');
    const flowRoleObj = getObject('flow_roles');
    const flowObj = getObject('flows');
    var flowNames, roleNames;
    roleNames = [];
    const flowPostions = await flowPositionObj.find({
        filters: [
            ['space', '=', doc.space],
            ['users', '=', doc.user]
        ],
        fields: ['users', 'role']
    })
    for (const p of flowPostions) {
        var role;
        if (p.users.includes(doc.user)) {
            role = await flowRoleObj.findOne(p.role, { fields: ['name'] });
            if (role) {
                roleNames.push(role.name);
            }
        }
    }
    if (!_.isEmpty(roleNames)) {
        throw new Error("space_users_error_roles_used", {
            names: roleNames.join(',')
        });
    }
    flowNames = [];
    const flows = await flowObj.find({
        filters: [
            ['space', '=', doc.space]
        ],
        fields: ['name', 'current.steps']
    })
    for (const f of flows) {
        for (const s of f.current.steps) {
            if (s.deal_type === 'specifyUser' && s.approver_users.includes(doc.user)) {
                flowNames.push(f.name);
            }
        }
    }

    if (!_.isEmpty(flowNames)) {
        throw new Error("space_users_error_flows_used", {
            names: _.uniq(flowNames).join(',')
        });
    }
}

module.exports = {
    listenTo: 'space_users',

    beforeInsert: async function () {
        const { doc } = this
        const userId = this.userId || doc.created_by
        const broker = getSteedosSchema().broker
        const userObj = getObject('users')
        const orgObj = getObject('organizations')
        var creator, email, id, options, organization;
        if (doc.email) {
            doc.email = doc.email.toLowerCase().trim();
        }
        await insertVaildate(doc);

        if (doc.profile) {
            const isSpaceOwner = await broker.call('spaces.isSpaceOwner', { spaceId: doc.space, userId: userId })
            if (doc.profile === 'admin' && !isSpaceOwner) {
                throw new Error("Only the administrator can set the profile to admin");
            }
        } else {
            doc.profile = 'user'
        }
        if (doc.user) {
            doc.owner = doc.user
            let userDoc = await userObj.findOne(doc.user);
            let syncProp = spaceUserCore.pickNeedSyncProp(userDoc);
            Object.assign(doc, syncProp);
        } else {
            doc.created_by = userId;
            doc.created = new Date();
            doc.modified_by = userId;
            doc.modified = new Date();
            creator = await userObj.findOne(userId);
            doc.locale = doc.locale || creator.locale;
            if ((!doc.user)) {
                if ((doc.is_registered_from_space || doc.is_logined_from_space)) {
                    if (!doc.invite_state) {
                        doc.invite_state = "accepted";
                    }
                    if (!doc.user_accepted) {
                        doc.user_accepted = true;
                    }
                } else {
                    const steedosConfig = getSteedosConfig();
                    if (steedosConfig.tenant && steedosConfig.tenant.saas) {
                        // 云版要求用户接受邀请才让用户在新加入的工作区生效
                        doc.invite_state = "pending";
                        // 云版强制设置user_accepted为false
                        doc.user_accepted = false;
                    }
                    else {
                        // 落地版本不需要用户接受邀请才让用户在新加入的工作区生效，而是直接生效
                        // 落地版本设置user_accepted为传入的值，由管理员在新建用户的界面设置
                        if (!doc.user_accepted) {
                            doc.user_accepted = false;
                        }
                    }
                }

                if (!doc.name) {
                    doc.name = doc.email.split('@')[0];
                }
                // 将用户插入到users表
                id = await userObj._makeNewID();
                options = {
                    name: doc.name,
                    locale: doc.locale,
                    spaces_invited: [doc.space],
                    _id: id,
                    steedos_id: doc.email || id
                };
                if (doc.mobile) {
                    doc.mobile_verified = false;
                    options.mobile = doc.mobile;
                    options.mobile_verified = doc.mobile_verified;
                }
                if (doc.email) {
                    doc.email_verified = false
                    email = [
                        {
                            address: doc.email,
                            verified: doc.email_verified
                        }
                    ];
                    options.emails = email;
                    options.email = doc.email;
                    options.email_verified = doc.email_verified;
                }
                if (doc.username) {
                    options.username = doc.username;
                }

                if (doc.password) {
                    password.parsePassword(doc.password, options);
                    delete doc.password;
                }

                doc.user = (await userObj.insert(options))._id;
            }
            if (!doc.user) {
                throw new Error("space_users_error_user_required");
            }
            if (!doc.name) {
                throw new Error("space_users_error_name_required");
            }
            doc.owner = doc.user
        }
        if (doc.user) {
            doc.owner = doc.user;
        }
        if (doc.organizations && doc.organizations.length > 0) {
            // 如果主组织未设置或设置的值不在doc.organizations内，则自动设置为第一个组织
            if (!doc.organizations.includes(doc.organization)) {
                doc.organization = doc.organizations[0];
            }
        }
        if (doc.organization) {
            organization = await orgObj.findOne(doc.organization, {
                fields: ['company_id']
            });
            if (organization && organization.company_id) {
                doc.company_id = organization.company_id;
            }
        }
    },

    beforeUpdate: async function () {
        const { doc, id, userId } = this
        const broker = getSteedosSchema().broker
        const suObj = getObject('space_users')
        const orgObj = getObject('organizations')
        const userObj = getObject('users')
        const suDoc = await suObj.findOne(id)
        var lang, newEmail, newMobile, organization, paramString, params;
        if (doc.email) {
            doc.email = doc.email.toLowerCase().trim();
        }

        if (_.has(doc, 'contact_id') && suDoc.contact_id != doc.contact_id) {
            throw new Error("space_users_error_not_change_contact_id");
        }

        if (_.has(doc, 'profile') && suDoc.profile != doc.profile) {
            const isSpaceAdmin = await broker.call('spaces.isSpaceAdmin', { spaceId: suDoc.space, userId: userId })
            if (!isSpaceAdmin) {
                throw new Error("can not change profile");
            }

            // 管理员不允许把自己的简档设置为非管理员 #804
            if (suDoc.user === userId && doc.profile != 'admin') {
                throw new Error('spaces_error_space_admins_required');
            }

            if (suDoc.profile === 'admin') {
                await removeSpaceAdmin(suDoc.space, suDoc.user);
            }

            if (doc.profile === 'admin') {
                await addSpaceAdmin(suDoc.space, suDoc.user);
            }
        }

        await updatevaildate(suDoc, doc);

        if (doc.organizations && doc.organizations.length > 0) {
            // 修改所有组织后，强制把主组织自动设置为第一个组织
            doc.organization = doc.organizations[0];
        }
        if (doc.organization) {
            organization = await orgObj.findOne(doc.organization, {
                fields: ['company_id', 'parent']
            });
            if (organization) {
                if (organization.company_id) {
                    doc.company_id = organization.company_id;
                } else {
                    // 如果所属主部门的company_id不存在，则清除当前用户company_id值，而不是查找并设置为根组织Id
                    doc.company_id = null
                }
            }
        }
        newMobile = await decrypValue(doc.mobile);


        if (newMobile !== suDoc.mobile) {

            if (newMobile) {
                doc.mobile_verified = false
            }

            if (newMobile) {
                // 修改人
                const userSession = await auth.getSessionByUserId(suDoc.user);
                lang = userSession.locale;

                if (newMobile && (/^1[3456789]\d{9}$/.test(newMobile))) {
                    params = {
                        name: "系统",
                        number: newMobile ? newMobile : t('space_users_empty_phone', {}, lang)
                    };
                    paramString = JSON.stringify(params);
                    if (suDoc.mobile && suDoc.mobile_verified) {
                        // 发送手机短信给修改前的手机号
                        await broker.call('sms.send', {
                            Format: 'JSON',
                            Action: 'SingleSendSms',
                            ParamString: paramString,
                            RecNum: suDoc.mobile,
                            SignName: 'OA系统',
                            TemplateCode: 'SMS_67660108',
                            msg: t('sms.chnage_mobile.template', params, lang)
                        });
                    }
                }
            }
        }
        newEmail = doc.email;
        if (newEmail && newEmail !== suDoc.email) {
            doc.email_verified = false;
        }

        if (suDoc.password) {
            let updateObj = {}
            password.parsePassword(suDoc.password, updateObj);
            delete suDoc.password;
            await userObj.update(suDoc.user, updateObj)
        }

        if (doc.user_accepted !== void 0 && !doc.user_accepted) {
            // 禁用、从工作区移除用户时，检查用户是否被指定为角色成员或者步骤指定处理人 #1288
            await vaildateUserUsedByOther(suDoc);
        }
    },

    beforeDelete: async function () {
        throw new Error("space_users_error_can_not_remove");
    },

    afterInsert: async function () {
        const { doc } = this
        const broker = getSteedosSchema().broker
        const contactsObj = getObject('contacts')
        if (doc.organizations) {
            for (const org of doc.organizations) {
                await broker.call('organizations.updateUsers', { orgId: org })
            }
        }
        if (doc.contact_id) {
            await contactsObj.directUpdate(doc.contact_id, {
                user: doc.user
            })
        }

        if (doc.profile === 'admin') {
            await addSpaceAdmin(doc.space, doc.user);
        }

        if (doc.organizations) {
            await broker.call('space_users.update_organizations_parents', { suId: doc._id, orgIds: doc.organizations })
            await broker.call('space_users.update_company_ids', { suId: doc._id })
        }
    },

    afterUpdate: async function () {
        const { doc, previousDoc, id } = this
        const broker = getSteedosSchema().broker
        await spaceUserCore.syncUserInfo(previousDoc, doc);

        if (doc.organizations) {
            for (const org of doc.organizations) {
                await broker.call('organizations.updateUsers', { orgId: org })
            }
        }
        if (previousDoc.organizations) {
            for (const org of previousDoc.organizations) {
                await broker.call('organizations.updateUsers', { orgId: org })
            }
        }

        if (doc.organizations) {
            await broker.call('space_users.update_organizations_parents', { suId: id, orgIds: doc.organizations })
            await broker.call('space_users.update_company_ids', { suId: id })
        }
    },

    afterDelete: async function () {

    },

}