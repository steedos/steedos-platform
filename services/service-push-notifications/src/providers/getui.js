"use strict";
const crypto = require('crypto');

const BASE_URL = 'https://restapi.getui.com/v2';

/**
 * 个推 REST API V2 Provider
 * 文档: https://docs.getui.com/getui/server/rest_v2/push/
 */
class GetuiProvider {
    constructor(config, logger) {
        this.config = config;
        this.logger = logger;
        this.token = null;
        this.tokenExpireAt = 0;
    }

    /**
     * 获取鉴权 token（有效期 1 小时，内存缓存）
     */
    async getAuthToken() {
        const timestamp = Date.now();
        const sign = crypto.createHash('sha256')
            .update(`${this.config.appKey}${timestamp}${this.config.masterSecret}`)
            .digest('hex');

        const res = await fetch(`${BASE_URL}/${this.config.appId}/auth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sign,
                timestamp: String(timestamp),
                appkey: this.config.appKey,
            })
        });

        const data = await res.json();
        if (data.code !== 0) {
            throw new Error(`GeTui auth failed: ${data.msg || JSON.stringify(data)}`);
        }

        this.token = data.data.token;
        // token 有效期官方为 1 天，但提前 5 分钟刷新
        this.tokenExpireAt = Date.now() + (data.data.expire_time
            ? (data.data.expire_time - Date.now() - 300000)
            : 3600 * 1000);

        return this.token;
    }

    async ensureToken() {
        if (!this.token || Date.now() > this.tokenExpireAt) {
            await this.getAuthToken();
        }
    }

    /**
     * 推送消息到设备列表
     * @param {Array} devices - 设备记录列表，每条包含 device_id
     * @param {Object} message - { title, body, data }
     * @returns {{ invalidDeviceIds: string[] }}
     */
    async send(devices, message) {
        await this.ensureToken();
        const invalidDeviceIds = [];
        const cids = devices.map(d => d.device_id);

        // 个推单推接口最多 1000 个 CID
        const batchSize = parseInt(process.env.PUSH_BATCH_SIZE) || 1000;

        for (let i = 0; i < cids.length; i += batchSize) {
            const batch = cids.slice(i, i + batchSize);

            try {
                const result = await this._pushBatch(batch, message);
                if (result.invalidCids) {
                    invalidDeviceIds.push(...result.invalidCids);
                }
            } catch (e) {
                this.logger.error(`GeTui push batch failed:`, e.message);
                // token 过期时重新获取并重试
                if (e.message && e.message.includes('token')) {
                    this.token = null;
                    await this.ensureToken();
                    try {
                        const result = await this._pushBatch(batch, message);
                        if (result.invalidCids) {
                            invalidDeviceIds.push(...result.invalidCids);
                        }
                    } catch (retryErr) {
                        this.logger.error(`GeTui push retry failed:`, retryErr.message);
                    }
                }
            }
        }

        return { invalidDeviceIds };
    }

    /**
     * 批量推送一批 CID
     */
    async _pushBatch(cids, message) {
        const requestId = crypto.randomUUID();
        const payload = {
            request_id: requestId,
            audience: { cid: cids },
            push_message: {
                notification: {
                    title: message.title,
                    body: message.body,
                    click_type: 'payload',
                    payload: JSON.stringify(message.data || {}),
                }
            }
        };

        // 单个 CID 用 single 接口，多个用 list 接口
        let url;
        if (cids.length === 1) {
            url = `${BASE_URL}/${this.config.appId}/push/single/cid`;
        } else {
            url = `${BASE_URL}/${this.config.appId}/push/single/batch/cid`;
        }

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': this.token,
            },
            body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (data.code !== 0) {
            // code 10001 = token 无效
            if (data.code === 10001) {
                throw new Error('token expired');
            }
            this.logger.warn(`GeTui push response code=${data.code}: ${data.msg}`);
        }

        // 解析无效 CID
        const invalidCids = [];
        if (data.data) {
            for (const [cid, detail] of Object.entries(data.data)) {
                if (detail && detail.status === 'invalid') {
                    invalidCids.push(cid);
                }
            }
        }

        return { invalidCids };
    }
}

module.exports = GetuiProvider;
