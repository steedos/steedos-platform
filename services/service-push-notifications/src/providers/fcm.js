"use strict";
const fs = require('fs');

/**
 * FCM HTTP V1 API Provider（可选，海外用户）
 * 文档: https://firebase.google.com/docs/cloud-messaging/send-message
 *
 * 需要依赖: google-auth-library（若未安装则不可用）
 */
class FcmProvider {
    constructor(config, logger) {
        this.logger = logger;

        const saContent = fs.readFileSync(config.serviceAccountPath, 'utf8');
        this.serviceAccount = JSON.parse(saContent);
        this.projectId = this.serviceAccount.project_id;

        // 延迟加载 google-auth-library
        try {
            const { GoogleAuth } = require('google-auth-library');
            this.auth = new GoogleAuth({
                credentials: this.serviceAccount,
                scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
            });
        } catch (e) {
            throw new Error('FCM provider requires "google-auth-library" package. Run: npm install google-auth-library');
        }
    }

    /**
     * 推送消息到设备列表
     * @param {Array} devices - 设备记录列表，每条包含 device_id (FCM token)
     * @param {Object} message - { title, body, data }
     * @returns {{ invalidDeviceIds: string[] }}
     */
    async send(devices, message) {
        const client = await this.auth.getClient();
        const url = `https://fcm.googleapis.com/v1/projects/${this.projectId}/messages:send`;
        const invalidDeviceIds = [];

        const promises = devices.map(async (device) => {
            try {
                await client.request({
                    url,
                    method: 'POST',
                    data: {
                        message: {
                            token: device.device_id,
                            notification: {
                                title: message.title,
                                body: message.body,
                            },
                            data: message.data ? Object.fromEntries(
                                Object.entries(message.data).map(([k, v]) => [k, String(v)])
                            ) : undefined,
                        }
                    }
                });
            } catch (e) {
                // UNREGISTERED or INVALID_ARGUMENT 表示 token 失效
                const errorCode = e?.response?.data?.error?.details?.[0]?.errorCode;
                if (errorCode === 'UNREGISTERED' || errorCode === 'INVALID_ARGUMENT') {
                    invalidDeviceIds.push(device.device_id);
                } else {
                    this.logger.warn(`FCM push failed for device ${device.device_id}:`, e.message);
                }
            }
        });

        await Promise.allSettled(promises);
        return { invalidDeviceIds };
    }
}

module.exports = FcmProvider;
