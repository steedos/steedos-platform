"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpaceUsers = void 0;
const tslib_1 = require("tslib");
const objectql_1 = require("@steedos/objectql");
class SpaceUsers {
    static insert(spaceId_1, userId_1) {
        return tslib_1.__awaiter(this, arguments, void 0, function* (spaceId, userId, options = { user_accepted: true }) {
            yield (0, objectql_1.getSteedosSchema)().broker.call(`spaces.addSpaceUsers`, {
                spaceId,
                userId,
                user_accepted: options.user_accepted,
            });
        });
    }
    static findByUserId(userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const records = yield (0, objectql_1.getObject)('users').find({ filters: [['user', '=', userId]] });
            if (records.length === 0) {
                return null;
            }
            else {
                return records[0];
            }
        });
    }
}
exports.SpaceUsers = SpaceUsers;
