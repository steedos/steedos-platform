/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-15 13:09:51
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2023-01-14 11:06:17
 * @Description: 
 */
const express = require("express");
const router = express.Router();
const auth = require('@steedos/auth');
const _ = require('lodash');
const Fiber = require("fibers");
const {
    remove_instance_tasks_by_instance_id,
} = require('@steedos/workflow').workflowManagers.instance_tasks_manager
//TODO 
/**
 * body: {
 *  instance: {
 *     _id: 'xxx'
 *  }
 * }
 */
router.post('/api/workflow/v2/remove', auth.requireAuthentication, async function (req, res) {
    try {
        let userSession = req.user;
        const { instance: data } = req.body;
        const current_user = userSession.userId;
        Fiber(async function () {
            try {
                
                var cc_users, delete_obj, flow, inbox_users, instance, space, spaceUserOrganizations, space_id, space_user, user_ids;
                instance = uuflowManager.getInstance(data._id);
                space_id = instance.space;
                space = uuflowManager.getSpace(space_id);
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
                delete_obj = db.instances.findOne(data._id);
                delete_obj.deleted = new Date;
                delete_obj.deleted_by = current_user;
                db.deleted_instances.insert(delete_obj);
                db.instances.remove(data._id);
                // 删除instance_tasks
                remove_instance_tasks_by_instance_id(data._id)
                if (delete_obj.state !== "draft") {
                    inbox_users = delete_obj.inbox_users ? delete_obj.inbox_users : [];
                    cc_users = delete_obj.cc_users ? delete_obj.cc_users : [];
                    user_ids = _.uniq(inbox_users.concat(cc_users));
                    _.each(user_ids, function(u_id) {
                        return pushManager.send_message_to_specifyUser("terminate_approval", u_id);
                    });
                    pushManager.send_instance_notification("monitor_delete_applicant", delete_obj, "", Object.assign({}, userSession, {_id: userSession.userId}));
                }
                
                res.status(200).send({});
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