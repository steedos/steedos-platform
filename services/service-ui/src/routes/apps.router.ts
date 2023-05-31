/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-08 23:28:39
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-30 15:00:25
 * @Description: 
 */
import { requireAuthentication } from '@steedos/core';
import { getSteedosSchema } from '@steedos/objectql';
const express = require('express');
const router =express.Router();

router.get('/service/api/apps/menus', requireAuthentication, async function (req: any, res: any) {
    const userSession = req.user;
    const mobile = req.query && req.query.mobile;
    try {
        const result = await getSteedosSchema().broker.call('apps.getMenus', {mobile: mobile}, {meta: {user: userSession}});
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});
exports.default = router;