/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-24 14:32:08
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-24 14:51:58
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
@api {get} /api/workflow/open/pending 获取待办文件

@apiDescription 获取当前用户的待办事项列表

@apiName getInbox

@apiGroup service-workflow

@apiParam {String} access_token User API Token

@apiHeader {String} X-Space-Id	工作区Id

@apiHeaderExample {json} Header-Example:
    {
        "X-Space-Id": "wsw1re12TdeP223sC"
    }

@apiSuccessExample {json} Success-Response:
    {
        "status": "success",
        "data": [
            {
                "id": "g7wokXNkR9yxHvA4D",
                "start_date": "2017-11-23T02:28:53.164Z",
                "flow_name": "正文流程",
                "space_name": "审批王",
                "name": "正文流程 1",
                "applicant_name": null,
                "applicant_organization_name": "审批王",
                "submit_date": "2017-07-25T06:36:48.492Z",
                "step_name": "开始",
                "space_id": "kfDsMv7gBewmGXGEL",
                "modified": "2017-11-23T02:28:53.164Z",
                "is_read": false,
                "values": {}
            },
            {
                "id": "WqKSrWQoywgJaMp9k",
                "start_date": "2017-08-17T07:38:35.420Z",
                "flow_name": "正文\n",
                "space_name": "审批王",
                "name": "正文\n 1",
                "applicant_name": "殷亮辉",
                "applicant_organization_name": "审批王",
                "submit_date": "2017-06-27T10:26:19.468Z",
                "step_name": "开始",
                "space_id": "kfDsMv7gBewmGXGEL",
                "modified": "2017-08-17T07:38:35.421Z",
                "is_read": true,
                "values": {}
            }
        ]
    }
 */
router.get('/api/workflow/open/pending', auth.requireAuthentication, async function (req, res) {
    try {
        let userSession = req.user;
        const spaceId = userSession.spaceId;
        const userId = userSession.userId;
        const isSpaceAdmin = userSession.is_space_admin;
        var hashData = req.body;
        Fiber(async function () {
            try {
                var attach, e, is_read, limit, no_limit_count, query, ref, ref1, ref2, ref3, ref4, ref5, result_instances, space, space_id, space_names, special_user_id, start_date, u, uid, user_id, userid, username, workflow_categories;

                space_id = req.headers['x-space-id'] || ((ref = req.query) != null ? ref.spaceId : void 0);
                if (!space_id) {
                    throw new Meteor.Error('error', 'need space_id');
                }
                user_id = userId;
                if (!user_id) {
                    throw new Meteor.Error('error', 'Not logged in');
                }
                if (db.users.find({
                    _id: user_id
                }).count() === 0) {
                    throw new Meteor.Error('error', 'can not find user');
                }
                limit = ((ref1 = req.query) != null ? ref1.limit : void 0) || 500;
                limit = parseInt(limit);
                username = (ref2 = req.query) != null ? ref2.username : void 0;
                userid = (ref3 = req.query) != null ? ref3.userid : void 0;
                attach = (ref4 = req.query) != null ? ref4.attach : void 0;
                workflow_categories = (ref5 = req.query) != null ? ref5.workflow_categories : void 0;
                // 校验space是否存在
                space = uuflowManager.getSpace(space_id);
                // 如果当前用户是工作区管理员，则通过查看url上是否有username\userid ，
                // 如果有，则返回username\userid对应的用户，否则返回当前用户待办。
                // username\userid都存在时，userid优先
                special_user_id;
                if (space.admins.includes(user_id)) {
                    if (userid) {
                        if (db.users.find({
                            _id: userid
                        }).count() < 1) {
                            throw new Meteor.Error('error', `can not find user by userid: ${userid}`);
                        }
                        special_user_id = userid;
                    } else if (username) {
                        u = db.users.findOne({
                            username: username
                        }, {
                            fields: {
                                _id: 1
                            }
                        });
                        if (_.isEmpty(u)) {
                            throw new Meteor.Error('error', `can not find user by username: ${username}`);
                        }
                        special_user_id = u._id;
                    }
                }
                result_instances = new Array;
                is_read = false;
                start_date = '';
                uid = user_id;
                query = {
                    $or: [
                        {
                            inbox_users: user_id
                        },
                        {
                            cc_users: user_id
                        }
                    ]
                };
                if (special_user_id) {
                    uid = special_user_id;
                    query = {
                        space: space_id,
                        $or: [
                            {
                                inbox_users: special_user_id
                            },
                            {
                                cc_users: special_user_id
                            }
                        ]
                    };
                }
                if (workflow_categories) {
                    query.category = {
                        $in: workflow_categories.split(',')
                    };
                }
                space_names = {};
                space_names[space._id] = space.name;
                if (limit > 0) {
                    db.instances.find(query, {
                        sort: {
                            modified: -1
                        },
                        limit: limit
                    }).forEach(function (i) {
                        var h, ref6, ref7;
                        if ((ref6 = i.inbox_users) != null ? ref6.includes(uid) : void 0) {
                            _.each(i.traces, function (t) {
                                if (t.is_finished === false) {
                                    return _.each(t.approves, function (a) {
                                        if (a.user === uid && a.type !== 'cc' && !a.is_finished) {
                                            is_read = a.is_read;
                                            return start_date = a.start_date;
                                        }
                                    });
                                }
                            });
                        } else {
                            _.each(i.traces, function (t) {
                                if (!start_date && t.approves) {
                                    return _.each(t.approves, function (a) {
                                        if (!start_date && a.user === uid && a.type === 'cc' && !a.is_finished) {
                                            is_read = a.is_read;
                                            return start_date = a.start_date;
                                        }
                                    });
                                }
                            });
                        }
                        if (!space_names[i.space]) {
                            space_names[i.space] = (ref7 = db.spaces.findOne(i.space, {
                                fields: {
                                    name: 1
                                }
                            })) != null ? ref7.name : void 0;
                        }
                        h = new Object;
                        h["id"] = i["_id"];
                        h["start_date"] = start_date;
                        h["flow_name"] = i.flow_name;
                        h["space_name"] = space_names[i.space];
                        h["name"] = i["name"];
                        h["applicant_name"] = i["applicant_name"];
                        h["applicant_organization_name"] = i["applicant_organization_name"];
                        h["submit_date"] = i["submit_date"];
                        h["step_name"] = i.current_step_name;
                        h["space_id"] = i.space;
                        h["modified"] = i["modified"];
                        h["is_read"] = is_read;
                        h["values"] = i["values"];
                        if (attach === 'true') {
                            h.attachments = cfs.instances.find({
                                'metadata.instance': i._id,
                                'metadata.current': true,
                                "metadata.is_private": {
                                    $ne: true
                                }
                            }, {
                                fields: {
                                    copies: 0
                                }
                            }).fetch();
                        }
                        return result_instances.push(h);
                    });
                }
                no_limit_count = db.instances.find(query).count();

                res.status(200).send({
                    status: "success",
                    data: result_instances,
                    count: no_limit_count
                });
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
