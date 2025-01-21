/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2023-02-23 12:46:17
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2023-02-23 12:50:26
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
@api {post} /api/workflow/getContactInfoForUser 获取用户信息，如手机号等
@apiVersion 0.0.0
@apiName /api/workflow/getContactInfoForUser
@apiGroup service-workflow
@apiBody {String} userId 用户ID
@apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK
    {
        'user': user,
    }
@apiErrorExample {json} Error-Response:
    HTTP/1.1 200 OK
    {
      errors: [{ errorMessage: e.message }]
    }
 */
router.post('/api/workflow/getContactInfoForUser', auth.requireAuthentication, async function (req, res) {
    try {
        Fiber(async function () {
            try {
                var user, userId, spaceId;
                userId = req.body.userId;
                spaceId = req.body.spaceId
                if (!userId || !spaceId) {
                    res.status(200).send({ 'errors': '缺少参数' });
                }
                user = WorkflowManager.getContactInfoForUser(userId, spaceId);
                res.status(200).send({ user: user });
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
