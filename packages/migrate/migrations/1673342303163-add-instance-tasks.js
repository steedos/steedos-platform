/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2023-01-10 17:18:23
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2023-05-17 10:42:47
 * @Description: 
 */
'use strict'

const client = require("../client");
const _ = require('lodash')

module.exports.up = async function (next) {
    await client.connect()
    const db = client.db()
    const instanceColl = db.collection('instances')
    const tasksColl = db.collection('instance_tasks')
    const formColl = db.collection('forms')
    // 若已有instance_tasks则不执行
    const tasksCount = await tasksColl.find({}).count()
    if (tasksCount > 0) {
        // console.log('[migration]', '库中已有instance_tasks，终止执行。')
        return;
    }
    console.log('[migration] add-instance-tasks is running...')
    await instanceColl.find({}).forEach(async function (insDoc) {
        var docs = [];
        var latestApproveIndexMap = {}
        const formDoc = await formColl.findOne({ _id: insDoc.form })
        const extras = caculateExtras(insDoc.values, formDoc, insDoc.form_version)
        insDoc.traces.forEach(function (tDoc, tIdx) {
            if (tIdx == 0 && (!insDoc.distribute_from_instance && !insDoc.forward_from_instance)) {
                // 只有分发或转发的申请单，开始节点生成instance_tasks
                return
            }
            if (tDoc.approves) {
                tDoc.approves.forEach(function (aDoc) {
                    if (aDoc.type == 'distribute' || aDoc.judge == 'relocated' || aDoc.judge == 'terminated' || aDoc.judge == 'reassigned') {
                        return;
                    }
                    aDoc['space'] = insDoc.space;
                    aDoc['instance_name'] = insDoc.name;
                    aDoc['submitter'] = insDoc.submitter;
                    aDoc['submitter_name'] = insDoc.submitter_name;
                    aDoc['applicant'] = insDoc.applicant;
                    aDoc['applicant_name'] = insDoc.applicant_name;
                    aDoc['applicant_organization_name'] = insDoc.applicant_organization_name;
                    aDoc['submit_date'] = insDoc.submit_date;
                    aDoc['flow'] = insDoc.flow;
                    aDoc['flow_name'] = insDoc.flow_name;
                    aDoc['form'] = insDoc.form;
                    aDoc['step'] = tDoc.step;
                    aDoc['step_name'] = tDoc.name;
                    aDoc['category_name'] = insDoc.category_name;
                    aDoc['instance_state'] = insDoc.state;
                    aDoc['distribute_from_instance'] = insDoc.distribute_from_instance;
                    aDoc['forward_from_instance'] = insDoc.forward_from_instance;
                    aDoc['keywords'] = insDoc.keywords;
                    aDoc['is_archived'] = insDoc.is_archived;
                    aDoc['category'] = insDoc.category;
                    aDoc['extras'] = extras;
                    docs.push(aDoc)
                    if (aDoc.is_finished) { //记录下需要设置is_latest_approve的游标，如有重复审批则更新为最新的
                        latestApproveIndexMap[aDoc.handler] = docs.length - 1
                    }
                })
            }
        })

        for (const handler in latestApproveIndexMap) {
            if (Object.hasOwnProperty.call(latestApproveIndexMap, handler)) {
                docs[latestApproveIndexMap[handler]].is_latest_approve = true
            }
        }

        if (docs.length > 0) {
            try {
                await tasksColl.insertMany(docs);
                if (extras) {
                    await instanceColl.updateOne({ _id: insDoc._id }, { $set: { extras: extras } })
                }
            } catch (e) {
                console.error(e);
            }
        }
    })
    const insCount = await instanceColl.find({}).count()
    const insTasksCount = await tasksColl.find({}).count()
    console.log('[migration] add-instance-tasks successfully ran.', 'instances:', insCount, ', instance_tasks:', insTasksCount)
}

module.exports.down = async function (next) {
    const tasksColl = db.collection('instance_tasks')
    await tasksColl.remove({})
}

// 计算出在表单字段中选择了列表显示的字段
function caculateExtras(values, formDoc, formVersionId) {
    if (_.isEmpty(values) || _.isEmpty(formDoc) || _.isEmpty(formVersionId)) {
        return
    }

    const extras = {}
    const formVersion = getFormVersion(formDoc, formVersionId)
    if (formVersion) {
        _.each(formVersion.fields, function (field) {
            if (field.is_list_display) {
                extras[field.code] = values[field.code]
            } else if (field.type === 'table') {
                // 表格
                if (values[field.code]) {
                    const tableExtras = []
                    _.each(values[field.code], function (s_value) {
                        const rowValues = {}
                        _.each(field.fields, function (s_field) {
                            if (s_field.is_list_display) {
                                rowValues[s_field.code] = s_value[s_field.code]
                            }
                        });
                        if (!_.isEmpty(rowValues)) {
                            tableExtras.push(rowValues)
                        }
                    });
                    if (!_.isEmpty(tableExtras)) {
                        extras[field.code] = tableExtras
                    }
                }
            } else if (field.type === 'section') {
                // 分组
                _.each(field.fields, function (s_field) {
                    if (s_field.is_list_display) {
                        extras[s_field.code] = values[s_field.code]
                    }
                });
            }
        });
    }


    if (_.isEmpty(extras)) {
        return
    }

    return extras
}

function getFormVersion(form, form_version) {
    var form_v = null;
    if (form_version === form.current._id) {
        form_v = form.current;
    } else {
        form_v = _.find(form.historys, function (form_h) {
            return form_version === form_h._id;
        });
    }
    return form_v;
};
