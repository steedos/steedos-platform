const objectql = require('@steedos/objectql');
const steedosAuth = require('@steedos/auth');
const core = require('@steedos/core');
const auth = steedosAuth.auth;
const getSteedosSchema = objectql.getSteedosSchema;
const util = core.Util;
const _ = require('underscore');

Creator.Objects['instances'].methods = {
    view: async function (req, res) {
        let { _id: record_id } = req.params;
        let userSession = await auth(req, res);
        let req_async = _.has(req.query, 'async');
        if (userSession.userId) {
            let fields = ["space", "flow", "state", "inbox_users", "cc_users", "outbox_users", "submitter", "applicant"];
            let record = await getSteedosSchema().getObject("instances").findOne(record_id, { fields: fields });
            if (!record) {
                // 跳转到记录界面会显示为404效果
                let redirectUrl = util.getObjectRecordUrl("instances", record_id);
                if (req.get("X-Requested-With") === 'XMLHttpRequest') {
                    return res.status(200).send({
                        "status": 404,
                        "redirect": redirectUrl
                    });
                } else {
                    return res.redirect(redirectUrl);
                }
            }
            const sus = await getSteedosSchema().getObject("space_users").find({
                filters: [["space", "=", record.space], ["user", "=", userSession.userId]],
                fields: ["_id"]
                }, userSession);
            if (!sus || !sus.length) {
                return res.status(401).send({
                    "error": "Validate Request -- user is not belong to this space.",
                    "success": false
                });
            }
            let box = '', permissions, space;
            let current_user_id = userSession.userId;
            if ((record.inbox_users && record.inbox_users.includes(current_user_id)) || (record.cc_users && record.cc_users.includes(current_user_id))) {
                box = 'inbox';
            } else if (record.outbox_users && record.outbox_users.includes(current_user_id)) {
                box = 'outbox';
            } else if (record.state === 'draft' && record.submitter === current_user_id) {
                box = 'draft';
            } else if (record.state === 'pending' && (record.submitter === current_user_id || record.applicant === current_user_id)) {
                box = 'pending';
            } else if (record.state === 'completed' && record.submitter === current_user_id) {
                box = 'completed';
            } else {
                permissions = permissionManager.getFlowPermissions(record.flow, current_user_id);
                space = db.spaces.findOne(record.space, {
                  fields: {
                    admins: 1
                  }
                });
                if ((!permissions.includes("admin")) && (!space.admins.includes(current_user_id))) {
                  throw new Meteor.Error('error', "no permission.");
                }
                box = 'monitor';
            }
            let redirectUrl = Creator.getRelativeUrl(`/workflow/space/${record.space}/${box}/${record_id}`);
            if (req_async) { // || req.get("X-Requested-With") === 'XMLHttpRequest'
                return res.status(200).send({
                    "status": 302,
                    "redirect": redirectUrl
                });
            } else {
                return res.redirect(redirectUrl);
            }
        }
        return res.status(401).send({
            "error": "Validate Request -- Missing X-Auth-Token",
            "success": false
        })
    }
}