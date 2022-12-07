/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-06 18:08:21
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-07 20:25:36
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
        this.broker.logger.info('[service][organizations]===>', 'started')
    },

    /**
     * Service stopped lifecycle event handler
     */
    async stopped() {

    }
};
