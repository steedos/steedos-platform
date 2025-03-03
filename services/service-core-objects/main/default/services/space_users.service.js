/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-06 18:08:21
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-03-03 11:46:10
 * @Description: 
 */

"use strict";
const { getObject } = require("@steedos/objectql")
const _ = require("underscore");
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
module.exports = {
    name: 'space_users',
    namespace: "steedos",
    mixins: [],
    /**
     * Settings
     */
    settings: {

    },

    /**
     * Dependencies
     */
    dependencies: [],

    /**
     * Actions
     */
    actions: {
        /**
         * @api {post} /service/api/space_users/disable 禁用人员
         * @apiName disable
         * @apiGroup space_users.service.js
         * @apiParam {String} suId 人员ID
         * @apiSuccess {Object} 返回禁用结果
         */
        disable: {
            rest: {
                method: "POST",
                path: "/disable"
            },
            params: {
                suId: { type: "string" }
            },
            async handler(ctx) {
                this.broker.logger.info('[service][space_users]===>', '/service/api/space_users/disable', ctx.params.suId)
                return await this.disable(ctx.params.suId, ctx.meta.user)
            }
        },
        /**
         * @api {post} /service/api/space_users/enable 启用人员
         * @apiName enable
         * @apiGroup space_users.service.js
         * @apiParam {String} suId 人员ID
         * @apiSuccess {Object} 返回启用结果
         */
        enable: {
            rest: {
                method: "POST",
                path: "/enable"
            },
            params: {
                suId: { type: "string" }
            },
            async handler(ctx) {
                this.broker.logger.info('[service][space_users]===>', '/service/api/space_users/enable', ctx.params.suId)
                return await this.enable(ctx.params.suId, ctx.meta.user)
            }
        },
        /**
         * @api {post} /service/api/space_users/is_lockout 人员是否已锁定
         * @apiName is_lockout
         * @apiGroup space_users.service.js
         * @apiParam {String} suId 人员ID
         * @apiSuccess {Object} 返回人员是否已锁定结果
         */
        is_lockout: {
            rest: {
                method: "POST",
                path: "/is_lockout"
            },
            params: {
                suId: { type: "string" }
            },
            async handler(ctx) {
                this.broker.logger.info('[service][space_users]===>', '/service/api/space_users/is_lockout', ctx.params.suId)
                return await this.is_lockout(ctx.params.suId)
            }
        },
        /**
         * @api {post} /service/api/space_users/lockout 人员锁定
         * @apiName lockout
         * @apiGroup space_users.service.js
         * @apiParam {String} suId 人员ID
         * @apiSuccess {Object} 返回人员锁定结果
         */
        lockout: {
            rest: {
                method: "POST",
                path: "/lockout"
            },
            params: {
                suId: { type: "string" }
            },
            async handler(ctx) {
                this.broker.logger.info('[service][space_users]===>', '/service/api/space_users/lockout', ctx.params.suId)
                return await this.lockout(ctx.params.suId, ctx.meta.user)
            }
        },
        /**
         * @api {post} /service/api/space_users/unlock 人员解锁
         * @apiName unlock
         * @apiGroup space_users.service.js
         * @apiParam {String} suId 人员ID
         * @apiSuccess {Object} 返回人员解锁结果
         */
        unlock: {
            rest: {
                method: "POST",
                path: "/unlock"
            },
            params: {
                suId: { type: "string" }
            },
            async handler(ctx) {
                this.broker.logger.info('[service][space_users]===>', '/service/api/space_users/unlock', ctx.params.suId)
                return await this.unlock(ctx.params.suId, ctx.meta.user)
            }
        },
        /**
         * @api {post} /service/api/space_users/is_password_empty 人员密码是否为空
         * @apiName is_password_empty
         * @apiGroup space_users.service.js
         * @apiParam {String} suId 人员ID
         * @apiSuccess {Object} 返回人员密码是否为空结果
         */
         is_password_empty: {
            rest: {
                method: "POST",
                path: "/is_password_empty"
            },
            params: {
                suId: { type: "string" }
            },
            async handler(ctx) {
                this.broker.logger.info('[service][space_users]===>', '/service/api/space_users/is_password_empty', ctx.params.suId)
                return await this.is_password_empty(ctx.params.suId)
            }
        },
        /**
         * @api {post} update_organizations_parents 更新人员所属父组织节点
         * @apiName update_organizations_parents
         * @apiGroup space_users.service.js
         * @apiParam {String} suId 人员ID
         * @apiParam {String[]} orgIds 组织IDs
         * @apiSuccess {Boolean} 
         */
        update_organizations_parents: {
            params: {
                suId: { type: "string" },
                orgIds: { type: "array", items: "string" },
            },
            async handler(ctx) {
                this.broker.logger.info('[service][space_users]===>', 'update_organizations_parents', ctx.params)
                return this.update_organizations_parents(ctx.params.suId, ctx.params.orgIds)
            }
        },
        /**
         * @api {post} update_company_ids 更新所属分部
         * @apiName update_company_ids
         * @apiGroup space_users.service.js
         * @apiParam {String} suId 人员ID
         * @apiSuccess {Boolean} 
         */
        update_company_ids: {
            params: {
                suId: { type: "string" },
            },
            async handler(ctx) {
                this.broker.logger.info('[service][space_users]===>', 'update_company_ids', ctx.params)
                return this.update_company_ids(ctx.params.suId)
            }
        },

    },

    /**
     * Events
     */
    events: {

    },

    /**
     * Methods
     */
    methods: {
        /**
         * 禁用人员
         * @param {*} suId 
         * @param {*} userSession 
         * @returns 
         */
        async disable(suId, userSession) {
            const spaceUser = await getObject('space_users').findOne(suId, { fields: ["user_accepted", "user", "profile", "company_ids"] });

            const companyIds = spaceUser.company_ids;

            let isAdmin = userSession.is_space_admin;
            if (!isAdmin && companyIds && companyIds.length) {
                const query = {
                    fields: ['admins'],
                    filters: [['_id', '=', companyIds], ['space', '=', userSession.spaceId]]
                }
                const companys = await getObject("company").find(query);
                isAdmin = _.any(companys, (item) => {
                    return item.admins && item.admins.indexOf(userSession.userId) > -1
                })
            }

            if (!isAdmin) {
                throw new Error('space_users_method_disable_enable_error_only_admin')
            }
            if (spaceUser.user === userSession.userId) {
                throw new Error('space_users_method_disable_enable_error_can_not_own')
            }
            if (!spaceUser.user_accepted) {
                throw new Error('space_users_method_disable_error_can_not_disable_disabled')
            }
            let result = await this.doDisable(spaceUser);
            if (result) {
                return { success: true }
            }
            else {
                throw new Error('The space_users/users directUpdate return nothing.')
            }
        },
        /**
         * 执行禁用人员操作
         * @param {*} spaceUser 
         * @return 
         */
        async doDisable(spaceUser) {
            try {
                const userObj = getObject('users')
                const suObj = getObject('space_users')
                // MongoError: E11000 duplicate key error collection: users index: c2_steedos_id dup key: { steedos_id: null }
                // 暂不调整steedos_id等属性 username: null, mobile: null, mobile_verified: null, email: null, email_verified: null, emails: null, steedos_id: null
                let result = await userObj.directUpdate(spaceUser.user, { user_accepted: false, profile: spaceUser.profile });
                if (!result) {
                    console.error("The users directUpdate return nothing.");
                    return false;
                }
                // 暂不调整username: null, mobile: null, mobile_verified: null, email: null, email_verified: null
                result = await suObj.directUpdate(spaceUser._id, { user_accepted: false, profile: spaceUser.profile });
                return result;
            } catch (error) {
                this.logger.error(error);
                return false;
            }
        },
        /**
         * 启用人员
         * @param {*} suId 
         * @param {*} userSession 
         * @returns 
         */
        async enable(suId, userSession) {
            const spaceUser = await getObject('space_users').findOne(suId, { fields: ["user_accepted", "user", "profile", "company_ids"] });

            const companyIds = spaceUser.company_ids;

            let isAdmin = userSession.is_space_admin;
            if (!isAdmin && companyIds && companyIds.length) {
                const query = {
                    fields: ['admins'],
                    filters: [['_id', '=', companyIds], ['space', '=', userSession.spaceId]]
                }
                const companys = await getObject("company").find(query);
                isAdmin = _.any(companys, (item) => {
                    return item.admins && item.admins.indexOf(userSession.userId) > -1
                })
            }

            if (!isAdmin) {
                throw new Error('space_users_method_disable_enable_error_only_admin')
            }
            if (spaceUser.user === userSession.userId) {
                throw new Error('space_users_method_disable_enable_error_can_not_own')
            }
            if (spaceUser.user_accepted) {
                throw new Error('space_users_method_enable_error_can_not_enable_enabled')
            }
            let result = await getObject('space_users').updateOne(suId, { user_accepted: true, profile: spaceUser.profile });
            if (result) {
                return { success: true }
            }
            else {
                throw new Error('The object updateOne return nothing.')
            }
        },
        /**
         * 人员是否已锁定
         * @param {*} suId 
         * @returns 
         */
        async is_lockout(suId) {
            let spaceUser = await getObject('space_users').findOne(suId, { fields: ["user"] });
            let result = await getObject('users').findOne(spaceUser.user)
            if (result) {
                return { lockout: result.lockout || false }
            }
            else {
                throw new Error("user not find.")
            }
        },
        /**
         * 人员锁定
         * @param {*} suId 
         * @param {*} userSession 
         * @returns 
         */
        async lockout(suId, userSession) {
            let spaceUser = await getObject('space_users').findOne(suId, { fields: ["user_accepted", "user", "profile", "company_ids"] });

            const companyIds = spaceUser.company_ids;

            let isAdmin = userSession.is_space_admin;
            if (!isAdmin && companyIds && companyIds.length) {
                const query = {
                    fields: ['admins'],
                    filters: [['_id', '=', companyIds], ['space', '=', userSession.spaceId]]
                }
                const companys = await getObject("company").find(query);
                isAdmin = _.any(companys, (item) => {
                    return item.admins && item.admins.indexOf(userSession.userId) > -1
                })
            }

            if (!isAdmin) {
                throw new Error("space_users_method_unlock_lockout_error_only_admin")
            }
            if (spaceUser.user === userSession.userId) {
                throw new Error("不能锁定您自己的帐户。")
            }
            let result = await getObject('users').updateOne(spaceUser.user, { lockout: true });
            if (result) {
                return { success: true }
            }
            else {
                throw new Error("The object updateOne return nothing.")
            }
        },
        /**
         * 人员解锁
         * @param {*} suId 
         * @param {*} userSession 
         * @returns 
         */
        async unlock(suId, userSession) {
            let spaceUser = await getObject('space_users').findOne(suId, { fields: ["user_accepted", "user", "profile", "company_ids"] });

            const companyIds = spaceUser.company_ids;

            let isAdmin = userSession.is_space_admin;
            if (!isAdmin && companyIds && companyIds.length) {
                const query = {
                    fields: ['admins'],
                    filters: [['_id', '=', companyIds], ['space', '=', userSession.spaceId]]
                }
                const companys = await objectql.getObject("company").find(query);
                isAdmin = _.any(companys, (item) => {
                    return item.admins && item.admins.indexOf(userSession.userId) > -1
                })
            }

            if (!isAdmin) {
                throw new Error("space_users_method_unlock_lockout_error_only_admin")
            }
            let result = await getObject('users').updateOne(spaceUser.user, { lockout: false, login_failed_number: 0, login_failed_lockout_time: undefined });
            if (result) {
                return { success: true }
            }
            else {
                throw new Error("The object updateOne return nothing.")
            }
        },
        /**
         * 人员密码是否为空
         * @param {*} suId 
         * @returns 
         */
        async is_password_empty(suId) {
            let spaceUser = await getObject('space_users').findOne(suId, { fields: ["user"] });
            const result = await getObject('users').findOne(spaceUser.user, { fields:["services.password"] });
            if(result){
                return { empty: !!!(result.services && result.services.password && (result.services.password.bcrypt || result.services.password.bcrypts)) }
            }
            else{
                throw new Error('未找到用户');
            }
        },
        /**
         * 更新人员所属父组织节点
         * @param {*} suId 
         * @param {*} orgIds 
         * @returns true/false
         */
        async update_organizations_parents(suId, orgIds) {
            const orgObj = getObject('organizations')
            const suObj = getObject('space_users')
            var organizations_parents, orgs;
            orgs = await orgObj.find({
                filters: [
                    ['_id', 'in', orgIds]
                ],
                fields: ['parents']
            });
            organizations_parents = _.compact(_.uniq(_.flatten([orgIds, _.pluck(orgs, 'parents')])));
            return !!(await suObj.directUpdate(suId, {
                organizations_parents: organizations_parents
            }))
        },
        /**
         * 更新人员所属分部
         * @param {*} _id 
         * @returns 
         */
        async update_company_ids(_id) {
            const suObj = getObject('space_users')
            const orgObj = getObject('organizations')
            var company_ids, orgs;
            const su = await suObj.findOne(_id, {
                fields: ['organizations', 'company_id', 'space']
            });
            if (!su) {
                console.error("update_company_ids,can't find space_users by _id of:", _id);
                return;
            }
            orgs = await orgObj.find({
                filters: [
                    ['_id', 'in', su.organizations]
                ],
                fields: ['company_id']
            });
            company_ids = _.pluck(orgs, 'company_id');
            // company_ids中的空值就空着，不需要转换成根组织ID值
            company_ids = _.uniq(_.compact(company_ids));
            await suObj.directUpdate(_id, {
                company_ids: company_ids
            });
        }
    },

    /**
     * Service created lifecycle event handler
     */
    created() {

    },

    /**
     * Service started lifecycle event handler
     */
    async started() {
        this.broker.logger.info('[service][space_users]===>', 'started')
    },

    /**
     * Service stopped lifecycle event handler
     */
    async stopped() {

    }
};
