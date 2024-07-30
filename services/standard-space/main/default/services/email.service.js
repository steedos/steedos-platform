/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-07-30 13:43:46
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-07-30 13:49:42
 * @Description: 
 */
"use strict";
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
module.exports = {
    name: 'email',
    namespace: "steedos",
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
        send: {
            params: {
                from: { type: "string", optional: true },
                to: { type: "string", optional: true },
                subject: { type: "string", optional: true },
                body: { type: "string" },
            },
            async handler(ctx) {
                const options = ctx.params
                try {
                    Fiber(function () {
                        MailQueue.send({
                            from: options.from,
                            to: options.to,
                            subject: options.subject,
                            html: options.body,
                        });
                    }).run();
                } catch (error) {
                    console.error('发送邮件失败:', error);
                }
            }
        },
    }
};
