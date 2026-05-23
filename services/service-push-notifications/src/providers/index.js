"use strict";
const GetuiProvider = require('./getui');
const FcmProvider = require('./fcm');

/**
 * 根据环境变量创建并注册可用的推送 Provider
 * @param {object} logger - Moleculer logger
 * @returns {Map<string, object>} provider registry
 */
function createProviderRegistry(logger) {
    const providers = new Map();

    // 个推
    if (process.env.PUSH_GETUI_APP_ID && process.env.PUSH_GETUI_MASTER_SECRET) {
        providers.set('getui', new GetuiProvider({
            appId: process.env.PUSH_GETUI_APP_ID,
            appKey: process.env.PUSH_GETUI_APP_KEY,
            appSecret: process.env.PUSH_GETUI_APP_SECRET,
            masterSecret: process.env.PUSH_GETUI_MASTER_SECRET,
        }, logger));
    }

    // FCM
    if (process.env.PUSH_FCM_SERVICE_ACCOUNT_PATH) {
        try {
            providers.set('fcm', new FcmProvider({
                serviceAccountPath: process.env.PUSH_FCM_SERVICE_ACCOUNT_PATH,
            }, logger));
        } catch (e) {
            logger.error('Failed to initialize FCM provider:', e.message);
        }
    }

    return providers;
}

module.exports = { createProviderRegistry };
