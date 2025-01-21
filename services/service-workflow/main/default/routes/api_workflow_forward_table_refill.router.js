/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-24 13:32:54
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-24 13:43:18
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
@api {post} /api/workflow/forward_table_refill 子表重新回填
@apiVersion 0.0.0
@apiName /api/workflow/forward_table_refill
@apiGroup service-workflow
@apiBody {Object} instance 分发的申请单
@apiQuery {String} oTable 原表子表
@apiQuery {String} dTable 现表子表
@apiQuery {String} oMatchCol 原表单的子表匹配列
@apiQuery {String} dMatchCol 现表单的子表匹配列
@apiQuery {String} refillCol 需要回填的列
@apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK
    {
        'success': '回填成功',
    }
@apiErrorExample {json} Error-Response:
    HTTP/1.1 200 OK
    {
      errors: [e]
    }
 */
router.post('/api/workflow/forward_table_refill', auth.requireAuthentication, async function (req, res) {
    try {
        let userSession = req.user;
        const spaceId = userSession.spaceId;
        const userId = userSession.userId;
        const isSpaceAdmin = userSession.is_space_admin;
        var hashData = req.body;
        Fiber(async function () {
            try {
                var a_table, a_table_values, approve, column_list, columns, d_ins, d_ins_fields, d_ins_form, d_ins_values, d_match_col, d_match_col_field, d_match_col_fields, d_subtable_fields, d_table, d_table_values, e, o_ins, o_ins_fields, o_ins_form, o_ins_id, o_match_col, o_match_col_field, o_match_col_fields, o_subtable_fields, o_table, ref, ref1, ref10, ref11, ref12, ref13, ref14, ref15, ref16, ref17, ref18, ref19, ref2, ref20, ref21, ref22, ref3, ref4, ref5, ref6, ref7, ref8, ref9, table_data, trace, traces;
                console.log("=========原表子表==========");
                console.log("req?.query?.oTable", req != null ? (ref = req.query) != null ? ref.oTable : void 0 : void 0);
                console.log("=========现表子表==========");
                console.log("req?.query?.dTable", req != null ? (ref1 = req.query) != null ? ref1.dTable : void 0 : void 0);
                console.log("=========原表单的子表匹配列==========");
                console.log("req?.query?.oMatchCol", req != null ? (ref2 = req.query) != null ? ref2.oMatchCol : void 0 : void 0);
                console.log("=========现表单的子表匹配列==========");
                console.log("req?.query?.dMatchCol", req != null ? (ref3 = req.query) != null ? ref3.dMatchCol : void 0 : void 0);
                console.log("=========需要回填的列==========");
                console.log("req?.query?.refillCol", req != null ? (ref4 = req.query) != null ? ref4.refillCol : void 0 : void 0);
                // 分发的申请单
                d_ins = req != null ? (ref5 = req.body) != null ? ref5.instance : void 0 : void 0;
                if ((d_ins != null ? d_ins.state : void 0) === "completed") {
                    if (req != null ? (ref6 = req.query) != null ? ref6.oTable : void 0 : void 0) {
                        o_table = req != null ? (ref7 = req.query) != null ? ref7.oTable : void 0 : void 0;
                        if (req != null ? (ref8 = req.query) != null ? ref8.dTable : void 0 : void 0) {
                            d_table = req != null ? (ref9 = req.query) != null ? ref9.dTable : void 0 : void 0;
                        } else {
                            d_table = o_table;
                        }
                        if (req != null ? (ref10 = req.query) != null ? ref10.aTable : void 0 : void 0) {
                            a_table = req != null ? (ref11 = req.query) != null ? ref11.aTable : void 0 : void 0;
                        }
                        if (req != null ? (ref12 = req.query) != null ? ref12.oMatchCol : void 0 : void 0) {
                            o_match_col = req != null ? (ref13 = req.query) != null ? ref13.oMatchCol : void 0 : void 0;
                            if (req != null ? (ref14 = req.query) != null ? ref14.dMatchCol : void 0 : void 0) {
                                d_match_col = req != null ? (ref15 = req.query) != null ? ref15.dMatchCol : void 0 : void 0;
                            } else {
                                d_match_col = o_match_col;
                            }
                            columns = (req != null ? (ref16 = req.query) != null ? ref16.refillCol.split(';') : void 0 : void 0) || [];
                            console.log("columns", columns);
                            if (columns || columns.length < 1) {
                                console.log("======================");
                                console.log(d_table, o_match_col, columns);
                                // 分发回来的值
                                d_ins_values = d_ins != null ? d_ins.values : void 0;
                                // 原申请单 form 表字段
                                o_ins_id = _.last(d_ins != null ? d_ins.distribute_from_instances : void 0);
                                o_ins = db.instances.findOne(o_ins_id);
                                o_ins_form = db.forms.findOne(o_ins != null ? o_ins.form : void 0);
                                d_ins_form = db.forms.findOne(d_ins != null ? d_ins.form : void 0);
                                // 原申请单的 fields
                                o_ins_fields = [];
                                // 原子表字段
                                o_subtable_fields = [];
                                // 分发申请单的 fields
                                d_ins_fields = [];
                                // 现申请单字表字段
                                d_subtable_fields = [];
                                // 赋值对应的字段
                                column_list = [];

                                // 分发后申请单的 子表值
                                d_table_values = [];
                                // 查看原申请单是否有对应的子表
                                if ((o_ins != null ? o_ins.form_version : void 0) === (o_ins_form != null ? (ref17 = o_ins_form.current) != null ? ref17._id : void 0 : void 0)) {
                                    o_ins_fields = o_ins_form != null ? (ref18 = o_ins_form.current) != null ? ref18.fields : void 0 : void 0;
                                    o_ins_fields.forEach(function (o_ins_field) {
                                        if ((o_ins_field != null ? o_ins_field.type : void 0) === 'table' && (o_ins_field != null ? o_ins_field.code : void 0) === o_table) {
                                            return o_subtable_fields = o_ins_field != null ? o_ins_field.fields : void 0;
                                        }
                                    });
                                } else {
                                    if ((o_ins_form != null ? (ref19 = o_ins_form.historys) != null ? ref19.length : void 0 : void 0) > 0) {
                                        o_ins_form.historys.forEach(function (oh) {
                                            if ((o_ins != null ? o_ins.form_version : void 0) === oh._id) {
                                                o_ins_fields = oh != null ? oh.fields : void 0;
                                                return o_ins_fields.forEach(function (o_ins_field) {
                                                    if ((o_ins_field != null ? o_ins_field.type : void 0) === 'table' && (o_ins_field != null ? o_ins_field.code : void 0) === o_table) {
                                                        return o_subtable_fields = o_ins_field != null ? o_ins_field.fields : void 0;
                                                    }
                                                });
                                            }
                                        });
                                    }
                                }

                                // 查看分发的申请单是否有对应的字表
                                if ((d_ins != null ? d_ins.form_version : void 0) === (d_ins_form != null ? (ref20 = d_ins_form.current) != null ? ref20._id : void 0 : void 0)) {
                                    d_ins_fields = d_ins_form != null ? (ref21 = d_ins_form.current) != null ? ref21.fields : void 0 : void 0;
                                    d_ins_fields.forEach(function (d_ins_field) {
                                        if (((d_ins_field != null ? d_ins_field.type : void 0) === 'table' && (d_ins_field != null ? d_ins_field.code : void 0) === d_table) || (a_table && (d_ins_field != null ? d_ins_field.type : void 0) === 'table' && (d_ins_field != null ? d_ins_field.code : void 0) === a_table)) {
                                            return d_subtable_fields = d_subtable_fields.concat(d_ins_field != null ? d_ins_field.fields : void 0);
                                        }
                                    });
                                } else {
                                    if ((d_ins_form != null ? (ref22 = d_ins_form.historys) != null ? ref22.length : void 0 : void 0) > 0) {
                                        d_ins_form.historys.forEach(function (dh) {
                                            if ((d_ins != null ? d_ins.form_version : void 0) === dh._id) {
                                                d_ins_fields = dh != null ? dh.fields : void 0;
                                                return d_ins_fields.forEach(function (d_ins_field) {
                                                    if (((d_ins_field != null ? d_ins_field.type : void 0) === 'table' && (d_ins_field != null ? d_ins_field.code : void 0) === d_table) || (a_table && (d_ins_field != null ? d_ins_field.type : void 0) === 'table' && (d_ins_field != null ? d_ins_field.code : void 0) === a_table)) {
                                                        return d_subtable_fields = d_subtable_fields.concat(d_ins_field != null ? d_ins_field.fields : void 0);
                                                    }
                                                });
                                            }
                                        });
                                    }
                                }
                                if (o_subtable_fields.length === 0) {
                                    console.log("o_subtable_fields", o_subtable_fields);
                                    throw new Error('forward table refill error!', '原申请单无对应子表');
                                }
                                if (d_subtable_fields.length === 0) {
                                    throw new Error('forward table refill error!', '分发的申请单无对应子表');
                                }
                                d_table_values = (d_ins != null ? d_ins.values[d_table] : void 0) || [];
                                if (a_table) {
                                    a_table_values = (d_ins != null ? d_ins.values[a_table] : void 0) || [];
                                    if (a_table_values && (a_table_values != null ? a_table_values.length : void 0) === (d_table_values != null ? d_table_values.length : void 0)) {
                                        a_table_values.forEach(function (a_row, index) {
                                            var key, results, value;
                                            results = [];
                                            for (key in a_row) {
                                                value = a_row[key];
                                                results.push(d_table_values[index][key] = value);
                                            }
                                            return results;
                                        });
                                    }
                                }
                                if (d_table_values.length === 0) {
                                    throw new Error('forward table refill error!', '分发的申请单子表数据为空');
                                }
                                o_match_col_fields = o_subtable_fields.filter(function (m) {
                                    return m.code === o_match_col;
                                });
                                d_match_col_fields = d_subtable_fields.filter(function (m) {
                                    return m.code === d_match_col;
                                });
                                // 匹配列判断
                                if (o_match_col_fields.length === 0) {
                                    throw new Error('forward table refill error!', '原申请单子表无对应匹配列');
                                }
                                if (d_match_col_fields.length === 0) {
                                    throw new Error('forward table refill error!', '分发的申请单子表无对应匹配列');
                                }
                                o_match_col_field = o_match_col_fields[0];
                                d_match_col_field = d_match_col_fields[0];
                                if ((o_match_col_field != null ? o_match_col_field.type : void 0) !== (d_match_col_field != null ? d_match_col_field.type : void 0)) {
                                    throw new Error('forward table refill error!', '分发的申请单和原申请单子表的匹配列字段不一致');
                                }
                                columns.forEach(function (column) {
                                    var col, cols, d_col, d_col_fields, o_col, o_col_fields;
                                    cols = column.split('-') || [];
                                    if (cols.length === 2) {
                                        o_col = cols[0];
                                        d_col = cols[1];
                                        o_col_fields = o_subtable_fields.filter(function (m) {
                                            return m.code === o_col;
                                        });
                                        d_col_fields = d_subtable_fields.filter(function (m) {
                                            return m.code === d_col;
                                        });
                                        // 判断是否有对应的回填列
                                        if (o_col_fields.length === 0) {
                                            throw new Error('forward table refill error!', '原申请单子表无对应回填列');
                                        }
                                        if (d_col_fields.length === 0) {
                                            throw new Error('forward table refill error!', '分发的申请单子表无对应回填列');
                                        }
                                        if ((o_col_fields != null ? o_col_fields.type : void 0) !== (d_col_fields != null ? d_col_fields.type : void 0)) {
                                            throw new Error('forward table refill error!', '回填列字段类型不一致');
                                        }
                                        col = {
                                            o_col: o_col,
                                            d_col: d_col
                                        };
                                        return column_list.push(col);
                                    } else {
                                        throw new Error('forward table refill error!', '回填列不匹配');
                                    }
                                });
                                traces = o_ins != null ? o_ins.traces : void 0;
                                // 原申请单的 step 
                                trace = traces[traces.length - 1];
                                // 原申请单的当前步骤
                                approve = trace != null ? trace.approves[0] : void 0;
                                // 元申请单的当前 value 的 子表
                                table_data = (approve != null ? approve.values[o_table] : void 0) || [];
                                // 根据 column_list 赋值对应字段进行赋值
                                // 循环分发申请单的每行
                                d_table_values.forEach(function (d_row) {
                                    var count, has_obj, row_data;
                                    // console.log "d_row",d_row
                                    // 查找匹配的列是否与当前的匹配列一致
                                    has_obj = false;
                                    count = -1;

                                    // 看原子表是否有该匹配列
                                    table_data.forEach(function (o_row, index) {
                                        // console.log "o_row", o_row
                                        // console.log "index",index
                                        // console.log "o_row[o_match_col]",o_row[o_match_col]
                                        // console.log "d_row[d_match_col]",d_row[d_match_col]
                                        // console.log "o_row[o_match_col] == d_row[d_match_col]",o_row[o_match_col] == d_row[d_match_col]
                                        if (o_row[o_match_col] === d_row[d_match_col]) {
                                            has_obj = true;
                                            return count = index;
                                        }
                                    });
                                    // 原申请单的匹配字段有值
                                    // console.log "has_obj",has_obj
                                    if (has_obj === true) {
                                        return column_list.forEach(function (col) {
                                            return table_data[count][col != null ? col.o_col : void 0] = d_row[col != null ? col.d_col : void 0];
                                        });
                                    } else {
                                        row_data = {};
                                        row_data[o_match_col] = d_row[d_match_col];
                                        column_list.forEach(function (col) {
                                            return row_data[col != null ? col.o_col : void 0] = d_row[col != null ? col.d_col : void 0];
                                        });
                                        return table_data.push(row_data);
                                    }
                                });
                                traces[traces.length - 1].approves[0].values = o_ins != null ? o_ins.values : void 0;
                                traces[traces.length - 1].approves[0].values[o_table] = table_data;
                                db.instances.update(o_ins_id, {
                                    $set: {
                                        'traces': traces
                                    }
                                });
                                res.status(200).send({ 'success': '回填成功' });
                            } else {
                                throw new Error('forward table refill error!', 'webhook未配置子表回填列字段 columns 值');
                            }
                        } else {
                            throw new Error('forward table refill error!', 'webhook未配置匹配列字段 oMatchCol 值');
                        }
                    } else {
                        throw new Error('forward table refill error!', 'webhook未配置原表单子表 oTable 值');
                    }
                } else {
                    throw new Error('forward table refill error!', '申请单未结束');
                }
            } catch (e) {
                console.error(e);
                res.status(200).send({
                    errors: [e]
                });
            }
        }).run()
    } catch (e) {
        res.status(200).send({
            errors: [e]
        });
    }
});
exports.default = router;
