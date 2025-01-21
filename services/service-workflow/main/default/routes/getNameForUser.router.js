/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-24 15:23:34
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-24 15:27:34
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
@api {post} /api/workflow/getNameForUser 获取用户名称
@apiVersion 0.0.0
@apiName /api/workflow/getNameForUser
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
router.post('/api/workflow/getNameForUser', auth.requireAuthentication, async function (req, res) {
    try {
        Fiber(async function () {
            try {
                var user, userId;
                userId = req.body.userId;
                if (!userId) {
                    res.status(200).send({ 'errors': '缺少参数' });
                }
                user = WorkflowManager.getNameForUser(userId);
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
