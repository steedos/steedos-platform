/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-24 11:00:22
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-24 11:33:51
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
@api {post} /api/workflow/sub_table_sort 表格子表排序
@apiVersion 0.0.0
@apiName /api/workflow/sub_table_sort
@apiGroup service-workflow
@apiQuery {String} subTable subTable
@apiQuery {String} sumCol sumCol
@apiQuery {String} sortCol sortCol
@apiQuery {String} singleCols singleCols
@apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK
    {
        'Spaces': [],
    }
@apiErrorExample {json} Error-Response:
    HTTP/1.1 200 OK
    {
      errors: [{ errorMessage: e.message }]
    }
 */
router.post('/api/workflow/sub_table_sort', auth.requireAuthentication, async function (req, res) {
    try {
        Fiber(async function () {
            try {

                var ins, new_table_values, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, sort_col, sub_table, sub_table_values, sum_col;
                console.log("=========子表==========");
                console.log("req?.query?.subTable", req != null ? (ref = req.query) != null ? ref.subTable : void 0 : void 0);
                console.log("=========子表总分列==========");
                console.log("req?.query?.sumCol", req != null ? (ref1 = req.query) != null ? ref1.sumCol : void 0 : void 0);
                console.log("=========子表排序列==========");
                console.log("req?.query?.sortCol", req != null ? (ref2 = req.query) != null ? ref2.sortCol : void 0 : void 0);
                console.log("=========子表单列需要计算的和==========");
                console.log("req?.query?.singleCols", req != null ? (ref3 = req.query) != null ? ref3.singleCols : void 0 : void 0);
                sub_table = req != null ? (ref4 = req.query) != null ? ref4.subTable : void 0 : void 0;
                if (!sub_table) {
                    console.log("=====sub_table======");
                    throw new Error('table sort error!', 'webhook 未配置 subTable 字段');
                }
                sum_col = req != null ? (ref5 = req.query) != null ? ref5.sumCol : void 0 : void 0;
                if (!sum_col) {
                    console.log("=====sum_col======");
                    throw new Error('table sort error!', 'webhook 未配置 sumCol 字段');
                }
                sort_col = req != null ? (ref6 = req.query) != null ? ref6.sortCol : void 0 : void 0;
                if (!sort_col) {
                    console.log("=====sort_col======");
                    throw new Error('table sort error!', 'webhook 未配置 sortCol 字段');
                }
                ins = req != null ? (ref7 = req.body) != null ? ref7.instance : void 0 : void 0;
                sub_table_values = ins.values[sub_table];
                if ((sub_table_values != null ? sub_table_values.length : void 0) > 0) {
                    function JsonSort(jsonArr, key, asc) {
                        for (var j = 1, jl = jsonArr.length; j < jl; j++) {
                            var temp = jsonArr[j],
                                val = Number(temp[key]),
                                i = j - 1;
                            if (asc == true) {
                                while (i >= 0 && Number(jsonArr[i][key]) > val) {
                                    jsonArr[i + 1] = jsonArr[i];
                                    i = i - 1;
                                }
                            } else {
                                while (i >= 0 && Number(jsonArr[i][key]) < val) {
                                    jsonArr[i + 1] = jsonArr[i];
                                    i = i - 1;
                                }
                            }
                            jsonArr[i + 1] = temp;
                        }
                        return jsonArr;

                        // # 根据 sub_table_values 进行排序
                        // ======================
                        // 排序字段，关键字，正序(true)/倒序(false)
                    };
                    new_table_values = JsonSort(sub_table_values, sum_col, false);
                    console.log("new_table_values", new_table_values);
                    new_table_values.forEach(function (obj, index) {
                        if (sort_col && obj[sum_col]) {
                            return obj[sort_col] = (index + 1).toString();
                        }
                    });
                    console.log("new_table_values", new_table_values);
                    ins.values[sub_table] = new_table_values;
                    db.instances.update(ins._id, {
                        $set: {
                            'values': ins.values
                        }
                    });
                    console.log("success");

                    res.status(200).send({ 'success': '计算排序成功' });
                } else {
                    throw new Error('table sort error!', '子表数据为空');
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
            errors: [{ errorMessage: e.message }]
        });
    }
});
exports.default = router;
