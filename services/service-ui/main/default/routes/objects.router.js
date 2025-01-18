"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const objectql_1 = require("@steedos/objectql");
const express = require('express');
const router = express.Router();
const core = require('@steedos/core');
const callObjectServiceAction = function (actionName, userSession, data) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const broker = (0, objectql_1.getSteedosSchema)().broker;
        return broker.call(actionName, data, { meta: { user: userSession } });
    });
};
const getObjectName = function (objectServiceName) {
    return objectServiceName.substring(1);
};
router.get('/service/api/:objectServiceName/fields', core.requireAuthentication, function (req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const userSession = req.user;
        try {
            const { objectServiceName } = req.params;
            const result = yield callObjectServiceAction(`objectql.getFields`, userSession, { objectName: getObjectName(objectServiceName) });
            res.status(200).send(result);
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    });
});
router.get('/service/api/:objectServiceName/getUserObjectPermission', core.requireAuthentication, function (req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const userSession = req.user;
        try {
            const { objectServiceName } = req.params;
            const result = yield callObjectServiceAction(`objectql.getUserObjectPermission`, userSession, { objectName: getObjectName(objectServiceName) });
            res.status(200).send(result);
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    });
});
router.get('/service/api/:objectServiceName/recordPermissions/:recordId', core.requireAuthentication, function (req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const userSession = req.user;
        try {
            const { objectServiceName, recordId } = req.params;
            const result = yield callObjectServiceAction(`objectql.getRecordPermissionsById`, userSession, {
                objectName: getObjectName(objectServiceName),
                recordId: recordId
            });
            res.status(200).send(result);
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    });
});
router.get('/service/api/:objectServiceName/uiSchema', core.requireAuthentication, function (req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const userSession = req.user;
        try {
            const { objectServiceName } = req.params;
            const objectName = objectServiceName.substring(1);
            const [result] = yield Promise.all([
                callObjectServiceAction(`objectql.getRecordView`, userSession, { objectName }),
            ]);
            res.status(200).send(result);
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    });
});
router.post('/service/api/:objectServiceName/defUiSchema', core.requireAuthentication, function (req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const userSession = req.user;
        try {
            const { objectServiceName } = req.params;
            const result = yield callObjectServiceAction(`objectql.createDefaultRecordView`, userSession, { objectName: getObjectName(objectServiceName) });
            res.status(200).send(result);
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    });
});
router.get('/service/api/:objectServiceName/uiSchemaTemplate', core.requireAuthentication, function (req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const userSession = req.user;
        try {
            const { objectServiceName } = req.params;
            const result = yield callObjectServiceAction(`objectql.getDefaultRecordView`, userSession, { objectName: getObjectName(objectServiceName) });
            res.status(200).send(result);
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    });
});
router.get('/service/api/:objectServiceName/relateds', core.requireAuthentication, function (req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const userSession = req.user;
        try {
            const { objectServiceName } = req.params;
            const result = yield callObjectServiceAction(`objectql.getRelateds`, userSession, { objectName: getObjectName(objectServiceName) });
            res.status(200).send(result);
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    });
});
exports.default = router;
