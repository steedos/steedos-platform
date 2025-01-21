"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProvider = void 0;
const tslib_1 = require("tslib");
const objectql_1 = require("@steedos/objectql");
const context_1 = require("../context");
class UserProvider {
    static link(user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const { thirdPartyUser, _id } = user;
            const { params } = thirdPartyUser;
            const collection = (0, objectql_1.getObject)('user_providers');
            const record = yield UserProvider.findByProvider(thirdPartyUser);
            if (record) {
                return yield collection.update(record._id, {
                    access_token: (_a = thirdPartyUser.oauth2) === null || _a === void 0 ? void 0 : _a.accessToken,
                    refresh_token: (_b = thirdPartyUser.oauth2) === null || _b === void 0 ? void 0 : _b.refreshToken,
                    expires_in: params === null || params === void 0 ? void 0 : params.expires_in,
                    refresh_expires_in: params === null || params === void 0 ? void 0 : params.refresh_expires_in,
                    provider_user_id: thirdPartyUser.userId,
                    id_token: thirdPartyUser.idToken,
                    oauth_token: null,
                    oauth_token_secret: null,
                    session_state: params === null || params === void 0 ? void 0 : params.session_state,
                    scope: params === null || params === void 0 ? void 0 : params.scope,
                    token_type: params === null || params === void 0 ? void 0 : params.token_type,
                    updated: new Date(),
                    space: (0, context_1.getTenantId)(),
                });
            }
            else {
                return yield collection.insert({
                    user: _id,
                    provider: thirdPartyUser.providerType,
                    type: 'oauth',
                    access_token: (_c = thirdPartyUser.oauth2) === null || _c === void 0 ? void 0 : _c.accessToken,
                    refresh_token: (_d = thirdPartyUser.oauth2) === null || _d === void 0 ? void 0 : _d.refreshToken,
                    expires_in: params === null || params === void 0 ? void 0 : params.expires_in,
                    refresh_expires_in: params === null || params === void 0 ? void 0 : params.refresh_expires_in,
                    provider_user_id: thirdPartyUser.userId,
                    id_token: thirdPartyUser.idToken,
                    oauth_token: null,
                    oauth_token_secret: null,
                    session_state: params === null || params === void 0 ? void 0 : params.session_state,
                    scope: params === null || params === void 0 ? void 0 : params.scope,
                    token_type: params === null || params === void 0 ? void 0 : params.token_type,
                    created: new Date(),
                    updated: new Date(),
                    space: (0, context_1.getTenantId)(),
                });
            }
        });
    }
    static findByProvider(thirdPartyUser) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const collection = (0, objectql_1.getObject)('user_providers');
            const records = yield collection.find({ filters: [[
                        'provider', '=', thirdPartyUser.providerType,
                        'user', '=', thirdPartyUser.userId
                    ]] });
            if (records.length > 0) {
                return records[0];
            }
            else {
                return null;
            }
        });
    }
}
exports.UserProvider = UserProvider;
