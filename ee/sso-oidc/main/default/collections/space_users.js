"use strict";
/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-27 13:59:25
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-06 17:24:59
 * @Description:
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpaceUsers = void 0;
const tslib_1 = require("tslib");
const objectql_1 = require("@steedos/objectql");
class SpaceUsers {
    static insert(spaceId, userId, options = { user_accepted: true }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            Creator.addSpaceUsers(spaceId, userId, options.user_accepted);
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
