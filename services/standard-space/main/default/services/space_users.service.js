/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-06 18:08:21
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-06 20:13:31
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
