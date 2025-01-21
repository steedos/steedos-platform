/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-24 15:28:14
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-24 15:34:54
 * @Description: 
 */
'use strict';
// @ts-check
const express = require('express');
const router = express.Router();
const auth = require('@steedos/auth');
const _ = require('underscore');
const Fiber = require('fibers');
/**
@api {post} /api/workflow/getSpaceUsers 获取用户
@apiVersion 0.0.0
@apiName /api/workflow/getSpaceUsers
@apiGroup service-workflow
@apiBody {String[]} userIds 用户ID
@apiQuery {String} spaceId 工作区ID
@apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK
    {
        'spaceUsers': [],
    }
@apiErrorExample {json} Error-Response:
    HTTP/1.1 200 OK
    {
      errors: [{ errorMessage: e.message }]
    }
 */
router.post('/api/workflow/getSpaceUsers', auth.requireAuthentication, async function (req, res) {
    try {
        Fiber(async function () {
            try {
                var
                    userIds = req.body.userIds,
                    spaceId = req.query.spaceId,
                    spaceUsers = []
                    ;

                if (!userIds || !spaceId) {
                    res.status(200).send({ 'errors': '缺少参数' });
                }

                spaceUsers = WorkflowManager.getUsers(spaceId, userIds);

                res.status(200).send({ 'spaceUsers': spaceUsers });
            } catch (e) {
                console.error(e);
                res.status(200).send({
                    errors: [{ errorMessage: e.message }]
                });
            }
        }).run()
    } catch (e) {
        res.status(200).send({
            errors: [{ errorMessage: e.message }]
        });
    }
});
exports.default = router;
