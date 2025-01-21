/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-24 13:25:04
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-24 13:30:32
 * @Description: 
 */
'use strict';
// @ts-check
const express = require('express');
const router = express.Router();
const auth = require('@steedos/auth');
const _ = require('lodash');
const Fiber = require('fibers');
/**
@api {post} /api/workflow/forward_refill 转发数据回填
@apiVersion 0.0.0
@apiName /api/workflow/forward_refill
@apiGroup service-workflow
@apiBody {Object} instance 申请单信息
@apiQuery {String} subTable 回填子表
@apiQuery {String} column 分发回填的列
@apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK
    {
        'success': '回填成功'
    }
@apiErrorExample {json} Error-Response:
    HTTP/1.1 200 OK
    {
      error: ''
    }
 */
router.post('/api/workflow/forward_refill', auth.requireAuthentication, async function (req, res) {
    try {
        let userSession = req.user;
        const spaceId = userSession.spaceId;
        const userId = userSession.userId;
        const isSpaceAdmin = userSession.is_space_admin;
        Fiber(async function () {
            try {
                var approve, columns, forward_ins, forward_ins_values, original_ins, original_ins_fields, original_ins_form, original_ins_id, original_subtable_fields, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, row_data, subTable, table_data, trace, traces;
                console.log("=========回填子表==========");
                console.log("req?.query?.subTable", req != null ? (ref = req.query) != null ? ref.subTable : void 0 : void 0);
                console.log("=========分发回填的列==========");
                console.log("req?.query?.column", req != null ? (ref1 = req.query) != null ? ref1.column : void 0 : void 0);
                columns = req != null ? (ref2 = req.query) != null ? ref2.column.split(';') : void 0 : void 0;
                console.log("columns", columns);
                // 分发的申请单
                forward_ins = req != null ? (ref3 = req.body) != null ? ref3.instance : void 0 : void 0;
                subTable = req != null ? (ref4 = req.query) != null ? ref4.subTable : void 0 : void 0;
                if ((forward_ins != null ? forward_ins.state : void 0) === "completed" && (forward_ins != null ? (ref5 = forward_ins.distribute_from_instances) != null ? ref5.length : void 0 : void 0) > 0 && subTable && columns) {

                    // 分发回来的值
                    forward_ins_values = forward_ins != null ? forward_ins.values : void 0;
                    // # 原申请单字段
                    original_ins_id = _.last(forward_ins != null ? forward_ins.distribute_from_instances : void 0);
                    original_ins = db.instances.findOne(original_ins_id);
                    original_ins_form = db.forms.findOne(original_ins != null ? original_ins.form : void 0);
                    original_ins_fields = [];
                    original_subtable_fields = [];
                    console.log("original_ins_form?.current?._id", original_ins_form != null ? (ref6 = original_ins_form.current) != null ? ref6._id : void 0 : void 0);
                    console.log("original_ins?.form_version", original_ins != null ? original_ins.form_version : void 0);
                    // 查看原申请单是否有对应的子表
                    if ((original_ins != null ? original_ins.form_version : void 0) === (original_ins_form != null ? (ref7 = original_ins_form.current) != null ? ref7._id : void 0 : void 0)) {
                        original_ins_fields = (ref8 = original_ins_form.current) != null ? ref8.fields : void 0;
                        original_ins_fields.forEach(function (original_ins_field) {
                            console.log("original_ins_field", original_ins_field != null ? original_ins_field.code : void 0);
                            if ((original_ins_field != null ? original_ins_field.code : void 0) === subTable && (original_ins_field != null ? original_ins_field.type : void 0) === 'table') {
                                return original_subtable_fields = original_ins_field != null ? original_ins_field.fields : void 0;
                            }
                        });
                    } else {
                        if ((original_ins_form != null ? (ref9 = original_ins_form.historys) != null ? ref9.length : void 0 : void 0) > 0) {
                            original_ins_form.historys.forEach(function (oh) {
                                if ((original_ins != null ? original_ins.form_version : void 0) === oh._id) {
                                    original_ins_fields = oh != null ? oh.fields : void 0;
                                    return original_ins_fields.forEach(function (original_ins_field) {
                                        if ((original_ins_field != null ? original_ins_field.code : void 0) === subTable && (original_ins_field != null ? original_ins_field.type : void 0) === 'table') {
                                            return original_subtable_fields = original_ins_field != null ? original_ins_field.fields : void 0;
                                        }
                                    });
                                }
                            });
                        }
                    }
                    console.log("original_subtable_fields", original_subtable_fields != null ? original_subtable_fields.length : void 0);
                    if (original_subtable_fields) {
                        // # 更新步骤的值
                        // 1.找到当前的步骤
                        // 2.当前步骤中approves中的values
                        // 3.在values中找到表格
                        // 4.根据表格的fields属性，一个个的赋值
                        // 5.把复制的push到表格数组的后面
                        traces = original_ins != null ? original_ins.traces : void 0;
                        trace = traces[traces.length - 1];
                        approve = trace != null ? trace.approves[0] : void 0;
                        table_data = (approve != null ? approve.values[subTable] : void 0) || [];
                        row_data = {};
                        columns.forEach(function (column) {
                            return row_data[column] = forward_ins_values[column] || "";
                        });
                        if (row_data && row_data !== {}) {
                            table_data.push(row_data);
                            traces[traces.length - 1].approves[0].values[subTable] = table_data;
                            console.log(traces[traces.length - 1].approves[0].values[subTable]);
                            db.instances.update(original_ins_id, {
                                $set: {
                                    'traces': traces
                                }
                            });
                            return res.status(200).send({ 'success': '回填成功' });
                        } else {
                            return res.status(200).send({ 'info': '回填数据为空' });
                        }
                    } else {
                        return res.status(200).send({ 'error': '原申请单无相关子表' });
                    }
                } else {
                    return res.status(200).send({ 'success': '申请单未结束' });
                }


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
