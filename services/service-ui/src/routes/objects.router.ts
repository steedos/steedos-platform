/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-09 10:19:47
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-11-14 11:11:06
 * @Description: 
 */
import { getSteedosSchema } from "@steedos/objectql";
const express = require('express');
const router =express.Router();
const core = require('@steedos/core');


const callObjectServiceAction = async function(actionName, userSession, data?){
    const broker = getSteedosSchema().broker;
    return broker.call(actionName, data, { meta: { user: userSession}})
}

const getObjectName = function(objectServiceName){
    return objectServiceName.substring(1);
}

router.get('/service/api/:objectServiceName/fields', core.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    try {
        const { objectServiceName } = req.params;
        const result = await callObjectServiceAction(`objectql.getFields`, userSession, { objectName: getObjectName(objectServiceName) });
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/service/api/:objectServiceName/getUserObjectPermission', core.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    try {
        const { objectServiceName } = req.params;
        const result = await callObjectServiceAction(`objectql.getUserObjectPermission`, userSession, { objectName: getObjectName(objectServiceName) });
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/service/api/:objectServiceName/recordPermissions/:recordId', core.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    try {
        const { objectServiceName, recordId } = req.params;
        const result = await callObjectServiceAction(`objectql.getRecordPermissionsById`, userSession, {
            objectName: getObjectName(objectServiceName),
            recordId: recordId
        });
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/service/api/:objectServiceName/uiSchema', core.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    try {
        const { objectServiceName } = req.params;
        const objectName = objectServiceName.substring(1);
        const [ result, hasImportTemplates ] = await Promise.all([
            callObjectServiceAction(`objectql.getRecordView`, userSession, { objectName }),
            callObjectServiceAction(`@steedos/data-import.hasImportTemplates`, userSession, {
                objectName: objectName
            })
        ])
        result.hasImportTemplates = hasImportTemplates 
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/service/api/:objectServiceName/defUiSchema', core.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    try {
        const { objectServiceName } = req.params;
        const result = await callObjectServiceAction(`objectql.createDefaultRecordView`, userSession, { objectName: getObjectName(objectServiceName) });
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/service/api/:objectServiceName/uiSchemaTemplate', core.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    try {
        const { objectServiceName } = req.params;
        const result = await callObjectServiceAction(`objectql.getDefaultRecordView`, userSession, { objectName: getObjectName(objectServiceName) });
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/service/api/:objectServiceName/relateds', core.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    try {
        const { objectServiceName } = req.params;
        const result = await callObjectServiceAction(`objectql.getRelateds`, userSession, { objectName: getObjectName(objectServiceName) });
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

exports.default = router;