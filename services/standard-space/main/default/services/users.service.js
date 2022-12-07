/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-02 16:53:23
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-07 19:23:03
 * @Description: 
 */
"use strict";
const { getObject, getSteedosConfig } = require("@steedos/objectql")
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
module.exports = {
    name: 'users',
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
         * @api {call} validateUsername 验证用户名格式
         * @apiName validateUsername
         * @apiGroup users.service.js
         * @apiParam {String} username 用户名
         * @apiParam {String} userId 用户ID
         */
        validateUsername: {
            params: {
                username: { type: "string" },
                userId: { type: "string" },
            },
            async handler(ctx) {
                this.broker.logger.info('[service][users]===>', 'validateUsername', ctx.params)
                return await this.validateUsername(ctx.params.username, ctx.meta.userId)
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
         * 验证用户名格式
         * @param {*} username 
         * @param {*} userId 
         */
        async validateUsername(username, userId) {
            const userObj = getObject('users')
            var nameValidation, user;
            user = (await userObj.find({
                filters: [
                    ['username', '=', username],
                    ['_id', '!=', userId]
                ]
            }))[0];
            if (user) {
                throw new Error('username-unavailable', 'username-unavailable');
            }
            const steedosConfig = getSteedosConfig();
            const accountsConfig = steedosConfig.public.accounts || {};
            if (!accountsConfig.is_username_skip_minrequiredlength) {
                if (username.length < 6) {
                    throw new Error('username-minrequiredlength', "username-minrequiredlength");
                }
            }
            try {
                if (accountsConfig.UTF8_Names_Validation) {
                    nameValidation = new RegExp('^' + accountsConfig.UTF8_Names_Validation + '$');
                } else {
                    nameValidation = new RegExp('^[A-Za-z0-9-_.\u00C0-\u017F\u4e00-\u9fa5]+$');
                }
            } catch (error) {
                nameValidation = new RegExp('^[A-Za-z0-9-_.\u00C0-\u017F\u4e00-\u9fa5]+$');
            }
            if (!nameValidation.test(username)) {
                throw new Error('username-invalid', "username-invalid");
            }
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
        this.broker.logger.info('[service][users]===>', 'started')
    },

    /**
     * Service stopped lifecycle event handler
     */
    async stopped() {

    }
};
