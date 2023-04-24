/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-02-10 13:49:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-04-24 14:29:08
 * @Description: 
 */
const express = require("express");
const router = express.Router();
const core = require('@steedos/core');
const objectql = require('@steedos/objectql');

router.get('/api/workflow/v2/:box/filter', core.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    const { userId, is_space_admin } = userSession;
    // TODO 按应用分类显示
    const { app, flowId } = req.query;
    const { box } = req.params;
    const filter = await objectql.getSteedosSchema().broker.call("instance.getBoxFilters", {
        box, appId: app, flowId, userId, is_space_admin
    })
    return res.send({
        filter
    })
})

exports.default = router;