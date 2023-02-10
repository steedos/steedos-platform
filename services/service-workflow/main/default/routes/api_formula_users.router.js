/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-24 10:53:58
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-24 11:02:37
 * @Description: 
 */
'use strict';
// @ts-check
const express = require('express');
const router = express.Router();
const core = require('@steedos/core');
const Fiber = require('fibers');
/**
@api {post} /api/formula/users 获取用户
@apiVersion 0.0.0
@apiName /api/formula/users
@apiGroup service-workflow
@apiBody {String[]} userIds 用户ID
@apiBody {String} spaceId 工作区ID
@apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK
    {
        'spaceUsers': [],
    }
@apiErrorExample {json} Error-Response:
    HTTP/1.1 200 OK
    {
      errors: ''
    }
 */
router.post('/api/formula/users', core.requireAuthentication, async function (req, res) {
    try {
        let userSession = req.user;
        const userId = userSession.userId;
        Fiber(async function () {
            try {
                var spaceId, spaceUsers, space_user, userIds;
                userIds = req.body.userIds;
                spaceId = req.body.spaceId;
                spaceUsers = [];
                space_user = db.space_users.findOne({
                    user: userId,
                    space: spaceId
                }, {
                    fields: {
                        _id: 1
                    }
                });
                if (!space_user) {
                    return res.status(200).send({ 'errors': '无权限' });
                }
                if (!userIds || !spaceId) {
                    return res.status(200).send({ 'errors': '缺少参数' });
                }
                spaceUsers = WorkflowManager.getFormulaUserObjects(spaceId, userIds);

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
