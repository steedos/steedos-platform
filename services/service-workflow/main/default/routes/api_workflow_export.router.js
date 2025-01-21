/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-24 11:56:18
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-26 11:18:12
 * @Description: 
 */
'use strict';
// @ts-check
const express = require('express');
const router = express.Router();
const auth = require('@steedos/auth');
const _ = require('underscore');
const Fiber = require('fibers');
const moment = require('moment')
const fs = require('fs')
const path = require('path')
/**
@api {get} /api/workflow/export/instances 申请单导出
@apiVersion 0.0.0
@apiName /api/workflow/export/instances
@apiGroup service-workflow
@apiQuery {String} space_id 工作区ID
@apiQuery {String} flow_id 流程ID
@apiQuery {String} type 类型
@apiQuery {String} timezoneoffset 时区
@apiSuccessExample {xls} Success-Response:
    HTTP/1.1 200 OK
@apiErrorExample {json} Error-Response:
    HTTP/1.1 200 OK
    {
      errors: [{ errorMessage: e.message }]
    }
 */
router.get('/api/workflow/export/instances', auth.requireAuthentication, async function (req, res) {
    try {
        let userSession = req.user;
        const spaceId = userSession.spaceId;
        const userId = userSession.userId;
        const isSpaceAdmin = userSession.is_space_admin;
        Fiber(async function () {
            try {
                var ejs, end_date, fields, fileName, flow, flow_id, flow_ids, form, form_name, formatDate, ins_to_xls, lang, last_month_date, now, query, ret, selector, space, space_id, start_date, str, table_fields, template, timezoneoffset, type, uid, utcOffset;
                query = req.query;
                space_id = query.space_id;
                flow_id = query.flow_id;
                type = parseInt(query.type);
                timezoneoffset = parseInt(query.timezoneoffset);
                flow = db.flows.findOne({
                    _id: flow_id
                }, {
                    fields: {
                        form: 1
                    }
                });
                form = db.forms.findOne({
                    _id: flow.form
                }, {
                    fields: {
                        name: 1,
                        'current.fields': 1
                    }
                });
                form_name = form.name;
                fields = form.current.fields;
                table_fields = new Array;
                _.each(form.current.fields, function (field) {
                    if (field.type === "table") {
                        return table_fields.push(field);
                    }
                });
                ins_to_xls = new Array;
                start_date = null;
                end_date = null;
                now = new Date;
                selector = {
                    space: space_id,
                    flow: flow_id
                };
                selector.state = {
                    $in: ["pending", "completed"]
                };
                uid = userId;
                space = db.spaces.findOne(space_id);
                if (!space) {
                    selector.state = "none";
                }
                if (!space.admins.includes(uid)) {
                    flow_ids = WorkflowManager.getMyAdminOrMonitorFlows(space_id, uid);
                    if (!flow_ids.includes(selector.flow)) {
                        selector.$or = [
                            {
                                submitter: uid
                            },
                            {
                                applicant: uid
                            },
                            {
                                inbox_users: uid
                            },
                            {
                                outbox_users: uid
                            }
                        ];
                    }
                }
                // 0-本月
                if (type === 0) {
                    start_date = new Date(now.getFullYear(), now.getMonth(), 1);
                    selector.submit_date = {
                        $gte: start_date
                    };
                    ins_to_xls = db.instances.find(selector, {
                        sort: {
                            submit_date: 1
                        }
                    }).fetch();
                    // 1-上月
                } else if (type === 1) {
                    last_month_date = new Date(new Date(now.getFullYear(), now.getMonth(), 1) - 1000 * 60 * 60 * 24);
                    start_date = new Date(last_month_date.getFullYear(), last_month_date.getMonth(), 1);
                    end_date = new Date(now.getFullYear(), now.getMonth(), 1);
                    selector.submit_date = {
                        $gte: start_date,
                        $lte: end_date
                    };
                    ins_to_xls = db.instances.find(selector, {
                        sort: {
                            submit_date: 1
                        }
                    }).fetch();
                    // 2-整个年度
                } else if (type === 2) {
                    start_date = new Date(now.getFullYear(), 0, 1);
                    selector.submit_date = {
                        $gte: start_date
                    };
                    ins_to_xls = db.instances.find(selector, {
                        sort: {
                            submit_date: 1
                        }
                    }).fetch();
                    // 3-所有
                } else if (type === 3) {
                    ins_to_xls = db.instances.find(selector, {
                        sort: {
                            submit_date: 1
                        }
                    }).fetch();
                }
                ejs = require('ejs');
                str = fs.readFileSync(path.resolve(__dirname, '../server/ejs/export_instances.ejs'), 'utf8');
                // 检测是否有语法错误
                // ejsLint = require('ejs-lint')
                // if ejsLint.lint
                // 	error_obj = ejsLint.lint(str, {})
                // else
                // 	error_obj = ejsLint(str, {})
                // if error_obj
                // 	console.error "===/api/workflow/export:"
                // 	console.error error_obj
                template = ejs.compile(str);
                lang = 'en';
                if (userSession.locale === 'zh-cn') {
                    lang = 'zh-CN';
                }
                utcOffset = timezoneoffset / -60;
                formatDate = function (date, formater) {
                    return moment(date).utcOffset(utcOffset).format(formater);
                };
                ret = template({
                    lang: lang,
                    formatDate: formatDate,
                    form_name: form_name,
                    fields: fields,
                    table_fields: table_fields,
                    ins_to_xls: ins_to_xls
                });
                fileName = "SteedOSWorkflow_" + moment().format('YYYYMMDDHHmm') + ".xls";
                res.setHeader("Content-type", "application/octet-stream");
                res.setHeader("Content-Disposition", "attachment;filename=" + encodeURI(fileName));
                return res.end(ret);
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
