/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-24 15:34:26
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-24 15:38:40
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
@api {post} /api/workflow/init_formula_values 初始化公式计算所需数据
@apiVersion 0.0.0
@apiName /api/workflow/init_formula_values
@apiGroup service-workflow
@apiBody {Object[]} fields fields
@apiBody {Object} autoFormDoc autoFormDoc
@apiBody {String} approver approver
@apiBody {String} applicant applicant
@apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK
    {
        'formula_values': {},
    }
@apiErrorExample {json} Error-Response:
    HTTP/1.1 200 OK
    {
      errors: [{ errorMessage: e.message }]
    }
 */
router.post('/api/workflow/init_formula_values', auth.requireAuthentication, async function (req, res) {
    try {
        Fiber(async function () {
            try {
                var
                    fields = req.body.fields,
                    autoFormDoc = req.body.autoFormDoc,
                    approver = req.body.approver,
                    applicant = req.body.applicant,

                    spaceId = req.query.spaceId,

                    spaceUsers = [];

                if (!fields || !spaceId || !autoFormDoc || !approver || !applicant) {
                    return res.status(200).send({ 'errors': '缺少参数' });
                }

                formula_values = Form_formula.init_formula_values(fields, autoFormDoc, approver, applicant, spaceId);

                res.status(200).send({ 'formula_values': formula_values });
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
