/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-11 10:54:51
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-08-17 15:06:54
 * @Description: 发送通知服务
 */
"use strict";
const Fiber = require("fibers");
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
module.exports = {
    name: 'notifications',
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
         * @api {post} add 发送通知
         * @apiName add
         * @apiGroup notifications.service.js
         * @apiParam {Object} message 消息主体
         * @apiParam {String} message[name] 消息标题
         * @apiParam {String} message[body] 消息内容
         * @apiParam {String} message[related_to] 关联记录
         * @apiParam {String} message[related_name] 关联名称
         * @apiParam {String} message[from] 发送者ID，选填
         * @apiParam {String} message[space] 工作区ID
         * @apiParam {String} from 发送者ID
         * @apiParam {String[]} to 接受者ID
         */
        add: {
            params: {
                message: {
                    type: "object",
                    props: {
                        name: { type: "string" },
                        body: { type: "string" },
                        related_to: {
                            type: "object",
                            props: {
                                o: { type: "string" },
                                ids: { type: "array", items: "string" },
                            }
                        },
                        related_name: { type: "string", optional: true },
                        from: { type: "string", optional: true },
                        space: { type: "string" },
                    }
                },
                from: { type: "string" },
                to: {
                    type: "multi",
                    rules: [
                        { type: "string" },
                        { type: "array", items: "string" }
                    ]
                },
            },
            async handler(ctx) {
                this.broker.logger.info('[service][notifications]===>', 'add', ctx.params)
                return Fiber(function () {
                    Creator.addNotifications(
                        ctx.params.message,
                        ctx.params.from,
                        ctx.params.to
                    );
                }).run();
            }
        },
        /**
         * @api {post} remove 删除通知
         * @apiName remove
         * @apiGroup notifications.service.js
         * @apiParam {Object} doc 消息主体
         * @apiParam {String} doc[_id] 消息ID
         * @apiParam {String[]} assignees 接受者ID
         * @apiParam {String} objectName 关联对象名称
         */
        remove: {
            params: {
                doc: {
                    type: "object",
                    props: {
                        _id: { type: "string" },
                    }
                },
                assignees: {
                    type: "array", items: "string"
                },
                objectName: { type: "string" },
            },
            async handler(ctx) {
                this.broker.logger.info('[service][notifications]===>', 'remove', ctx.params)
                return Fiber(function () {
                    Creator.removeNotifications(
                        ctx.params.doc,
                        ctx.params.assignees,
                        ctx.params.objectName
                    );
                }).run();
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
        this.broker.logger.info('[service][notifications]===>', 'started')
    },

    /**
     * Service stopped lifecycle event handler
     */
    async stopped() {

    }
};
