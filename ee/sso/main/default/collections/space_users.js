"use strict";
/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-27 13:59:25
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-06-27 14:08:54
 * @Description:
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpaceUsers = void 0;
const tslib_1 = require("tslib");
class SpaceUsers {
    static insert(spaceId, userId, options = { user_accepted: true }) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            Creator.addSpaceUsers(spaceId, userId, options.user_accepted);
        });
    }
}
exports.SpaceUsers = SpaceUsers;
