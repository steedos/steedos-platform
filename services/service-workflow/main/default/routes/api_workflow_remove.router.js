/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-24 14:47:21
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-30 17:42:19
 * @Description: 
 */
'use strict';
// @ts-check
const express = require('express');
const router = express.Router();
const auth = require('@steedos/auth');
const _ = require('underscore');
const Fiber = require('fibers');
const {
    remove_instance_tasks_by_instance_id,
} = require('@steedos/workflow').workflowManagers.instance_tasks_manager
/**
@api {post} /api/workflow/remove 删除申请单
@apiVersion 0.0.0
@apiName /api/workflow/remove
@apiGroup service-workflow
@apiBody {Object[]} Instances 申请单信息
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
router.post('/api/workflow/remove', auth.requireAuthentication, async function (req, res) {
    try {
        let userSession = req.user;
        Fiber(async function () {
            try {
                var current_user, current_user_info, e, hashData, inserted_instances;
                current_user_info = Object.assign({}, userSession, { _id: userSession.userId })
                current_user = current_user_info._id;
                hashData = req.body;
                _.each(hashData['Instances'], function (instance_from_client) {
                    var cc_users, delete_obj, flow, inbox_users, instance, space, spaceUserOrganizations, space_id, space_user, user_ids;
                    const insId = instance_from_client["_id"]
                    // 获取一个instance
                    instance = uuflowManager.getInstance(insId);
                    space_id = instance.space;
                    // 获取一个space
                    space = uuflowManager.getSpace(space_id);
                    // 获取一个space下的一个user
                    space_user = uuflowManager.getSpaceUser(space_id, current_user);
                    flow = db.flows.findOne({
                        _id: instance.flow
                    });
                    spaceUserOrganizations = db.organizations.find({
                        _id: {
                            $in: space_user.organizations
                        }
                    }).fetch();
                    if ((instance.submitter !== current_user) && (!space.admins.includes(current_user)) && !WorkflowManager.canAdmin(flow, space_user, spaceUserOrganizations)) {
                        throw new Meteor.Error('error!', "您不能删除此申请单。");
                    }
                    delete_obj = db.instances.findOne(insId);
                    delete_obj.deleted = new Date;
                    delete_obj.deleted_by = current_user;
                    db.deleted_instances.insert(delete_obj);
                    // 删除instance
                    db.instances.remove(insId);
                    // 删除instance_tasks
                    remove_instance_tasks_by_instance_id(insId)
                    if (delete_obj.state !== "draft") {
                        //发送给待处理人, #发送给被传阅人
                        inbox_users = delete_obj.inbox_users ? delete_obj.inbox_users : [];
                        cc_users = delete_obj.cc_users ? delete_obj.cc_users : [];
                        user_ids = _.uniq(inbox_users.concat(cc_users));
                        _.each(user_ids, function (u_id) {
                            return pushManager.send_message_to_specifyUser("terminate_approval", u_id);
                        });
                        // 发送删除通知邮件给通过校验的申请人/填单人，对申请人/填单人各生成一条smtp message
                        return pushManager.send_instance_notification("monitor_delete_applicant", delete_obj, "", current_user_info);
                    }
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
