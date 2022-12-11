/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-09 15:12:46
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-11 11:17:21
 * @Description: 短信发送服务
 */
"use strict";
const { getObject } = require("@steedos/objectql")
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
module.exports = {
    name: 'sms',
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
         * @api {post} sent 更新组织
         * @apiName sent
         * @apiGroup sms.service.js
         * @apiParam {String} Format 默认值JSON，选填
         * @apiParam {String} Action 发送类型默认值SingleSendSms，选填
         * @apiParam {String} ParamString 参数，选填
         * @apiParam {String} RecNum 接收手机号
         * @apiParam {String} SignName 签名，选填
         * @apiParam {String} TemplateCode 模板代码，选填
         * @apiParam {String} msg 短信内容
         * @apiParam {String} createdBy 发送者，选填
         * @apiParam {String} spaceId 工作区ID，选填
         */
        send: {
            params: {
                Format: { type: "string", optional: true },
                Action: { type: "string", optional: true },
                ParamString: { type: "string", optional: true },
                RecNum: { type: "string" },
                SignName: { type: "string", optional: true },
                TemplateCode: { type: "string", optional: true },
                msg: { type: "string" },
                createdBy: { type: "string", optional: true },
                spaceId: { type: "string", optional: true },
            },
            async handler(ctx) {
                this.broker.logger.info('[service][sms]===>', 'sent', ctx.params)
                const smsQueueObj = getObject('_sms_queue')
                const options = ctx.params
                var sms = {
                    createdAt: new Date(),
                    createdBy: options.createdBy || '<SERVER>'
                };
                if (Match.test(options, Object)) {
                    sms.sms = _.pick(options, 'Format', 'Action', 'ParamString', 'RecNum', 'SignName', 'TemplateCode', 'msg');
                }
                sms.sent = false;
                sms.sending = 0;
                if(options.createdBy){
                    sms.owner = options.createdBy
                }
                if(options.spaceId){
                    sms.space = spaceId
                }
                return await smsQueueObj.insert(sms);
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
    created() {

    },

    /**
     * Service started lifecycle event handler
     */
    async started() {
        this.broker.logger.info('[service][sms]===>', 'started')
    },

    /**
     * Service stopped lifecycle event handler
     */
    async stopped() {

    }
};
