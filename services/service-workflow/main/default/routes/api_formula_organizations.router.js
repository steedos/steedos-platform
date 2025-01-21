/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-24 10:44:11
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-01-21 17:30:14
 * @Description: 
 */
'use strict';
// @ts-check
const express = require('express');
const router = express.Router();
const auth = require('@steedos/auth');
const Fiber = require('fibers');
/**
@api {post} /api/formula/orgs 获取组织
@apiVersion 0.0.0
@apiName /api/formula/orgs
@apiGroup service-workflow
@apiBody {String[]} orgIds 组织ID
@apiBody {String} spaceId 工作区ID
@apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK
    {
        'orgs': [],
    }
@apiErrorExample {json} Error-Response:
    HTTP/1.1 200 OK
    {
      errors: ''
    }
 */
router.post('/api/formula/orgs', auth.requireAuthentication, async function (req, res) {
    try {
        let userSession = req.user;
        const userId = userSession.userId;
        Fiber(async function () {
            try {
                var orgIds, orgs, spaceId, space_user;
                orgIds = req.body.orgIds;
                spaceId = req.body.spaceId;
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
                if (!orgIds || !spaceId) {
                    return res.status(200).send({ 'errors': '缺少参数' });
                }
                orgs = WorkflowManager.getFormulaOrgObjects(orgIds);

                res.status(200).send({ 'orgs': orgs });
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
