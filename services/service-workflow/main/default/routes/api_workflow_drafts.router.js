/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-24 11:44:39
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-26 10:01:36
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
@api {post} /api/workflow/drafts 新建草稿
@apiVersion 0.0.0
@apiName /api/workflow/drafts
@apiGroup service-workflow
@apiBody {Object[]} Instances 申请单信息
@apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK
    {
        'inserts': [inserted_instances],
    }
@apiErrorExample {json} Error-Response:
    HTTP/1.1 200 OK
    {
      errors: [{ errorMessage: e.message }]
    }
 */
router.post('/api/workflow/drafts', auth.requireAuthentication, async function (req, res) {
    try {
        let userSession = req.user;
        Fiber(async function () {
            try {
                var hashData, inserted_instances;
                hashData = req.body;
                inserted_instances = new Array;
                _.each(hashData['Instances'], function (instance_from_client) {
                    var new_ins, new_ins_id;
                    new_ins_id = uuflowManager.create_instance(instance_from_client, Object.assign({}, userSession, { _id: userSession.userId }));
                    new_ins = db.instances.findOne({
                        _id: new_ins_id
                    }, {
                        fields: {
                            space: 1,
                            flow: 1,
                            flow_version: 1,
                            form: 1,
                            form_version: 1
                        }
                    });
                    return inserted_instances.push(new_ins);
                });

                res.status(200).send({ inserts: inserted_instances });
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
