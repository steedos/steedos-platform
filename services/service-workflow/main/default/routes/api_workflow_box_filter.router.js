/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-02-10 13:49:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-02-20 13:48:52
 * @Description: 
 */
const express = require("express");
const router = express.Router();
const core = require('@steedos/core');
const objectql = require('@steedos/objectql');

router.get('/api/workflow/v2/:box/filter', core.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    const { userId, is_space_admin } = userSession;
    // TODO 按应用分类显示
    const { appId, flowId } = req.query;
    const { box } = req.params;
    const filter = [];
    switch (box) {
        case 'inbox':
            filter.push(['handler', '=', userId]);
            filter.push(['is_finished', '=', false]);
            // task中未结束的就是 待办 , 无需其他查询
            filter.push([
                ['instance_state', 'in', ["pending", "completed"]], 
                'or', 
                [['instance_state', '=', 'draft'], [
                    ['distribute_from_instance', '!=', null], 'or', ['forward_from_instance', '!=', null]
                ],]
            ]);
            break;
        case 'outbox':
            filter.push(['handler', '=', userId]);
			filter.push(['is_finished', '=', true]);
            filter.push(['is_latest_approve', '=', true]);
            break;
        case 'draft':
            filter.push(['submitter', '=', userId]);
			filter.push(['state', '=', 'draft']);
            //TODO 需要排除 分发、转发的申请单
            // filter.push(['inbox_users', '=', []]);
            break;
        case 'pending':
			filter.push(['state', '=', 'pending']);
            filter.push([['submitter', '=', userId], 'or', ['applicant', '=', userId]]);
            break;
        case 'completed':
			filter.push(['submitter', '=', userId]);
            filter.push(['state', '=', 'completed']);
            break;
        case 'monitor':
            filter.push(['state', 'in', ["pending", "completed"]]);
            if(!is_space_admin){
                const flowIds = WorkflowManager.getMyAdminOrMonitorFlows();
                if(!flowId){
                    if(!_.includes(flowIds, flowId)){
                        filter.push([
                            ['submitter', '=', userId], 'or', ['applicant', '=', userId], 'or', ['inbox_users', '=', userId], 'or', ['outbox_users', '=', userId]
                        ])
                    }
                }else{
                    filter.push([
                        ['submitter', '=', userId], 'or', ['applicant', '=', userId], 'or', ['inbox_users', '=', userId], 'or', ['outbox_users', '=', userId], 'or', ['flow', 'in', flowIds]
                    ])
                }
            }
            break;
        default:
            filter.push(['instance_state', '=', 'none']);
            break;
    }
    return res.send({
        filter
    })
})

exports.default = router;