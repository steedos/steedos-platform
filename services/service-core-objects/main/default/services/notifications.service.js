// eslint-disable-next-line @typescript-eslint/no-require-imports
const _ = require("lodash");
const objectql = require('@steedos/objectql');

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
                let { from, to, message } = ctx.params;
                this.broker.emit('notifications.add', {from, to, message})


                let notifications_ids = [];
                if(!_.isArray(to) && _.isString(to)){
                    to = [to]
                }

                if (_.isEmpty(to)) {
                    return
                }
                let now = new Date();
                const datasource = objectql.getDataSource('default');
                const adapter = datasource.adapter
                await adapter.connect()
                const collection = adapter.collection('notifications');
                let bulk = collection.initializeUnorderedBulkOp();

                let doc = Object.assign({
                    created: now,
                    modified: now,
                    created_by: from,
                    modified_by: from
                }, message)

                for (const userId of to) {
                    let notifications_id = await objectql.getObject('notifications')._makeNewID();
                    bulk.insert(Object.assign({}, doc, {_id: notifications_id, owner: userId}));
                    notifications_ids.push(notifications_id)
                }

                bulk.execute().catch(function (error) {
                    console.error("通知数据插入失败，错误信息：", error);
                });

                try {
                    this.broker.emit(`notifications.hasBeenSent`, {
                        ids: notifications_ids
                    });
                    await ctx.broker.call('b6-microservice.broadcast', {name: '$notification.users', data: {tenantId: message.space, users: to, message: {name: message.name, body: message.body}}})
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (e) { console.log(e) }
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
                const { doc, assignees, objectName } = ctx.params;
                const datasource = objectql.getDataSource('default');
                const adapter = datasource.adapter
                await adapter.connect()
                const collection = adapter.collection('notifications');
                let bulk = collection.initializeUnorderedBulkOp();
                assignees.forEach(function (assignee) {
                    bulk.find({
                        "related_to.o": objectName,
                        "related_to.ids": doc._id,
                        owner: assignee
                    }).remove();
                });
                return bulk.execute().catch(function (error) {
                    console.error("通知数据删除失败，错误信息：", error);
                });
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
