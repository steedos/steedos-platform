/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-14 10:26:50
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-14 16:28:03
 * @Description: 
 */
const { getObjectProcessDefinition, recordSubmit } = require('@steedos/process')
"use strict";
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
module.exports = {
    name: 'approval_process',
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
         * @api {call} submit 提请批准
         * @apiName submit
         * @apiGroup approval_process.service.js
         * @apiParam {String} objectName 对象API Name
         * @apiParam {String} recordId 记录ID
         * @apiParam {String} comment 意见
         * @apiParam {String} approver 批准人
         * @apiSuccess {Object} 返回提请批准结果
         * @apiExample {js} 示例:
         *     await broker.call('approval_process.submit', {
         *         objectName: '',
         *         recordId: '',
         *         comment: '',
         *         approver: ''
         *     }, { meta: { user: userSession } })
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       "state": "SUCCESS"
         *     }
         * @apiErrorExample {json} Error-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       "state": "FAILURE",
         *       "error": ""
         *     }
         */
        submit: {
            params: {
                objectName: { type: 'string' },
                recordId: { type: 'string' },
                comment: { type: 'string', optional: true },
                approver: { type: 'string', optional: true },
            },
            async handler(ctx) {
                try {
                    this.broker.logger.info('[service][approval_process]===>', 'submit', ctx.params.name)
                    const userSession = ctx.meta.user;
                    const params = ctx.params;
                    const objectName = params.objectName;
                    const recordId = params.recordId;
                    const comment = params.comment;
                    const approver = params.approver;

                    const processDefinition = await getObjectProcessDefinition(objectName, recordId, userSession);
                    if (!processDefinition) {
                        throw new Error('process_approval_error_notFindProcessDefinition');
                    }
                    await recordSubmit(processDefinition._id, objectName, recordId, userSession, comment, approver);
                    return { state: 'SUCCESS' };
                } catch (error) {
                    return { state: 'FAILURE', error: error.message };
                }

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

    },

    /**
     * Service created lifecycle event handler
     */
    async created() {

    },

    /**
     * Service started lifecycle event handler
     */
    async started() {
        this.broker.logger.info('[service][approval_process]===>', 'started')
    },

    /**
     * Service stopped lifecycle event handler
     */
    async stopped() {

    }
};
