/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-24 11:35:55
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-24 11:43:43
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
@api {post} /api/workflow/archive 归档
@apiVersion 0.0.0
@apiName /api/workflow/archive
@apiGroup service-workflow
@apiBody {Object[]} Instances 申请单
@apiBody {String} Instances._id 申请单ID
@apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK
    {
        
    }
@apiErrorExample {json} Error-Response:
    HTTP/1.1 200 OK
    {
      errors: [{ errorMessage: e.message }]
    }
 */
router.get('/api/workflow/archive', auth.requireAuthentication, async function (req, res) {
    try {
        let userSession = req.user;
        const spaceId = userSession.spaceId;
        const userId = userSession.userId;
        Fiber(async function () {
            try {
                var hashData;
                hashData = req.body;
                _.each(hashData['Instances'], function (instance_from_client) {
                    var instance, instance_id, setObj, space, space_id, space_user;
                    instance_id = instance_from_client["_id"];
                    // 获取一个instance
                    instance = uuflowManager.getInstance(instance_id);
                    space_id = instance.space;
                    // 获取一个space
                    space = uuflowManager.getSpace(space_id);
                    // 判断一个instance是否为完成并且未归档状态
                    uuflowManager.isInstanceFinishedAndNotArchieved(instance);
                    // 获取一个space下的一个user
                    space_user = uuflowManager.getSpaceUser(space_id, userId);
                    // 判断一个用户是否是一个instance的提交者 或者space的管理员
                    uuflowManager.isInstanceSubmitterOrApplicantOrSpaceAdmin(instance, userId, space);
                    setObj = new Object;
                    setObj.is_archived = true;
                    setObj.modified = new Date;
                    setObj.modified_by = userId;
                    return db.instances.update({
                        _id: instance_id
                    }, {
                        $set: setObj
                    });
                });

                res.status(200).send({});
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
