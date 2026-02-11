"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("@steedos/auth");
const objectql_1 = require("@steedos/objectql");
const express = require('express');
const router = express.Router();
router.get('/service/api/apps/menus', auth_1.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    const mobile = req.query && req.query.mobile;
    try {
        const result = await (0, objectql_1.getSteedosSchema)().broker.call('apps.getMenus', { mobile: mobile }, { meta: { user: userSession } });
        res.status(200).send(result);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
exports.default = router;
