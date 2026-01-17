"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objectql_1 = require("@steedos/objectql");
const express = require("express");
const router = express.Router();
const auth = require("@steedos/auth");
const _ = require("lodash");
const callObjectServiceAction = async function (actionName, userSession, data) {
    const broker = (0, objectql_1.getSteedosSchema)().broker;
    return broker.call(actionName, data, { meta: { user: userSession } });
};
const getObjectName = function (objectServiceName) {
    return objectServiceName.substring(1);
};
router.get("/service/api/:objectServiceName/fields", auth.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    try {
        const { objectServiceName } = req.params;
        const { fields } = req.query;
        const result = await callObjectServiceAction(`objectql.getFields`, userSession, { objectName: getObjectName(objectServiceName) });
        if (fields) {
            const result2 = {};
            _.each(result, function (item, k) {
                return (result2[k] = _.pick(item, _.split(fields, ",")));
            });
            return res.status(200).send(result2);
        }
        res.status(200).send(result);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
router.get("/service/api/:objectServiceName/getUserObjectPermission", auth.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    try {
        const { objectServiceName } = req.params;
        const result = await callObjectServiceAction(`objectql.getUserObjectPermission`, userSession, { objectName: getObjectName(objectServiceName) });
        res.status(200).send(result);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
router.get("/service/api/:objectServiceName/recordPermissions/:recordId", auth.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    try {
        const { objectServiceName, recordId } = req.params;
        const result = await callObjectServiceAction(`objectql.getRecordPermissionsById`, userSession, {
            objectName: getObjectName(objectServiceName),
            recordId: recordId,
        });
        res.status(200).send(result);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
router.get("/service/api/:objectServiceName/uiSchema", auth.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    try {
        const { objectServiceName } = req.params;
        const objectName = objectServiceName.substring(1);
        const [result] = await Promise.all([
            callObjectServiceAction(`objectql.getRecordView`, userSession, {
                objectName,
            }),
        ]);
        res.status(200).send(result);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
router.post("/service/api/:objectServiceName/defUiSchema", auth.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    try {
        const { objectServiceName } = req.params;
        const result = await callObjectServiceAction(`objectql.createDefaultRecordView`, userSession, { objectName: getObjectName(objectServiceName) });
        res.status(200).send(result);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
router.get("/service/api/:objectServiceName/uiSchemaTemplate", auth.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    try {
        const { objectServiceName } = req.params;
        const result = await callObjectServiceAction(`objectql.getDefaultRecordView`, userSession, { objectName: getObjectName(objectServiceName) });
        res.status(200).send(result);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
router.get("/service/api/:objectServiceName/relateds", auth.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    try {
        const { objectServiceName } = req.params;
        const result = await callObjectServiceAction(`objectql.getRelateds`, userSession, { objectName: getObjectName(objectServiceName) });
        res.status(200).send(result);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
exports.default = router;
