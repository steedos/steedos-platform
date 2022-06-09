"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-08 23:28:39
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-06-09 10:21:45
 * @Description:
 */
const express = require("express");
const core_1 = require("@steedos/core");
const objectql_1 = require("@steedos/objectql");
const router = express.Router();
router.get('/service/api/apps/menus', core_1.requireAuthentication, function (req, res) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const userSession = req.user;
        try {
            const result = yield (0, objectql_1.getSteedosSchema)().broker.call('apps.getMenus', {}, { meta: { user: userSession } });
            res.status(200).send(result);
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    });
});
exports.default = router;
