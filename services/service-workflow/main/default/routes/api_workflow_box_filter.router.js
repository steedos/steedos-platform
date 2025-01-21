/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-02-10 13:49:28
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2023-05-04 10:20:20
 * @Description: 
 */
const express = require("express");
const router = express.Router();
const auth = require('@steedos/auth');
const objectql = require('@steedos/objectql');

router.get('/api/workflow/v2/:box/filter', auth.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    const { userId, is_space_admin, spaceId } = userSession;
    // TODO 按应用分类显示
    const { app, flowId } = req.query;
    const { box } = req.params;
    const filter = await objectql.getSteedosSchema().broker.call("instance.getBoxFilters", {
        box, appId: app, flowId, userId, is_space_admin, spaceId
    })
    return res.send({
        filter
    })
})

exports.default = router;