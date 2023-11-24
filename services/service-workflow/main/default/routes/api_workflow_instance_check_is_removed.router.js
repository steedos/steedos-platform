/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-11-23 15:01:55
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-11-23 15:11:50
 * @FilePath: /steedos-platform-2.3/services/service-workflow/main/default/routes/api_workflow_instance_check_is_removed.router.js
 * @Description: 
 */
'use strict';
// @ts-check
const express = require('express');
const router = express.Router();
const core = require('@steedos/core');
const objectql = require('@steedos/objectql');
/**
@api {post} /api/workflow/instance/check_is_removed/:instanceId 检查申请单是否已被删除，及删除后处理相关数据
@apiVersion 0.0.0
@apiName /api/workflow/instance/check_is_removed/:instanceId
@apiGroup service-workflow
@apiQuery string instanceId 申请单ID
@apiSuccessExample {json} Success-Response:
    HTTP/1.1 302 OK
@apiErrorExample {json} Error-Response:
    HTTP/1.1 500 OK
    e.message
 */
router.post('/api/workflow/instance/check_is_removed/:instanceId', core.requireAuthentication, async function (req, res) {
    try {
        const insId = req.params.instanceId;
        const { objectName, recordId } = req.body;
        const insObj = objectql.getObject('instances');
        const ins = await insObj.findOne(insId);
        if (!ins) {
            // 申请单不存在，清空台账记录中的records等信息
            const recordObj = objectql.getObject(objectName);
            await recordObj.directUpdate(recordId, {
                "instances": null,
                "instance_state": null,
                "locked": null
            })

            return res.status(500).send({
                "status": -1,
                "msg": "未找到申请单，请确认。",
                "data": {}
            });
        }
        res.status(200).send({
            "status": 0,
            "msg": "存在申请单",
            "data": {}
        });
    } catch (e) {
        console.error(e);
        res.status(500).send(e.message);
    }
});
exports.default = router;
