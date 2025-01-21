'use strict';
// @ts-check
const express = require('express');
const router = express.Router();
const auth = require('@steedos/auth');
const objectql = require('@steedos/objectql');
/**
@api {post} /api/workflow/instance/:instanceId 查看审批单
@apiVersion 0.0.0
@apiName /api/workflow/instance/:instanceId
@apiGroup service-workflow
@apiQuery string instanceId 申请单ID
@apiSuccessExample {json} Success-Response:
    HTTP/1.1 302 OK
@apiErrorExample {json} Error-Response:
    HTTP/1.1 500 OK
    e.message
 */
router.get('/api/workflow/instance/:instanceId', auth.requireAuthentication, async function (req, res) {
    try {
        const userSession = req.user;
        const userId = userSession.userId;
        const insId = req.params.instanceId;
        const insObj = objectql.getObject('instances');
        const catObj = objectql.getObject('categories');
        const spaceObj = objectql.getObject('spaces');
        const insTaskObj = objectql.getObject('instance_tasks');
        const ins = await insObj.findOne(insId);
        if (ins) {
            let box = '';
            let appCode = 'approve_workflow'; // 默认值
            let objectName = 'instances';
            let docId = insId;
            const spaceId = ins.space;
            const flowId = ins.flow;
            const categoryId = ins.category;
            if (categoryId) {
                const catDoc = await catObj.findOne(categoryId);
                if (catDoc && catDoc.app) {
                    appCode = catDoc.app; // 查出需要跳转的应用
                }
            }
            if ((ins.inbox_users && ins.inbox_users.includes(userId)) || (ins.cc_users && ins.cc_users.includes(userId))) {
                box = 'inbox';
                objectName = 'instance_tasks'
                const insTaskDocs = await insTaskObj.find({
                    filters: [
                        ['instance', '=', insId],
                        ['handler', '=', userId],
                        ['is_finished', '!=', true]
                    ],
                    fields: ['_id']
                })
                docId = insTaskDocs[0]._id;
            } else if (ins.outbox_users && ins.outbox_users.includes(userId)) {
                const insTaskDocs = await insTaskObj.find({
                    filters: [
                        ['instance', '=', insId],
                        ['handler', '=', userId],
                        ['is_finished', '=', true],
                        ['is_latest_approve', '=', true]
                    ],
                    fields: ['_id']
                })
                if (!_.isEmpty(insTaskDocs)) {
                    box = 'outbox';
                    objectName = 'instance_tasks'
                    docId = insTaskDocs[0]._id;
                }
            } else if (ins.state === 'draft' && ins.submitter === userId) {
                box = 'draft';
            } else if (ins.state === 'pending' && (ins.submitter === userId || ins.applicant === userId)) {
                box = 'pending';
            } else if (ins.state === 'completed' && ins.submitter === userId) {
                box = 'completed';
            }

            if (!box) {
                // 验证login user_id对该流程有管理、观察申请单的权限
                const permissions = await new Promise((resolve, reject) => {
                    Fiber(function () {
                        try {
                            const permissions = permissionManager.getFlowPermissions(flowId, userId);
                            resolve(permissions);
                        } catch (error) {
                            reject(error);
                        }
                    }).run();
                });
                const space = await spaceObj.findOne(spaceId, {
                    fields: ['admins']
                });
                if (permissions.includes("admin") || permissions.includes("monitor") || space.admins.includes(userId)) {
                    box = 'monitor';
                }
            }
            let redirectPath = `app/${appCode}/${objectName}/view/${docId}?display=grid&side_object=${objectName}&side_listview_id=${box}`;
            // console.log('redirectPath', redirectPath);
            res.redirect(302, objectql.absoluteUrl(redirectPath));
        } else {
            throw new Error('未找到申请单，请确认。');
        }
    } catch (e) {
        console.error(e);
        res.status(500).send(e.message);
    }
});
exports.default = router;
