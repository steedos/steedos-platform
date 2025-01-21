/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-15 13:09:51
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2023-01-14 11:27:16
 * @Description:
 */
const express = require("express");
const router = express.Router();
const core = require("@steedos/core");
const _ = require("lodash");
const Fiber = require("fibers");
const {
  remove_many_instance_tasks,
} = require('@steedos/workflow').workflowManagers.instance_tasks_manager
router.post("/api/workflow/v2/instance/terminate",auth.requireAuthentication,async function (req, res) {
    try {
      let userSession = req.user;
      const { terminate_reason, instance_id } = req.body;
      var current_user, current_user_info, e;
      Fiber(async function () {
        try {
          current_user_info = userSession;
          current_user = current_user_info.userId;
          var flow,
            flow_id,
            flow_ver_end_step,
            flow_vers,
            h,
            i,
            ins,
            instance,
            instance_flow_ver,
            instance_trace,
            newApprove,
            newTrace,
            now,
            old_cc_users,
            old_inbox_users,
            old_outbox_users,
            permissions,
            r,
            setObj,
            space,
            space_id,
            space_user,
            space_user_org_info,
            tempUsers,
            traces;
          instance = uuflowManager.getInstance(instance_id);
          space_id = instance.space;
          flow_id = instance.flow;
          space = uuflowManager.getSpace(space_id);
          flow = uuflowManager.getFlow(flow_id);
          uuflowManager.isInstancePending(instance);
          space_user = uuflowManager.getSpaceUser(space_id, current_user);
          space_user_org_info = uuflowManager.getSpaceUserOrgInfo(space_user);
          instance_flow_ver = null;
          flow_ver_end_step = null;
          flow_vers = new Array();
          flow_vers.push(flow.current);
          flow_vers = flow_vers.concat(flow.historys);
          instance_flow_ver = _.find(flow_vers, function (f_ver) {
            return f_ver._id === instance.flow_version;
          });
          if (!instance_flow_ver) {
            throw new Meteor.Error("error!", "未找到申请单对应流程版本");
          }
          flow_ver_end_step = _.find(
            instance_flow_ver.steps,
            function (f_step) {
              return f_step.step_type === "end";
            }
          );
          permissions = permissionManager.getFlowPermissions(
            flow_id,
            current_user
          );
          now = new Date();
          setObj = new Object();
          if (
            permissions.includes("admin") ||
            space.admins.includes(current_user) ||
            instance.submitter === current_user ||
            instance.applicant === current_user
          ) {
            if (!terminate_reason) {
              throw new Meteor.Error(
                "error!",
                "还未填写强制结束申请单的理由，操作失败"
              );
            }
            instance_trace = _.find(instance.traces, function (trace) {
              return trace.is_finished === false;
            });
            traces = instance.traces;
            const finishedApproveIds = []
            i = 0;
            while (i < traces.length) {
              if (traces[i].is_finished === false) {
                traces[i].is_finished = true;
                traces[i].finish_date = now;
                h = 0;
                while (h < traces[i].approves.length) {
                  if (traces[i].approves[h].is_finished === false) {
                    traces[i].approves[h].is_finished = true;
                    traces[i].approves[h].finish_date = now;
                    traces[i].approves[h].judge = null;
                    traces[i].approves[h].description = null;
                    finishedApproveIds.push(traces[i].approves[h]._id)
                  }
                  h++;
                }
                newApprove = new Object();
                newApprove._id = new Mongo.ObjectID()._str;
                newApprove.instance = instance_id;
                newApprove.trace = instance_trace._id;
                newApprove.is_finished = true;
                newApprove.user = current_user;
                newApprove.user_name = current_user_info.name;
                newApprove.handler = current_user;
                newApprove.handler_name = current_user_info.name;
                newApprove.handler_organization =
                  space_user_org_info["organization"];
                newApprove.handler_organization_name =
                  space_user_org_info["organization_name"];
                newApprove.handler_organization_fullname =
                  space_user_org_info["organization_fullname"];
                newApprove.start_date = now;
                newApprove.finish_date = now;
                newApprove.due_date = instance_trace.due_date;
                newApprove.read_date = now;
                newApprove.judge = "terminated";
                newApprove.is_read = true;
                newApprove.description = terminate_reason;
                newApprove.is_error = false;
                newApprove.values = new Object();
                newApprove.cost_time =
                  newApprove.finish_date - newApprove.start_date;
                traces[i].approves.push(newApprove);
              }
              i++;
            }
            newTrace = new Object();
            newTrace._id = new Mongo.ObjectID()._str;
            newTrace.instance = instance_id;
            newTrace.previous_trace_ids = [instance_trace._id];
            newTrace.is_finished = true;
            newTrace.step = flow_ver_end_step._id;
            newTrace.name = flow_ver_end_step.name;
            newTrace.start_date = now;
            newTrace.finish_date = now;
            newTrace.judge = "terminated";
            setObj.state = "completed";
            setObj.final_decision = "terminated";
            old_inbox_users = instance.inbox_users;
            old_cc_users = instance.cc_users || [];
            old_outbox_users = instance.outbox_users;
            tempUsers = new Array();
            _.each(instance_trace.approves, function (nft_approve) {
              tempUsers.push(nft_approve.user);
              return tempUsers.push(nft_approve.handler);
            });
            setObj.outbox_users = _.uniq(
              instance.outbox_users.concat(tempUsers)
            );
            setObj.inbox_users = new Array();
            setObj.cc_users = new Array();
            setObj.modified = now;
            setObj.modified_by = current_user;
            traces.push(newTrace);
            setObj.traces = traces;
            setObj.current_step_name = flow_ver_end_step.name;
            setObj.current_step_auto_submit = false;
            r = db.instances.update(
              {
                _id: instance_id,
              },
              {
                $set: setObj,
              }
            );
            // 删除intance_tasks
            remove_many_instance_tasks(finishedApproveIds)
            if (r) {
              ins = uuflowManager.getInstance(instance_id);
              pushManager.send_instance_notification(
                "submit_terminate_applicant",
                ins,
                terminate_reason,
                current_user_info
              );
              if (old_inbox_users) {
                _.each(
                  _.uniq(old_inbox_users.concat(old_cc_users)),
                  function (user_id) {
                    return pushManager.send_message_to_specifyUser(
                      "terminate_approval",
                      user_id
                    );
                  }
                );
              }
              pushManager.triggerWebhook(
                ins.flow,
                ins,
                {},
                "terminate",
                current_user,
                []
              );
            }
          }
          res.status(200).send({});
        } catch (error) {
          console.error(error);
          res.status(200).send({
            error: error.message,
          });
        }
      }).run();
    } catch (error) {
      console.error(error);
      res.status(200).send({
        error: error.message,
      });
    }
  }
);
exports.default = router;
