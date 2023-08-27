const { count_instance_tasks } = require('./instance_tasks_manager');
var ref, ref1, ref2, ref3;
// 定义全局变量
global.pushManager = {
    // bqq_app_id: "200626779",
    // imo_app_cid: (ref = Meteor.settings.imo) != null ? ref.appcid : void 0,
    // imo_app_uid: (ref1 = Meteor.settings.imo) != null ? ref1.appuid : void 0,
    // imo_sync_app_key: (ref2 = Meteor.settings.imo) != null ? ref2.sync_app_key : void 0,
    // imo_push_app_key: (ref3 = Meteor.settings.imo) != null ? ref3.push_app_key : void 0
};

pushManager.get_to_users = function (send_from, instance, cc_user_ids, current_user_info) {
    var applicant, approve_user_ids, remove_users, to_users;
    to_users = new Array;
    if (['first_submit_applicant'].includes(send_from)) {
        // 申请人
        if (instance.applicant !== instance.submitter) {
            applicant = db.users.findOne(instance.applicant);
            to_users.push(applicant);
        }
    } else if (['submit_terminate_approve', 'submit_completed_approve', 'submit_pending_rejected_approve', 'approved_completed_approve', 'rejected_completed_approve'].includes(send_from)) {
        // 已审批人
        // 获得已审批的人(去掉重复及申请人、提交人)
        remove_users = new Array;
        remove_users.push(instance.applicant);
        remove_users.push(instance.submitter);
        approve_user_ids = _.difference(instance.outbox_users, remove_users);
        to_users = db.users.find({
            _id: {
                $in: approve_user_ids
            }
        }).fetch();
    } else if (['reassign_new_inbox_users', 'submit_pending_rejected_inbox', 'submit_pending_inbox', 'first_submit_inbox', 'return_pending_inbox'].includes(send_from)) {
        // 待审批人
        to_users = db.users.find({
            _id: {
                $in: instance.inbox_users
            }
        }).fetch();
    } else if (['submit_completed_applicant', 'approved_completed_applicant', 'rejected_completed_applicant', 'monitor_delete_applicant', 'submit_terminate_applicant', 'submit_pending_rejected_applicant', 'submit_pending_rejected_applicant_inbox'].includes(send_from)) {
        applicant = db.users.findOne(instance.applicant);
        to_users.push(applicant);
    } else if (['trace_approve_cc'].includes(send_from) && cc_user_ids) {
        to_users = db.users.find({
            _id: {
                $in: cc_user_ids
            }
        }).fetch();
    } else if (['trace_approve_cc_submit'].includes(send_from) && cc_user_ids) {
        to_users = db.users.find({
            _id: {
                $in: cc_user_ids
            }
        }).fetch();
    } else if (['auto_submit_pending_inbox'].includes(send_from)) {
        to_users = [current_user_info];
    }
    return to_users;
};

pushManager.get_body = function (parameters, lang = "zh-CN") {
    var applicant_name, approves_description, body, currentStep_type, current_step_name, current_user_name, description, email_approve_type, email_description, email_final_decision, final_decision, from_username, href, instance_name, lastApprove_judge, lastApprove_usersname, last_approve_judge, nextApprove_usersname, nextStep_type, push_approve_type, push_final_decision, send_from, state, to_username, url_approve_type;
    send_from = parameters["send_from"];
    applicant_name = parameters["applicant_name"];
    instance_name = parameters["instance_name"];
    to_username = parameters["to_username"];
    href = parameters["href"];
    final_decision = parameters["final_decision"];
    description = parameters["description"];
    state = parameters["state"];
    from_username = parameters["from_username"];
    current_step_name = parameters["current_step_name"];
    nextApprove_usersname = parameters["nextApprove_usersname"];
    nextStep_type = parameters["nextStep_type"];
    approves_description = parameters["approves_description"];
    lastApprove_judge = parameters["lastApprove_judge"];
    lastApprove_usersname = parameters["lastApprove_usersname"];
    current_user_name = parameters["current_user_name"];
    currentStep_type = parameters["currentStep_type"];
    push_final_decision = "";
    email_final_decision = "";
    email_description = "";
    if (!final_decision) {
        push_final_decision = TAPi18n.__('instance.push.final_decision_nil', {}, lang);
        email_final_decision = TAPi18n.__('instance.email.final_decision_nil', {}, lang);
    } else {
        if ("approved" === final_decision) {
            push_final_decision = TAPi18n.__('instance.push.final_decision_approved', {}, lang);
            email_final_decision = TAPi18n.__('instance.email.final_decision_approved', {}, lang);
        } else if ("rejected" === final_decision) {
            push_final_decision = TAPi18n.__('instance.push.final_decision_rejected', {}, lang);
            email_final_decision = TAPi18n.__('instance.email.final_decision_rejected', {}, lang);
            email_description = TAPi18n.__('instance.email.body.email_description', {
                description: description
            }, lang);
        } else {
            push_final_decision = TAPi18n.__('instance.push.final_decision_nil', {}, lang);
            email_final_decision = TAPi18n.__('instance.email.final_decision_nil', {}, lang);
        }
    }
    email_approve_type = null;
    url_approve_type = null;
    push_approve_type = null;
    if (['submit', 'start'].includes(nextStep_type)) {
        email_approve_type = TAPi18n.__('instance.email.body.input', {}, lang);
        url_approve_type = TAPi18n.__('instance.email.body.url_input', {}, lang);
        push_approve_type = TAPi18n.__('instance.push.body.input', {}, lang);
    } else if (['sign', 'counterSign'].includes(nextStep_type)) {
        email_approve_type = TAPi18n.__('instance.email.body.approval', {}, lang);
        url_approve_type = TAPi18n.__('instance.email.body.url_approval', {}, lang);
        push_approve_type = TAPi18n.__('instance.push.body.approval', {}, lang);
    }
    last_approve_judge = null;
    if ("submitted" === lastApprove_judge) {
        last_approve_judge = TAPi18n.__('instance.email.body.judge_submitted', {}, lang);
    } else if ("approved" === lastApprove_judge) {
        last_approve_judge = TAPi18n.__('instance.email.body.judge_approved', {}, lang);
    }
    body = new Object;
    if ("first_submit_applicant" === send_from) {
        body["push"] = TAPi18n.__('instance.push.body.first_submit_applicant', {
            instance_name: instance_name,
            from_username: from_username,
            applicant_name: applicant_name,
            final_decision: push_final_decision
        }, lang);
        if (!approves_description) {
            body["email"] = TAPi18n.__('instance.email.body.first_submit_applicant', {
                instance_name: instance_name,
                to_username: to_username,
                href: href,
                applicant_name: applicant_name,
                final_decision: email_final_decision,
                description: email_description
            }, lang);
        } else {
            body["email"] = TAPi18n.__('instance.email.body.first_submit_applicant_beApproveDescription', {
                instance_name: instance_name,
                to_username: to_username,
                href: href,
                applicant_name: applicant_name,
                final_decision: email_final_decision,
                description: email_description,
                approves_description: approves_description
            }, lang);
        }
    } else if ("first_submit_inbox" === send_from) {
        body["push"] = TAPi18n.__('instance.push.body.first_submit_inbox', {
            instance_name: instance_name,
            from_username: from_username,
            applicant_name: applicant_name,
            final_decision: push_final_decision,
            approve_type: push_approve_type
        }, lang);
        if (!approves_description) {
            body["email"] = TAPi18n.__('instance.email.body.first_submit_inbox', {
                instance_name: instance_name,
                to_username: to_username,
                href: href,
                applicant_name: applicant_name,
                final_decision: email_final_decision,
                description: email_description,
                approve_type: email_approve_type,
                url_approve_type: url_approve_type
            }, lang);
        } else {
            body["email"] = TAPi18n.__('instance.email.body.first_submit_inbox_beApproveDescription', {
                instance_name: instance_name,
                to_username: to_username,
                href: href,
                applicant_name: applicant_name,
                final_decision: email_final_decision,
                description: email_description,
                approve_type: email_approve_type,
                url_approve_type: url_approve_type,
                approves_description: approves_description
            }, lang);
        }
    } else if ("submit_completed_applicant" === send_from) {
        body["push"] = TAPi18n.__('instance.push.body.submit_completed_applicant', {
            instance_name: instance_name,
            from_username: from_username,
            applicant_name: applicant_name,
            final_decision: push_final_decision
        }, lang);
        if (!approves_description) {
            body["email"] = TAPi18n.__('instance.email.body.submit_completed_applicant', {
                instance_name: instance_name,
                to_username: to_username,
                current_username: current_user_name,
                href: href,
                applicant_name: applicant_name,
                final_decision: email_final_decision,
                description: email_description,
                lastApprove_usersname: lastApprove_usersname
            }, lang);
        } else {
            if (currentStep_type === "counterSign") {
                body["email"] = TAPi18n.__('instance.email.body.submit_completed_applicant_beApproveDescription_counterSign', {
                    instance_name: instance_name,
                    to_username: to_username,
                    current_username: current_user_name,
                    applicant_name: applicant_name,
                    final_decision: email_final_decision,
                    description: email_description,
                    lastApprove_usersname: lastApprove_usersname
                }, lang) + approves_description + TAPi18n.__('help.href', {
                    href: href
                }, lang);
            } else {
                body["email"] = TAPi18n.__('instance.email.body.submit_completed_applicant_beApproveDescription', {
                    instance_name: instance_name,
                    to_username: to_username,
                    current_username: current_user_name,
                    href: href,
                    applicant_name: applicant_name,
                    final_decision: email_final_decision,
                    description: email_description,
                    lastApprove_usersname: lastApprove_usersname,
                    approves_description: approves_description
                }, lang);
            }
        }
    } else if ("submit_completed_approve" === send_from) {
        body["push"] = TAPi18n.__('instance.push.body.submit_completed_approve', {
            instance_name: instance_name,
            from_username: from_username,
            applicant_name: applicant_name,
            final_decision: push_final_decision
        }, lang);
        body["email"] = TAPi18n.__('instance.email.body.submit_completed_approve', {
            instance_name: instance_name,
            to_username: to_username,
            current_username: current_user_name,
            href: href,
            applicant_name: applicant_name,
            final_decision: email_final_decision,
            description: email_description
        }, lang);
    } else if ("submit_pending_rejected_applicant_inbox" === send_from) {
        body["push"] = TAPi18n.__('instance.push.body.submit_pending_rejected_applicant_inbox', {
            instance_name: instance_name,
            from_username: from_username,
            applicant_name: applicant_name,
            final_decision: push_final_decision,
            description: description
        }, lang);
        body["email"] = TAPi18n.__('instance.email.body.submit_pending_rejected_applicant_inbox', {
            instance_name: instance_name,
            to_username: to_username,
            current_username: current_user_name,
            href: href,
            applicant_name: applicant_name,
            final_decision: email_final_decision,
            description: email_description,
            lastApprove_usersname: lastApprove_usersname
        }, lang);
    } else if ("submit_pending_rejected_applicant" === send_from) {
        body["push"] = TAPi18n.__('instance.push.body.submit_pending_rejected_applicant', {
            instance_name: instance_name,
            from_username: from_username,
            applicant_name: applicant_name,
            final_decision: push_final_decision,
            description: description,
            nextApprove_usersname: nextApprove_usersname
        }, lang);
        body["email"] = TAPi18n.__('instance.email.body.submit_pending_rejected_applicant', {
            instance_name: instance_name,
            to_username: to_username,
            current_username: current_user_name,
            href: href,
            applicant_name: applicant_name,
            final_decision: email_final_decision,
            description: email_description,
            lastApprove_usersname: lastApprove_usersname,
            nextApprove_usersname: nextApprove_usersname
        }, lang);
    } else if ("submit_pending_rejected_approve" === send_from) {
        body["push"] = TAPi18n.__('instance.push.body.submit_pending_rejected_approve', {
            instance_name: instance_name,
            from_username: from_username,
            applicant_name: applicant_name,
            final_decision: push_final_decision,
            description: description,
            current_user: current_user_name,
            nextApprove_usersname: nextApprove_usersname,
            current_step_name: current_step_name
        }, lang);
        body["email"] = TAPi18n.__('instance.email.body.submit_pending_rejected_approve', {
            instance_name: instance_name,
            to_username: to_username,
            current_username: current_user_name,
            href: href,
            applicant_name: applicant_name,
            final_decision: email_final_decision,
            description: email_description
        }, lang);
    } else if ("submit_pending_rejected_inbox" === send_from) {
        body["push"] = TAPi18n.__('instance.push.body.submit_pending_rejected_inbox', {
            instance_name: instance_name,
            from_username: from_username,
            applicant_name: applicant_name,
            final_decision: push_final_decision,
            approve_type: push_approve_type
        }, lang);
        body["email"] = TAPi18n.__('instance.email.body.submit_pending_rejected_inbox', {
            instance_name: instance_name,
            to_username: to_username,
            href: href,
            applicant_name: applicant_name,
            final_decision: email_final_decision,
            description: email_description,
            approve_type: email_approve_type,
            url_approve_type: url_approve_type,
            lastApprove_usersname: lastApprove_usersname
        }, lang);
    } else if ("submit_pending_inbox" === send_from) {
        body["push"] = TAPi18n.__('instance.push.body.submit_pending_inbox', {
            instance_name: instance_name,
            from_username: from_username,
            applicant_name: applicant_name,
            final_decision: push_final_decision,
            approve_type: push_approve_type
        }, lang);
        if (!approves_description) {
            body["email"] = TAPi18n.__('instance.email.body.submit_pending_inbox', {
                instance_name: instance_name,
                to_username: to_username,
                href: href,
                applicant_name: applicant_name,
                final_decision: email_final_decision,
                description: email_description,
                approve_type: email_approve_type,
                url_approve_type: url_approve_type,
                lastApprove_usersname: lastApprove_usersname,
                last_approve_judge: last_approve_judge
            }, lang);
        } else {
            if (currentStep_type === "counterSign") {
                body["email"] = TAPi18n.__('instance.email.body.submit_pending_inbox_beApproveDescription_counterSign', {
                    instance_name: instance_name,
                    to_username: to_username,
                    applicant_name: applicant_name,
                    final_decision: email_final_decision,
                    description: email_description,
                    approve_type: email_approve_type,
                    url_approve_type: url_approve_type,
                    lastApprove_usersname: lastApprove_usersname,
                    last_approve_judge: last_approve_judge
                }, lang) + approves_description + TAPi18n.__('help.href', {
                    href: href
                }, lang);
            } else {
                body["email"] = TAPi18n.__('instance.email.body.submit_pending_inbox_beApproveDescription', {
                    instance_name: instance_name,
                    to_username: to_username,
                    href: href,
                    applicant_name: applicant_name,
                    final_decision: email_final_decision,
                    description: email_description,
                    approve_type: email_approve_type,
                    url_approve_type: url_approve_type,
                    lastApprove_usersname: lastApprove_usersname,
                    last_approve_judge: last_approve_judge,
                    approves_description: approves_description
                }, lang);
            }
        }
    } else if ("submit_terminate_applicant" === send_from) {
        body["push"] = TAPi18n.__('instance.push.body.submit_terminate_applicant', {
            instance_name: instance_name,
            from_username: from_username,
            applicant_name: applicant_name,
            final_decision: push_final_decision
        }, lang);
        body["email"] = TAPi18n.__('instance.email.body.submit_terminate_applicant', {
            instance_name: instance_name,
            to_username: to_username,
            current_username: current_user_name,
            href: href,
            applicant_name: applicant_name,
            final_decision: email_final_decision,
            description: description
        }, lang);
    } else if ("submit_terminate_approve" === send_from) {
        body["push"] = TAPi18n.__('instance.push.body.submit_terminate_approve', {
            instance_name: instance_name,
            from_username: from_username,
            applicant_name: applicant_name,
            final_decision: push_final_decision
        }, lang);
        body["email"] = TAPi18n.__('instance.email.body.submit_terminate_approve', {
            instance_name: instance_name,
            to_username: to_username,
            current_username: current_user_name,
            href: href,
            applicant_name: applicant_name,
            final_decision: email_final_decision,
            description: description
        }, lang);
    } else if ("monitor_delete_applicant" === send_from) {
        body["push"] = TAPi18n.__('instance.push.body.monitor_delete_applicant', {
            instance_name: instance_name,
            from_username: from_username,
            applicant_name: applicant_name,
            final_decision: push_final_decision
        }, lang);
        body["email"] = TAPi18n.__('instance.email.body.monitor_delete_applicant', {
            instance_name: instance_name,
            to_username: to_username,
            current_username: current_user_name,
            href: href,
            applicant_name: applicant_name,
            final_decision: email_final_decision,
            description: email_description
        }, lang);
    } else if ("approved_completed_applicant" === send_from) {
        body["push"] = TAPi18n.__('instance.push.body.approved_completed_applicant', {
            instance_name: instance_name,
            from_username: from_username,
            applicant_name: applicant_name,
            final_decision: push_final_decision
        }, lang);
        if (!approves_description) {
            body["email"] = TAPi18n.__('instance.email.body.approved_completed_applicant', {
                instance_name: instance_name,
                to_username: to_username,
                current_username: current_user_name,
                href: href,
                applicant_name: applicant_name,
                final_decision: email_final_decision,
                description: email_description,
                lastApprove_usersname: lastApprove_usersname
            }, lang);
        } else {
            body["email"] = TAPi18n.__('instance.email.body.approved_completed_applicant_beApproveDescription', {
                instance_name: instance_name,
                to_username: to_username,
                current_username: current_user_name,
                href: href,
                applicant_name: applicant_name,
                final_decision: email_final_decision,
                description: email_description,
                lastApprove_usersname: lastApprove_usersname,
                approves_description: approves_description
            }, lang);
        }
    } else if ("approved_completed_approve" === send_from) {
        body["push"] = TAPi18n.__('instance.push.body.approved_completed_approve', {
            instance_name: instance_name,
            from_username: from_username,
            applicant_name: applicant_name,
            final_decision: push_final_decision
        }, lang);
        body["email"] = TAPi18n.__('instance.email.body.approved_completed_approve', {
            instance_name: instance_name,
            to_username: to_username,
            current_username: current_user_name,
            href: href,
            applicant_name: applicant_name,
            final_decision: email_final_decision,
            description: email_description
        }, lang);
    } else if ("rejected_completed_applicant" === send_from) {
        body["push"] = TAPi18n.__('instance.push.body.rejected_completed_applicant', {
            instance_name: instance_name,
            from_username: from_username,
            applicant_name: applicant_name,
            final_decision: push_final_decision,
            description: description
        }, lang);
        body["email"] = TAPi18n.__('instance.email.body.rejected_completed_applicant', {
            instance_name: instance_name,
            to_username: to_username,
            current_username: current_user_name,
            href: href,
            applicant_name: applicant_name,
            final_decision: email_final_decision,
            description: email_description,
            lastApprove_usersname: lastApprove_usersname
        }, lang);
    } else if ("rejected_completed_approve" === send_from) {
        body["push"] = TAPi18n.__('instance.push.body.rejected_completed_approve', {
            instance_name: instance_name,
            from_username: from_username,
            applicant_name: applicant_name,
            final_decision: push_final_decision,
            description: description
        }, lang);
        body["email"] = TAPi18n.__('instance.email.body.rejected_completed_approve', {
            instance_name: instance_name,
            to_username: to_username,
            current_username: current_user_name,
            href: href,
            applicant_name: applicant_name,
            final_decision: email_final_decision,
            description: email_description
        }, lang);
    } else if ("reassign_new_inbox_users" === send_from) {
        body["push"] = TAPi18n.__('instance.push.body.reassign_new_inbox_users', {
            instance_name: instance_name,
            from_username: from_username,
            applicant_name: applicant_name,
            final_decision: push_final_decision,
            description: description,
            current_user_name: current_user_name,
            url_approve_type: url_approve_type,
            approve_type: push_approve_type
        }, lang);
        body["email"] = TAPi18n.__('instance.email.body.reassign_new_inbox_users', {
            instance_name: instance_name,
            to_username: to_username,
            current_username: current_user_name,
            href: href,
            applicant_name: applicant_name,
            final_decision: email_final_decision,
            description: description,
            current_user_name: current_user_name,
            url_approve_type: url_approve_type,
            approve_type: email_approve_type
        }, lang);
    } else if ("trace_approve_cc" === send_from) {
        body["push"] = TAPi18n.__('instance.push.body.trace_approve_cc', {
            instance_name: instance_name,
            from_username: from_username,
            applicant_name: applicant_name,
            final_decision: push_final_decision,
            approve_type: push_approve_type
        }, lang);
        body["email"] = TAPi18n.__('instance.email.body.trace_approve_cc', {
            instance_name: instance_name,
            to_username: to_username,
            href: href,
            applicant_name: applicant_name,
            final_decision: email_final_decision,
            description: email_description,
            approve_type: email_approve_type,
            url_approve_type: url_approve_type
        }, lang);
    } else if ("trace_approve_cc_submit" === send_from) {
        body["push"] = TAPi18n.__('instance.push.body.trace_approve_cc_submit', {
            instance_name: instance_name,
            from_username: from_username,
            applicant_name: applicant_name,
            final_decision: push_final_decision,
            approve_type: push_approve_type,
            current_user_name: current_user_name
        }, lang);
    } else if ("auto_submit_pending_inbox" === send_from) {
        body["push"] = TAPi18n.__('instance.push.body.auto_submit_pending_inbox', {
            instance_name: instance_name,
            current_step_name: current_step_name
        }, lang);
        body["email"] = TAPi18n.__('instance.email.body.auto_submit_pending_inbox', {
            instance_name: instance_name,
            current_step_name: current_step_name,
            to_username: to_username
        }, lang);
    } else if ("return_pending_inbox" === send_from) {
        body["push"] = TAPi18n.__('instance.push.body.return_pending_inbox', {
            instance_name: instance_name,
            current_step_name: current_step_name
        }, lang);
        body["email"] = TAPi18n.__('instance.email.body.return_pending_inbox', {
            instance_name: instance_name,
            current_step_name: current_step_name,
            to_username: to_username
        }, lang);
    }
    return body;
};

pushManager.get_title = function (parameters, lang = "zh-CN") {
    var applicant_name, approve_type, current_step_name, from_username, instance_name, nextApprove_usersname, nextStep_type, send_from, title;
    send_from = parameters["send_from"];
    instance_name = parameters["instance_name"];
    from_username = parameters["from_username"];
    applicant_name = parameters["applicant_name"];
    current_step_name = parameters["current_step_name"];
    nextApprove_usersname = parameters["nextApprove_usersname"];
    nextStep_type = parameters["nextStep_type"];
    approve_type = null;
    if (['submit', 'start'].includes(nextStep_type)) {
        approve_type = TAPi18n.__('instance.email.title.input', {}, lang);
    } else if (['sign', 'counterSign'].includes(nextStep_type)) {
        approve_type = TAPi18n.__('instance.email.title.approval', {}, lang);
    }
    title = new Object;
    if ("first_submit_applicant" === send_from) {
        title["push"] = TAPi18n.__('instance.push.title.first_submit_applicant', {
            from_username: from_username,
            instance_name: instance_name,
            applicant_name: applicant_name
        }, lang);
        title["email"] = TAPi18n.__('instance.email.title.first_submit_applicant', {
            from_username: from_username,
            instance_name: instance_name,
            applicant_name: applicant_name
        }, lang);
    } else if ("first_submit_inbox" === send_from) {
        title["push"] = TAPi18n.__('instance.push.title.first_submit_inbox', {
            from_username: from_username,
            instance_name: instance_name,
            applicant_name: applicant_name
        }, lang);
        title["email"] = TAPi18n.__('instance.email.title.first_submit_inbox', {
            from_username: from_username,
            instance_name: instance_name,
            applicant_name: applicant_name,
            approve_type: approve_type
        }, lang);
    } else if ("submit_completed_applicant" === send_from) {
        title["push"] = TAPi18n.__('instance.push.title.submit_completed_applicant', {
            from_username: from_username,
            instance_name: instance_name,
            applicant_name: applicant_name
        }, lang);
        title["email"] = TAPi18n.__('instance.email.title.submit_completed_applicant', {
            from_username: from_username,
            instance_name: instance_name,
            applicant_name: applicant_name
        }, lang);
    } else if ("submit_completed_approve" === send_from) {
        title["push"] = TAPi18n.__('instance.push.title.submit_completed_approve', {
            from_username: from_username,
            instance_name: instance_name,
            applicant_name: applicant_name
        }, lang);
        title["email"] = TAPi18n.__('instance.email.title.submit_completed_approve', {
            from_username: from_username,
            instance_name: instance_name,
            applicant_name: applicant_name
        }, lang);
    } else if ("submit_pending_rejected_applicant_inbox" === send_from) {
        title["push"] = TAPi18n.__('instance.push.title.submit_pending_rejected_applicant_inbox', {
            from_username: from_username,
            instance_name: instance_name,
            applicant_name: applicant_name
        }, lang);
        title["email"] = TAPi18n.__('instance.email.title.submit_pending_rejected_applicant_inbox', {
            from_username: from_username,
            instance_name: instance_name,
            applicant_name: applicant_name
        }, lang);
    } else if ("submit_pending_rejected_applicant" === send_from) {
        title["push"] = TAPi18n.__('instance.push.title.submit_pending_rejected_applicant', {
            from_username: from_username,
            instance_name: instance_name,
            applicant_name: applicant_name,
            nextApprove_usersname: nextApprove_usersname
        }, lang);
        title["email"] = TAPi18n.__('instance.email.title.submit_pending_rejected_applicant', {
            from_username: from_username,
            instance_name: instance_name,
            applicant_name: applicant_name,
            nextApprove_usersname: nextApprove_usersname
        }, lang);
    } else if ("submit_pending_rejected_approve" === send_from) {
        title["push"] = TAPi18n.__('instance.push.title.submit_pending_rejected_approve', {
            from_username: from_username,
            instance_name: instance_name,
            applicant_name: applicant_name
        }, lang);
        title["email"] = TAPi18n.__('instance.email.title.submit_pending_rejected_approve', {
            from_username: from_username,
            instance_name: instance_name,
            applicant_name: applicant_name,
            current_user: current_user_name,
            nextApprove_usersname: nextApprove_usersname,
            current_step_name: current_step_name
        }, lang);
    } else if ("submit_pending_rejected_inbox" === send_from) {
        title["push"] = TAPi18n.__('instance.push.title.submit_pending_rejected_inbox', {
            from_username: from_username,
            instance_name: instance_name,
            applicant_name: applicant_name
        }, lang);
        title["email"] = TAPi18n.__('instance.email.title.submit_pending_rejected_inbox', {
            from_username: from_username,
            instance_name: instance_name,
            applicant_name: applicant_name,
            approve_type: approve_type
        }, lang);
    } else if ("submit_pending_inbox" === send_from) {
        title["push"] = TAPi18n.__('instance.push.title.submit_pending_inbox', {
            from_username: from_username,
            instance_name: instance_name,
            applicant_name: applicant_name
        }, lang);
        title["email"] = TAPi18n.__('instance.email.title.submit_pending_inbox', {
            from_username: from_username,
            instance_name: instance_name,
            applicant_name: applicant_name,
            approve_type: approve_type
        }, lang);
    } else if ("submit_terminate_applicant" === send_from) {
        title["push"] = TAPi18n.__('instance.push.title.submit_terminate_applicant', {
            from_username: from_username,
            instance_name: instance_name,
            applicant_name: applicant_name
        }, lang);
        title["email"] = TAPi18n.__('instance.email.title.submit_terminate_applicant', {
            from_username: from_username,
            instance_name: instance_name,
            applicant_name: applicant_name
        }, lang);
    } else if ("submit_terminate_approve" === send_from) {
        title["push"] = TAPi18n.__('instance.push.title.submit_terminate_approve', {
            from_username: from_username,
            instance_name: instance_name,
            applicant_name: applicant_name
        }, lang);
        title["email"] = TAPi18n.__('instance.email.title.submit_terminate_approve', {
            from_username: from_username,
            instance_name: instance_name,
            applicant_name: applicant_name
        }, lang);
    } else if ("monitor_delete_applicant" === send_from) {
        title["push"] = TAPi18n.__('instance.push.title.monitor_delete_applicant', {
            from_username: from_username,
            instance_name: instance_name,
            applicant_name: applicant_name
        }, lang);
        title["email"] = TAPi18n.__('instance.email.title.monitor_delete_applicant', {
            from_username: from_username,
            instance_name: instance_name,
            applicant_name: applicant_name
        }, lang);
    } else if ("approved_completed_applicant" === send_from) {
        title["push"] = TAPi18n.__('instance.push.title.approved_completed_applicant', {
            from_username: from_username,
            instance_name: instance_name,
            applicant_name: applicant_name
        }, lang);
        title["email"] = TAPi18n.__('instance.email.title.approved_completed_applicant', {
            from_username: from_username,
            instance_name: instance_name,
            applicant_name: applicant_name
        }, lang);
    } else if ("approved_completed_approve" === send_from) {
        title["push"] = TAPi18n.__('instance.push.title.approved_completed_approve', {
            from_username: from_username,
            instance_name: instance_name,
            applicant_name: applicant_name
        }, lang);
        title["email"] = TAPi18n.__('instance.email.title.approved_completed_approve', {
            from_username: from_username,
            instance_name: instance_name,
            applicant_name: applicant_name
        }, lang);
    } else if ("rejected_completed_applicant" === send_from) {
        title["push"] = TAPi18n.__('instance.push.title.rejected_completed_applicant', {
            from_username: from_username,
            instance_name: instance_name,
            applicant_name: applicant_name
        }, lang);
        title["email"] = TAPi18n.__('instance.email.title.rejected_completed_applicant', {
            from_username: from_username,
            instance_name: instance_name,
            applicant_name: applicant_name
        }, lang);
    } else if ("rejected_completed_approve" === send_from) {
        title["push"] = TAPi18n.__('instance.push.title.rejected_completed_approve', {
            from_username: from_username,
            instance_name: instance_name,
            applicant_name: applicant_name
        }, lang);
        title["email"] = TAPi18n.__('instance.email.title.rejected_completed_approve', {
            from_username: from_username,
            instance_name: instance_name,
            applicant_name: applicant_name
        }, lang);
    } else if ("reassign_new_inbox_users" === send_from) {
        title["push"] = TAPi18n.__('instance.push.title.reassign_new_inbox_users', {
            from_username: from_username,
            instance_name: instance_name,
            applicant_name: applicant_name,
            approve_type: approve_type
        }, lang);
        title["email"] = TAPi18n.__('instance.email.title.reassign_new_inbox_users', {
            from_username: from_username,
            instance_name: instance_name,
            applicant_name: applicant_name,
            approve_type: approve_type
        }, lang);
    } else if ("trace_approve_cc" === send_from) {
        title["push"] = TAPi18n.__('instance.push.title.trace_approve_cc', {
            from_username: from_username,
            instance_name: instance_name,
            applicant_name: applicant_name
        }, lang);
        title["email"] = TAPi18n.__('instance.email.title.trace_approve_cc', {
            from_username: from_username,
            instance_name: instance_name,
            applicant_name: applicant_name,
            approve_type: approve_type
        }, lang);
    } else if ("trace_approve_cc_submit" === send_from) {
        title["push"] = TAPi18n.__('instance.push.title.trace_approve_cc_submit', {
            from_username: from_username,
            instance_name: instance_name,
            applicant_name: applicant_name
        }, lang);
    } else if ("auto_submit_pending_inbox" === send_from) {
        title["push"] = TAPi18n.__('instance.push.title.auto_submit_pending_inbox', {
            from_username: from_username,
            instance_name: instance_name,
            applicant_name: applicant_name
        }, lang);
        title["email"] = TAPi18n.__('instance.email.title.auto_submit_pending_inbox', {
            from_username: from_username,
            instance_name: instance_name,
            applicant_name: applicant_name,
            approve_type: approve_type
        }, lang);
    } else if ("return_pending_inbox" === send_from) {
        title["push"] = TAPi18n.__('instance.push.title.return_pending_inbox', {
            from_username: from_username,
            instance_name: instance_name,
            applicant_name: applicant_name
        }, lang);
        title["email"] = TAPi18n.__('instance.email.title.return_pending_inbox', {
            from_username: from_username,
            instance_name: instance_name,
            applicant_name: applicant_name,
            approve_type: approve_type
        }, lang);
    }
    return title;
};

pushManager.getSmsBody = function (parameters, lang = "zh-CN") {
    return TAPi18n.__('instance.sms.submit_pending_inbox', parameters, lang);
};

pushManager.get_badge = function (send_from, user_id) {
    var badge, sk_all, sk_all_new, user_spaces;
    if (!['first_submit_inbox', 'submit_pending_rejected_inbox', 'submit_pending_inbox', 'current_user', 'terminate_approval', 'reassign_new_inbox_users', 'trace_approve_cc', 'trace_approve_cc_submit', 'auto_submit_pending_inbox', 'return_pending_inbox'].includes(send_from)) {
        return null;
    }
    if (!user_id) {
        console.log('pushManager.get_badge: send_from is ', send_from);
        return null;
    }
    badge = 0;
    user_spaces = db.space_users.direct.find({
        user: user_id,
        user_accepted: true
    }, {
        fields: {
            space: 1
        }
    });
    user_spaces.forEach(function (user_space) {
        var appCategories, c, categories, ref4, sk, sk_new, spaceId;
        spaceId = user_space.space;

        categories = db.categories.direct.find({
            space: spaceId,
            app: {
                $ne: null
            }
        }, {
            fields: { app: 1 }
        }).fetch();
        if (categories.length > 0) {
            appCategories = _.groupBy(categories, 'app');
            _.each(appCategories, function (categorys, appName) {
                var _set, appKeyValue, appKeyValueNew, categoryBadge, categorysIds, ref4;
                categorysIds = _.pluck(categorys, '_id');
                if (appName) {
                    if (categorysIds.length > 0) {

                        categoryBadge = count_instance_tasks({
                            filters: [
                                ['handler', '=', user_id],
                                ['is_finished', '=', false],
                                ['space', '=', spaceId],
                                ['category', 'in', categorysIds],
                            ]
                        })

                        appKeyValue = db.steedos_keyvalues.direct.findOne({
                            user: user_id,
                            space: user_space.space,
                            key: 'badge'
                        }, {
                            fields: {
                                _id: 1,
                                value: 1
                            }
                        });
                        if (appKeyValue) {
                            if (((ref4 = appKeyValue.value) != null ? ref4[appName] : void 0) !== categoryBadge) {
                                _set = {};
                                _set['value.' + appName] = categoryBadge;
                                return db.steedos_keyvalues.direct.update({
                                    _id: appKeyValue._id
                                }, {
                                    $set: _set
                                });
                            }
                        } else {
                            appKeyValueNew = {};
                            appKeyValueNew.user = user_id;
                            appKeyValueNew.space = user_space.space;
                            appKeyValueNew.key = 'badge';
                            appKeyValueNew.value = {};
                            appKeyValueNew.value[appName] = categoryBadge;
                            return db.steedos_keyvalues.direct.insert(appKeyValueNew);
                        }
                    }
                }
            });
        }

        // workflow 记录所有待办数量
        c = count_instance_tasks({
            filters: [
                ['handler', '=', user_id],
                ['is_finished', '=', false],
                ['space', '=', spaceId],
            ]
        })
        badge += c;
        sk = db.steedos_keyvalues.direct.findOne({
            user: user_id,
            space: user_space.space,
            key: 'badge'
        }, {
            fields: {
                _id: 1,
                value: 1
            }
        });
        if (sk) {
            if (((ref4 = sk.value) != null ? ref4.workflow : void 0) !== c) {
                return db.steedos_keyvalues.direct.update({
                    _id: sk._id
                }, {
                    $set: {
                        'value.workflow': c
                    }
                });
            }
        } else {
            sk_new = {};
            sk_new.user = user_id;
            sk_new.space = user_space.space;
            sk_new.key = 'badge';
            sk_new.value = {
                'workflow': c
            };
            return db.steedos_keyvalues.direct.insert(sk_new);
        }
    });
    sk_all = db.steedos_keyvalues.direct.findOne({
        user: user_id,
        space: null,
        key: 'badge'
    }, {
        fields: {
            _id: 1
        }
    });
    if (sk_all) {
        db.steedos_keyvalues.direct.update({
            _id: sk_all._id
        }, {
            $set: {
                'value.workflow': badge
            }
        });
    } else {
        sk_all_new = {};
        sk_all_new.user = user_id;
        sk_all_new.space = null;
        sk_all_new.key = 'badge';
        sk_all_new.value = {
            'workflow': badge
        };
        db.steedos_keyvalues.direct.insert(sk_all_new);
    }
    return badge;
};

// 发送消息到qq
pushManager.send_to_qq = function (to_user, from_user, space_id, instance_id, instance_state, body, i18n_obj) {
    if (process.env.STEEDOS_DEBUG_DISABLE_PUSHMANAGER) {
        return
    }
    var app_id, box, bqq_uri, e, employee_access_token, oauth, open_id, recv_open_ids, response, space, tips_url;
    try {
        if ((!to_user.services) || (!to_user.services['bqq']) || (!to_user.services['bqq']['id'])) {
            return;
        }
        space = db.spaces.findOne({
            _id: space_id,
            "services.bqq.company_id": {
                $ne: null
            }
        }, {
            fields: {
                services: 1
            }
        });
        if (!space) {
            return;
        }
        app_id = this.bqq_app_id;
        open_id = from_user.services['bqq']['id'];
        employee_access_token = from_user.services['bqq']['accessToken'];
        recv_open_ids = to_user.services['bqq']['id'];
        oauth = space['services']['bqq'];
        box = "inbox";
        if (instance_state === "completed") {
            box = "completed";
        }
        tips_url = '/workflow/space/' + space_id + '/' + box + '/' + instance_id;
        bqq_uri = encodeURI('https://openapi.b.qq.com/api/combomsg/send?company_id=' + oauth['company_id'] + '&company_token=' + oauth['company_token'] + '&app_id=' + app_id + '&client_ip=0.0.0.0' + '&oauth_version=2' + '&employee_access_token=' + employee_access_token + '&brief=' + body['alert'] + '&url=' + tips_url + '&type=picture' + '&title=' + body['alert'] + '&summary=' + body['alertTitle'] + '&recv_open_ids=' + recv_open_ids + '&open_id=' + open_id);
        response = HTTP.post(bqq_uri);
        if (response.data.ret > 0) {
            console.error(response.data.msg);
        }
    } catch (error) {
        e = error;
        return console.error(e.stack);
    }
};

pushManager.send_email_to_SMTP = function (subject, content, to_user, reply_user) {
    if (process.env.STEEDOS_DEBUG_DISABLE_PUSHMANAGER) {
        return
    }
    var e;
    if (to_user.email && to_user.email_verified && to_user.email_notification) {
        try {
            return MailQueue.send({
                to: to_user.email,
                from: pushManager.checkMailFromNameLength(reply_user.name) + ' on ' + Meteor.settings.email.from,
                subject: subject,
                html: content
            });
        } catch (error) {
            e = error;
            return console.error(e.stack);
        }
    }
};

pushManager.checkMailFromNameLength = function (name) {
    if (name.length <= 18) {
        return name;
    } else {
        return name.substr(0, 18) + '...';
    }
};

pushManager.send_message_by_raix_push = function (data) {
    if (process.env.STEEDOS_DEBUG_DISABLE_PUSHMANAGER) {
        return
    }
    var e, notification, payload;
    if (!data["data"]) {
        return;
    }
    try {
        notification = new Object;
        notification["createdAt"] = new Date;
        notification["createdBy"] = '<SERVER>';
        notification["from"] = data["pushTopic"];
        notification['title'] = data["data"]["alertTitle"] ? data["data"]["alertTitle"] : "";
        notification['text'] = data["data"]["alert"] ? data["data"]["alert"] : "";
        if (data["data"]["space_id"] && data["data"]["instance_id"]) {
            payload = new Object;
            payload["space"] = data["data"]["space_id"];
            payload["instance"] = data["data"]["instance_id"];
            payload["host"] = Meteor.absoluteUrl().substr(0, Meteor.absoluteUrl().length - 1);
            notification["payload"] = payload;
        }
        if (data["data"]["badge"] > -1) {
            notification['badge'] = data["data"]["badge"];
        }
        return _.each(data["toUsers"], function (u) {
            var user;
            user = db.users.findOne({
                steedos_id: u
            }, {
                fields: {
                    _id: 1
                }
            });
            if (user) {
                notification['query'] = {
                    userId: user._id,
                    appName: data["pushTopic"]
                };
                return Push.send(notification);
            }
        });
    } catch (error) {
        e = error;
        return console.error(e.stack);
    }
};

//steedos_ids 必须为数组 ； body 如果有，则必须为Hash
pushManager.send_message = function (steedos_ids, body) {
    if (process.env.STEEDOS_DEBUG_DISABLE_PUSHMANAGER) {
        return
    }
    var data;
    if (!steedos_ids || !(steedos_ids instanceof Array)) {
        return;
    }
    data = new Object;
    data["toUsers"] = steedos_ids;
    data["pushTopic"] = 'workflow';
    if (body) {
        data["data"] = body;
    }
    return pushManager.send_message_by_raix_push(data);
};

pushManager.send_to_sms = function (to_user, message, current_user_info, spaceId) {
    if (process.env.STEEDOS_DEBUG_DISABLE_PUSHMANAGER) {
        return
    }
    var ref4, ref5, spaceUser;
    if (((ref4 = Meteor.settings) != null ? (ref5 = ref4.workflow) != null ? ref5.sms_notification : void 0 : void 0) && (to_user != null ? to_user.mobile : void 0) && (to_user != null ? to_user.mobile_verified : void 0)) {
        spaceUser = db.space_users.findOne({
            user: to_user._id,
            space: spaceId
        }, {
            fields: {
                sms_notification: 1
            }
        });
        if (spaceUser != null ? spaceUser.sms_notification : void 0) {
            return SMSQueue.send({
                RecNum: to_user.mobile,
                msg: message,
                createdBy: current_user_info._id
            }, spaceId);
        }
    }
};

//通知服务
pushManager.send_instance_notification = function (send_from, instance, description, current_user_info, cc_user_ids, flowDoc) {
    if (process.env.STEEDOS_DEBUG_DISABLE_PUSHMANAGER) {
        return
    }
    // console.log('[push_manager.js]>>>>>>>>>>>>>>>>>>>>', 'pushManager.send_instance_notification');
    var _approves_des, _approves_username, approve, approves_description, body_style_end, body_style_start, current_step, current_step_name, e, flow, flow_version, from_user, href, instance_id, lastApprove_judge, lastApprove_usersname, nextApprove_usersname, nextStep_type, parameters, space_id, to_user_change, to_users, trace;
    try {
        // Meteor.defer ()->
        space_id = instance.space;
        instance_id = instance._id;
        flow_version = instance.flow_version;
        flow = flowDoc || uuflowManager.getFlow(instance.flow);
        to_users = pushManager.get_to_users(send_from, instance, cc_user_ids, current_user_info);
        href = Meteor.absoluteUrl() + `workflow/space/${space_id}/inbox/${instance_id}`;
        body_style_start = "<div style='border:1px solid #bbb;padding:10px;'>";
        body_style_end = "</div>";
        current_step_name = instance.current_step_name;
        nextApprove_usersname = null;
        if (['submit_pending_rejected_approve', 'submit_pending_rejected_applicant'].includes(send_from)) {
            trace = _.find(instance.traces, function (t) {
                return t.is_finished === false;
            });
            approve = _.find(trace.approves, function (a) {
                return a.is_finished === false;
            });
            nextApprove_usersname = approve.user_name;
        }
        //得到下一步步骤类型
        nextStep_type = uuflowManager.getStep(instance, flow, instance.traces[instance.traces.length - 1].step).step_type;
        //得到上一步处理结果
        lastApprove_judge = instance.traces[instance.traces.length - 2].approves[0].judge;
        _approves_username = new Array;
        _.each(instance.traces[instance.traces.length - 2].approves, function (appr) {
            return _approves_username.push(appr.handler_name);
        });
        lastApprove_usersname = _approves_username.join(",");
        // 得到当前步骤
        current_step = uuflowManager.getStep(instance, flow, instance.traces[instance.traces.length - 2].step);
        //代申请时，发送给申请人的邮件中，需要添加开始步骤的description
        approves_description = null;
        _approves_des = null;
        if (['reassign_new_inbox_users', 'submit_completed_applicant', 'approved_completed_applicant', 'first_submit_applicant', 'first_submit_inbox', 'submit_pending_inbox'].includes(send_from)) {
            approves_description = instance.traces[instance.traces.length - 2].approves[0].description;
            if (current_step.step_type === "counterSign" && ("submit_completed_applicant" === send_from || "submit_pending_inbox" === send_from)) {
                to_user_change = 'en';
                if (to_users[0].locale === 'zh-cn') {
                    to_user_change = 'zh-CN';
                }
                _.each(instance.traces[instance.traces.length - 2].approves, function (appr) {
                    var _appr_description, _appr_userName, br;
                    _appr_description = appr.description;
                    _appr_userName = appr.user_name;
                    br = '<br/>';
                    if (appr.judge === "approved") {
                        return _approves_des = _appr_userName + " : " + TAPi18n.__('instance.judge.approved', {}, to_user_change) + "," + _appr_description + br;
                    } else if (appr.judge === "rejected") {
                        return _approves_des = _appr_userName + " : " + TAPi18n.__('instance.judge.rejected', {}, to_user_change) + "," + _appr_description + br;
                    }
                });
                approves_description = _approves_des;
            }
        }
        // from_user 默认为当前登录用户
        from_user = current_user_info;
        // 发给下一步处理人或发送已处理过的人时，设置from_user对象为申请人
        if (['reassign_new_inbox_users', 'first_submit_inbox', 'submit_pending_rejected_inbox', 'submit_pending_inbox', 'submit_completed_approve', 'submit_pending_rejected_approve', 'submit_terminate_approve', 'approved_completed_approve', 'rejected_completed_approve'].includes(send_from)) {
            from_user = db.users.findOne(instance.applicant);
        }
        //创建调用get_body、get_title函数时， 需要的参数
        parameters = new Object;
        parameters["send_from"] = send_from;
        parameters["applicant_name"] = instance.applicant_name;
        parameters["instance_name"] = instance.name;
        parameters["href"] = href;
        parameters["final_decision"] = instance.final_decision;
        parameters["description"] = description;
        parameters["state"] = instance.state;
        parameters["from_username"] = from_user.name;
        parameters["current_step_name"] = current_step_name;
        parameters["nextApprove_usersname"] = nextApprove_usersname;
        parameters["nextStep_type"] = nextStep_type;
        parameters["approves_description"] = approves_description;
        parameters["lastApprove_judge"] = lastApprove_judge;
        parameters["lastApprove_usersname"] = lastApprove_usersname;
        parameters["current_user_name"] = current_user_info.name;
        parameters["currentStep_type"] = current_step.step_type;
        return _.each(to_users, function (to_user) {
            var badge, body, content, e, footnote, ins_html, inscribed, lang, push_body, title;
            //设置当前语言环境
            lang = 'en';
            if (to_user.locale === 'zh-cn') {
                lang = 'zh-CN';
            }
            inscribed = TAPi18n.__('instance.email.inscribed', {}, lang);
            footnote = "<p style='text-align:left;color:#bbb;'>" + TAPi18n.__('instance.email.footnote', {}, lang) + "</p>";

            parameters["to_username"] = to_user.name;
            ins_html = '';
            if (['first_submit_inbox', 'submit_pending_inbox', 'submit_pending_rejected_inbox', 'submit_pending_rejected_applicant_inbox', 'reassign_new_inbox_users', 'trace_approve_cc', 'auto_submit_pending_inbox'].includes(send_from)) {
                if (current_user_info.email && current_user_info.email_notification) {
                    try {
                        // console.time("push-2-1-ins_html")
                        ins_html = uuflowManager.ins_html(current_user_info, instance);
                    } catch (error) {
                        // console.timeEnd("push-2-1-ins_html")
                        e = error;
                        console.error(e);
                    }
                }
            }
            body = pushManager.get_body(parameters, lang);
            title = pushManager.get_title(parameters, lang);
            badge = pushManager.get_badge(send_from, to_user._id);
            // push
            push_body = new Object;
            push_body["alertTitle"] = title["push"];
            push_body["alert"] = body["push"];
            //push_body["href"] = href
            push_body["space_id"] = space_id;
            push_body["instance_id"] = instance_id;
            if (badge) {
                push_body["badge"] = badge;
            }
            push_body["sound"] = "default";
            content = body_style_start + body["email"] + inscribed + ins_html + body_style_end + footnote;
            // Email
            // 发送消息到 SMTP 服务
            pushManager.send_email_to_SMTP(title["email"], content, to_user, from_user);
            // 发送消息到push service 服务
            pushManager.send_message([to_user.steedos_id], push_body, current_user_info);
            // 给下一步处理人发送短信
            if (['reassign_new_inbox_users', 'submit_pending_rejected_applicant_inbox', 'submit_pending_rejected_inbox', 'submit_pending_inbox', 'first_submit_inbox', 'return_pending_inbox'].includes(send_from)) {
                pushManager.send_to_sms(to_user, pushManager.getSmsBody(parameters, lang), current_user_info, space_id);
            }
            return pushManager.send_to_qq(to_user, from_user, space_id, instance_id, instance.state, push_body, lang);
        });
    } catch (error) {
        e = error;
        return console.error(e.stack);
    }
};

// 发送给当前用户
pushManager.send_message_current_user = function (user_info) {
    if (process.env.STEEDOS_DEBUG_DISABLE_PUSHMANAGER) {
        return
    }
    var badge, e, push_body;
    try {
        badge = this.get_badge("current_user", user_info._id);
        push_body = new Object;
        push_body["badge"] = badge;
        return this.send_message([user_info.steedos_id], push_body, user_info);
    } catch (error) {
        e = error;
        return console.error(e.stack);
    }
};

// 发送push 并且内容只有待审核数量
pushManager.send_message_to_specifyUser = function (send_from, to_user) {
    if (process.env.STEEDOS_DEBUG_DISABLE_PUSHMANAGER) {
        return
    }
    var badge, e, push_body, user_info;
    try {
        badge = this.get_badge(send_from, to_user);
        push_body = new Object;
        push_body["badge"] = badge;
        user_info = db.users.findOne({
            _id: to_user
        }, {
            fields: {
                steedos_id: 1
            }
        });
        if (user_info) {
            return this.send_message([user_info.steedos_id], push_body);
        }
    } catch (error) {
        e = error;
        return console.error(e.stack);
    }
};

pushManager.triggerWebhook = function (flow_id, instance, current_approve, action, from_user_id, to_user_ids) {
    if (process.env.STEEDOS_DEBUG_DISABLE_PUSHMANAGER) {
        return
    }
    if (!pushManager.hasWebhooks(flow_id)) { // 没有webhook，不需要发送
        return;
    }
    var from_space_user, from_user, to_users;
    instance.attachments = cfs.instances.find({
        'metadata.instance': instance._id
    }).fetch();
    // 增加from_user和to_users的username、email、mobile
    from_user = db.users.findOne({
        "_id": from_user_id
    }, {
        fields: {
            _id: 1,
            username: 1
        }
    });
    from_space_user = db.space_users.findOne({
        "user": from_user_id
    }, {
        fields: {
            mobile: 1,
            email: 1
        }
    });
    if (from_user != null) {
        from_user.mobile = (from_space_user != null ? from_space_user.mobile : void 0) || "";
    }
    if (from_user != null) {
        from_user.email = (from_space_user != null ? from_space_user.email : void 0) || "";
    }
    if (to_user_ids.length > 0) {
        to_users = db.users.find({
            "_id": {
                $in: to_user_ids
            }
        }, {
            fields: {
                _id: 1,
                username: 1
            }
        }).fetch();
        to_users.forEach(function (to_user) {
            var to_space_user;
            to_space_user = db.space_users.findOne({
                "user": to_user._id
            }, {
                fields: {
                    mobile: 1,
                    email: 1
                }
            });
            if (to_user != null) {
                to_user.mobile = (to_space_user != null ? to_space_user.mobile : void 0) || "";
            }
            return to_user != null ? to_user.email = (to_space_user != null ? to_space_user.email : void 0) || "" : void 0;
        });
    }
    return db.webhooks.find({
        flow: {
            $in: [flow_id, null]
        },
        active: true
    }).forEach(function (w) {
        return WebhookQueue.send({
            instance: instance,
            current_approve: current_approve,
            payload_url: w.payload_url,
            content_type: w.content_type,
            action: action,
            from_user: from_user,
            to_users: to_users || []
        });
    });
};

pushManager.hasWebhooks = function (flow_id) {
    var webhookDocsCount = db.webhooks.find({
        flow: {
            $in: [flow_id, null]
        },
        active: true
    }).count();
    return webhookDocsCount > 0;
}
