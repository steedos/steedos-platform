/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-04-17 16:17:02
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-03-03 16:28:42
 * @Description:
 */
const { requireAuthentication } = require("@steedos/auth");
const { getObject, recomputeFormulaValues, recomputeSummaryValues } = require("@steedos/objectql");
const express = require("express");
const router = express.Router();
const _ = require("lodash");

router.post(
    "/api/object_fields/recomputeFormulaValues",
    requireAuthentication,
    async function (req, res) {
        const userSession = req.user;
        if(!userSession.is_space_admin){
            return res.status(401).send({});
        }
        try {
            let fieldId = req.body.record_id;
            const fieldDoc = await getObject("object_fields").findOne(fieldId, { fields: ["object", "name"] });
            if (!fieldDoc) {
                throw new Error(`recomputeFormulaValues:${fieldId} not found.`);
            }
            fieldId = `${fieldDoc.object}.${fieldDoc.name}`;
            const result = await recomputeFormulaValues(fieldId, req.user);
            if(result){
                return res.status(200).send({ success: true });
            }
            else{
                return res.status(400).send({
                    success: false,
                    error: {
                        reason: `The recomputeFormulaValues function return ${result}.`
                    }
                });
            }
        } catch (error) {
            return res.status(200).send({
                status: 500,
                msg: error.message,
            });
        }
    }
);

router.post(
    "/api/object_fields/recomputeSummaryValues",
    requireAuthentication,
    async function (req, res) {
        const userSession = req.user;
        if(!userSession.is_space_admin){
            return res.status(401).send({});
        }
        try {
            let fieldId = req.body.record_id;
            const fieldDoc = await getObject("object_fields").findOne(fieldId, { fields: ["object", "name"] });
            if (!fieldDoc) {
                throw new Error(`recomputeFormulaValues:${fieldId} not found.`);
            }
            fieldId = `${fieldDoc.object}.${fieldDoc.name}`;
            const result = await recomputeSummaryValues(fieldId, req.user);
            if(result){
                return res.status(200).send({ success: true });
            }
            else{
                return res.status(400).send({
                    success: false,
                    error: {
                        reason: `The recomputeSummaryValues function return ${result}.`
                    }
                });
            }
        } catch (error) {
            return res.status(200).send({
                status: 500,
                msg: error.message,
            });
        }
    }
);

exports.default = router;
