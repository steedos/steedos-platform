/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-28 10:36:06
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2023-05-16 09:13:00
 * @Description: 
 */
'use strict';
// @ts-check
const _ = require('lodash')
const { getObject } = require('@steedos/objectql')

function _insert(taskDoc) {
    const newTaskDoc = Meteor.wrapAsync(function (taskDoc, cb) {
        getObject('instance_tasks').insert(taskDoc).then(function (resolve, reject) {
            cb(reject, resolve);
        });
    })(taskDoc);
    return newTaskDoc
}

function _directInsert(taskDoc) {
    const newTaskDoc = Meteor.wrapAsync(function (taskDoc, cb) {
        getObject('instance_tasks').directInsert(taskDoc).then(function (resolve, reject) {
            cb(reject, resolve);
        });
    })(taskDoc);
    return newTaskDoc
}

function _update(_id, taskDoc) {
    const latestTaskDoc = Meteor.wrapAsync(function (_id, taskDoc, cb) {
        getObject('instance_tasks').update(_id, taskDoc).then(function (resolve, reject) {
            cb(reject, resolve);
        });
    })(_id, taskDoc);
    return latestTaskDoc
}

function _remove(_id) {
    const result = Meteor.wrapAsync(function (_id, cb) {
        getObject('instance_tasks').delete(_id).then(function (resolve, reject) {
            cb(reject, resolve);
        });
    })(_id);
    return result
}

function _find(query) {
    const taskDocs = Meteor.wrapAsync(function (query, cb) {
        getObject('instance_tasks').find(query).then(function (resolve, reject) {
            cb(reject, resolve);
        });
    })(query);
    return taskDocs
}

/**
 * 新增instance_tasks记录
 * @param {String} insId 申请单ID
 * @param {String} traceId TraceID
 * @param {String} approveId ApproveID
 * @returns 新增的instance_tasks
 */
function insert_instance_tasks(insId, traceId, approveId) {
    const taskDoc = _makeTaskDoc(insId, traceId, approveId)
    const newTaskDoc = _directInsert(taskDoc)
    return newTaskDoc
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
    const newDocs = []
    for (const aId of approveIds) {
        const approveDoc = _getApproveDoc(traceDoc, aId)
        const taskDoc = _generateTaskDoc(insDoc, traceDoc, approveDoc)
        const newTaskDoc = _insert(taskDoc)
        newDocs.push(newTaskDoc)
    }
    return newDocs
}

/**
 * 更新instance_tasks记录
 * @param {String} insId 申请单ID
 * @param {String} traceId TraceID
 * @param {String} approveId ApproveID
 * @returns 更新后的instance_tasks
 */
function update_instance_tasks(insId, traceId, approveId) {
    const taskDoc = _makeTaskDoc(insId, traceId, approveId)
    delete taskDoc._id
    const result = _update(approveId, taskDoc)
    return result
}

/**
 * 批量更新instance_tasks记录
 * @param {String} insId 
 * @param {String} traceId 
 * @param {String[]} approveIds 
 * @returns 更新后的instance_tasks
 */
function update_many_instance_tasks(insId, traceId, approveIds) {
    const insDoc = _getInsDoc(insId)
    const traceDoc = _getTraceDoc(insDoc, traceId)
    const results = []
    for (const aId of approveIds) {
        const approveDoc = _getApproveDoc(traceDoc, aId)
        const taskDoc = _generateTaskDoc(insDoc, traceDoc, approveDoc)
        delete taskDoc._id
        const result = _update(aId, taskDoc)
        results.push(result)
    }
    return results
}

/**
 * 删除instance_tasks记录
 * @param {String} approveId 
 * @returns 1
 */
function remove_instance_tasks(approveId) {
    const result = _remove(approveId)
    return result
}

/**
 * 删除instance_tasks记录
 * @param {String[]} approveIds
 * @returns 1
 */
function remove_many_instance_tasks(approveIds) {
    const results = []
    for (const aId of approveIds) {
        const r = _remove(aId)
        results.push(r)
    }
    return results
}

/**
 * 删除instance相关的所有instance_tasks记录
 * @param {String} insId 申请单ID 
 * @returns 1
 */
function remove_instance_tasks_by_instance_id(insId) {
    const results = []
    const taskDocs = _find({
        filters: [
            ['instance', '=', insId]
        ],
        fields: ['_id']
    })
    for (const t of taskDocs) {
        const r = _remove(t._id)
        results.push(r)
    }
    return results
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
        'applicant_organization_name': insDoc.applicant_organization_name,
        'submit_date': insDoc.submit_date,
        'flow': insDoc.flow,
        'flow_name': insDoc.flow_name,
        'form': insDoc.form,
        'step': traceDoc.step,
        'step_name': traceDoc.name,
        'category_name': insDoc.category_name,
        'instance_state': insDoc.state,
        'distribute_from_instance': insDoc.distribute_from_instance,
        'forward_from_instance': insDoc.forward_from_instance,
        'keywords': insDoc.keywords,
        'is_archived': insDoc.is_archived,
        'category': insDoc.category,
        'extras': insDoc.extras,
    }
}

/**
 * 查找申请单文档
 * @param {String} insId 申请单ID
 * @returns 申请单文档
 */
function _getInsDoc(insId) {
    const insDoc = Meteor.wrapAsync(function (insId, cb) {
        getObject('instances').findOne(insId).then(function (resolve, reject) {
            cb(reject, resolve)
        })
    })(insId)
    return insDoc
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
    remove_many_instance_tasks,
    remove_instance_tasks_by_instance_id
}