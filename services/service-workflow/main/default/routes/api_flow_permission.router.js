/*
 * @Author: baozhoutao@steedos.com
 * @Date:  2023-03-18 15:05:39
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-03-18 15:25:49
 * @Description: 
 */
const express = require("express");
const router = express.Router();
const core = require('@steedos/core');
const _ = require('lodash');
const Fiber = require("fibers");

router.get('/api/workflow/v2/flow_permissions/:flow', core.requireAuthentication, async function (req, res) {
    try {
        let userSession = req.user;
        const { flow } = req.params;
        Fiber(async function () {
            try {
                const permissions = permissionManager.getFlowPermissions(flow, userSession.userId);
                res.status(200).send({
                    permissions: permissions
                })
            } catch (error) {
                console.error(error);
                res.status(200).send({
                    error: error.message
                });
            }

        }).run()
    
    } catch (error) {
        console.error(error);
        res.status(200).send({
            error: error.message
        });
    }
});
exports.default = router;