/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-28 10:36:06
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-28 13:30:54
 * @Description: 
 */
'use strict';
// @ts-check
const _ = require('lodash')

// 新增instance_tasks记录
function insert_instance_tasks(insId, traceId, approveId) {
    const taskDoc = _makeTaskDoc(insId, traceId, approveId)
    const insTaskId = db.instance_tasks.insert(taskDoc)
    return insTaskId
}

// 更新instance_tasks记录
function update_instance_tasks(insId, traceId, approveId) {
    const taskDoc = _makeTaskDoc(insId, traceId, approveId)
    delete taskDoc._id
    const result = db.instance_tasks.update({ _id: approveId }, {
        $set: taskDoc
    })
    return result
}

// 删除instance_tasks记录
function remove_instance_tasks(approveId) {
    const result = db.instance_tasks.remove({ _id: approveId })
    return result
}

// 使用instance、trace、approve整理成instnce_tasks结构
function _makeTaskDoc(insId, traceId, approveId) {
    const insDoc = db.instances.findOne(insId)
    const traceDoc = _.find(insDoc.traces, function (t) {
        return t._id === traceId
    })
    const approveDoc = _.find(traceDoc.approves, function (a) {
        return a._id === approveId
    })
    return {
        ...approveDoc,
        'space': insDoc.space,
        'instance_name': insDoc.name,
        'submitter': insDoc.submitter,
        'submitter_name': insDoc.submitter_name,
        'applicant': insDoc.applicant,
        'applicant_name': insDoc.applicant_name,
        'submit_date': insDoc.submit_date,
        'flow': insDoc.flow,
        'flow_name': insDoc.flow_name,
        'form': insDoc.form,
        'step': traceDoc.step,
        'step_name': traceDoc.name,
        'category_name': insDoc.category_nam,
        'instance_state': insDoc.state,
    }
}

module.exports = {
    insert_instance_tasks,
    update_instance_tasks,
    remove_instance_tasks
}