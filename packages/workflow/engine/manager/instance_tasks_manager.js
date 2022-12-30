/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-28 10:36:06
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-30 17:36:06
 * @Description: 
 */
'use strict';
// @ts-check
const _ = require('lodash')

/**
 * 新增instance_tasks记录
 * @param {String} insId 申请单ID
 * @param {String} traceId TraceID
 * @param {String} approveId ApproveID
 * @returns 新增的instance_tasks的ID
 */
function insert_instance_tasks(insId, traceId, approveId) {
    const taskDoc = _makeTaskDoc(insId, traceId, approveId)
    const insTaskId = db.instance_tasks.insert(taskDoc)
    return insTaskId
}

/**
 * 批量新增instance_tasks记录
 * @param {String} insId 申请单ID
 * @param {String} traceId TraceID
 * @param {String[]} approveIds ApproveID集合
 * @returns 新增的instance_tasks的ID集合
 */
function insert_many_instance_tasks(insId, traceId, approveIds) {
    const insDoc = _getInsDoc(insId)
    const traceDoc = _getTraceDoc(insDoc, traceId)
    const newIDs = []
    for (const aId of approveIds) {
        const approveDoc = _getApproveDoc(traceDoc, aId)
        const taskDoc = _generateTaskDoc(insDoc, traceDoc, approveDoc)
        const insTaskId = db.instance_tasks.insert(taskDoc)
        newIDs.push(insTaskId)
    }
    return newIDs
}

/**
 * 更新instance_tasks记录
 * @param {String} insId 申请单ID
 * @param {String} traceId TraceID
 * @param {String} approveId ApproveID
 * @returns 更新结果
 */
function update_instance_tasks(insId, traceId, approveId) {
    const taskDoc = _makeTaskDoc(insId, traceId, approveId)
    delete taskDoc._id
    const result = db.instance_tasks.update({ _id: approveId }, {
        $set: taskDoc
    })
    console.log('update_instance_tasks:', result)
    return result
}

/**
 * 批量更新instance_tasks记录
 * @param {String} insId 
 * @param {String} traceId 
 * @param {String[]} approveIds 
 * @returns 更新结果
 */
function update_many_instance_tasks(insId, traceId, approveIds) {
    const insDoc = _getInsDoc(insId)
    const traceDoc = _getTraceDoc(insDoc, traceId)
    const results = []
    for (const aId of approveIds) {
        const approveDoc = _getApproveDoc(traceDoc, aId)
        const taskDoc = _generateTaskDoc(insDoc, traceDoc, approveDoc)
        delete taskDoc._id
        const result = db.instance_tasks.update({ _id: aId }, {
            $set: taskDoc
        })
        results.push(result)
    }
    return results
}

/**
 * 删除instance_tasks记录
 * @param {String} approveId 
 * @returns 
 */
function remove_instance_tasks(approveId) {
    const result = db.instance_tasks.remove({ _id: approveId })
    console.log('remove_instance_tasks:', result)
    return result
}

/**
 * 删除instance相关的所有instance_tasks记录
 * @param {String} insId 申请单ID 
 * @returns 
 */
function remove_instance_tasks_by_instance_id(insId) {
    const result = db.instance_tasks.remove({
        instance: insId
    })
    console.log('remove_instance_tasks_by_instance_id:', result)
    return result
}

/**
 * 使用insId、traceId、approveId整理成instnce_tasks结构
 * @param {String} insId 申请单ID
 * @param {String} traceId TraceID
 * @param {String} approveId ApproveID
 * @returns instance_tasks文档
 */
function _makeTaskDoc(insId, traceId, approveId) {
    const insDoc = _getInsDoc(insId)
    const traceDoc = _getTraceDoc(insDoc, traceId)
    const approveDoc = _getApproveDoc(traceDoc, approveId)
    return _generateTaskDoc(insDoc, traceDoc, approveDoc)
}

/**
 * 使用instance、trace、approve整理成instnce_tasks结构
 * @param {Object} insDoc 申请单文档
 * @param {Object} traceDoc Trace文档
 * @param {Object} approveDoc Approve文档
 * @returns instance_tasks文档
 */
function _generateTaskDoc(insDoc, traceDoc, approveDoc) {
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

/**
 * 查找申请单文档
 * @param {String} insId 申请单ID
 * @returns 申请单文档
 */
function _getInsDoc(insId) {
    return db.instances.findOne(insId)
}

/**
 * 查找Trace
 * @param {Object} insDoc 申请单文档
 * @param {String} traceId TraceID
 * @returns Trace文档
 */
function _getTraceDoc(insDoc, traceId) {
    return _.find(insDoc.traces, function (t) {
        return t._id === traceId
    })
}

/**
 * 查找Approve
 * @param {Object} traceDoc Trace文档
 * @param {String} approveId ApproveID
 * @returns Approve文档
 */
function _getApproveDoc(traceDoc, approveId) {
    return _.find(traceDoc.approves, function (a) {
        return a._id === approveId
    })
}

module.exports = {
    insert_instance_tasks,
    insert_many_instance_tasks,
    update_instance_tasks,
    update_many_instance_tasks,
    remove_instance_tasks,
    remove_instance_tasks_by_instance_id
}