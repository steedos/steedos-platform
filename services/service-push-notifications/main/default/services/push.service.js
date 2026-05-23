"use strict";
const objectql = require('@steedos/objectql');
const _ = require('lodash');
const { createProviderRegistry } = require('../../src/providers');

module.exports = {
    name: 'push-notifications',
    namespace: "steedos",
    mixins: [],
    settings: {
        rest: "/push"
    },

    actions: {
        /**
         * 注册/更新推送设备
         * 客户端获取到 CID 或 FCM token 后调用此接口
         */
        register: {
            rest: {
                method: "POST",
                path: "/register"
            },
            params: {
                device_id: { type: "string" },
                platform: { type: "enum", values: ["ios", "android"] },
                provider: { type: "enum", values: ["getui", "fcm"] },
                device_name: { type: "string", optional: true },
            },
            async handler(ctx) {
                const user = ctx.meta.user;
                if (!user || !user.userId) {
                    throw new Error('Unauthorized');
                }
                const { device_id, platform, provider, device_name } = ctx.params;
                const obj = objectql.getObject('push_devices');

                // Upsert: 同一 device_id 只保留一条记录
                const existing = await obj.find({
                    filters: [['device_id', '=', device_id]],
                    fields: ['_id']
                });

                const now = new Date();
                if (existing.length > 0) {
                    await obj.directUpdate(existing[0]._id, {
                        owner: user.userId,
                        platform,
                        provider,
                        device_name: device_name || undefined,
                        is_active: true,
                        last_active: now,
                        space: user.spaceId,
                    });
                    return { _id: existing[0]._id, device_id };
                } else {
                    const record = await obj.directInsert({
                        device_id,
                        platform,
                        provider,
                        device_name: device_name || '',
                        is_active: true,
                        last_active: now,
                        owner: user.userId,
                        space: user.spaceId,
                    });
                    return { _id: record._id, device_id };
                }
            }
        },

        /**
         * 注销推送设备（用户登出时调用）
         */
        unregister: {
            rest: {
                method: "POST",
                path: "/unregister"
            },
            params: {
                device_id: { type: "string" },
            },
            async handler(ctx) {
                const { device_id } = ctx.params;
                const obj = objectql.getObject('push_devices');

                const existing = await obj.find({
                    filters: [['device_id', '=', device_id]],
                    fields: ['_id']
                });

                for (const record of existing) {
                    await obj.directUpdate(record._id, { is_active: false });
                }

                return { success: true };
            }
        },
    },

    events: {
        /**
         * 监听已有的通知事件，触发推送
         */
        'notifications.add': {
            async handler(payload) {
                await this.handlePush(payload);
            }
        }
    },

    methods: {
        async handlePush({ from, to, message }) {
            if (!this.providers || this.providers.size === 0) {
                return;
            }

            const userIds = _.isArray(to) ? to : [to];
            if (_.isEmpty(userIds)) {
                return;
            }

            try {
                const obj = objectql.getObject('push_devices');
                const devices = await obj.find({
                    filters: [
                        ['owner', 'in', userIds],
                        ['is_active', '=', true]
                    ],
                    fields: ['_id', 'device_id', 'platform', 'provider', 'owner']
                });

                if (_.isEmpty(devices)) {
                    return;
                }

                // 按 provider 分组
                const grouped = _.groupBy(devices, 'provider');

                for (const [providerName, deviceList] of Object.entries(grouped)) {
                    const provider = this.providers.get(providerName);
                    if (!provider) {
                        this.logger.warn(`Push provider "${providerName}" not registered, skipping ${deviceList.length} devices`);
                        continue;
                    }

                    try {
                        const result = await provider.send(deviceList, {
                            title: message.name || '',
                            body: message.body || '',
                            data: {
                                related_to: message.related_to ? JSON.stringify(message.related_to) : '',
                                space: message.space || '',
                            }
                        });

                        // 处理失效设备
                        if (result && result.invalidDeviceIds && result.invalidDeviceIds.length > 0) {
                            for (const invalidId of result.invalidDeviceIds) {
                                const device = deviceList.find(d => d.device_id === invalidId);
                                if (device) {
                                    await obj.directUpdate(device._id, { is_active: false });
                                }
                            }
                        }
                    } catch (e) {
                        this.logger.error(`Push failed [${providerName}]:`, e.message);
                    }
                }
            } catch (e) {
                this.logger.error('Push notification handling error:', e.message);
            }
        }
    },

    async started() {
        this.providers = createProviderRegistry(this.logger);
        if (this.providers.size > 0) {
            this.logger.info(`Push notification providers registered: ${[...this.providers.keys()].join(', ')}`);
        } else {
            this.logger.warn('No push notification providers configured. Set PUSH_GETUI_* or PUSH_FCM_* environment variables to enable.');
        }
    },

    async stopped() {
        this.providers = null;
    }
};
