/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-09 10:19:47
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-01-21 18:19:10
 * @Description: 
 */
import { getSteedosSchema } from "@steedos/objectql";
const express = require('express');
const router =express.Router();
const auth = require('@steedos/auth');

console.log('===uiSchema===api')
const callObjectServiceAction = async function(actionName, userSession, data?){
    const broker = getSteedosSchema().broker;
    return broker.call(actionName, data, { meta: { user: userSession}})
}

const getObjectName = function(objectServiceName){
    return objectServiceName.substring(1);
}

router.get('/service/api/:objectServiceName/fields', auth.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    try {
        const { objectServiceName } = req.params;
        const result = await callObjectServiceAction(`objectql.getFields`, userSession, { objectName: getObjectName(objectServiceName) });
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/service/api/:objectServiceName/getUserObjectPermission', auth.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    try {
        const { objectServiceName } = req.params;
        const result = await callObjectServiceAction(`objectql.getUserObjectPermission`, userSession, { objectName: getObjectName(objectServiceName) });
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/service/api/:objectServiceName/recordPermissions/:recordId', auth.requireAuthentication, async function (req, res) {
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

router.get('/service/api/:objectServiceName/uiSchema', auth.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    try {
        const { objectServiceName } = req.params;
        const objectName = objectServiceName.substring(1);
        // const [ result, hasImportTemplates ] = await Promise.all([
        //     callObjectServiceAction(`objectql.getRecordView`, userSession, { objectName }),
        //     callObjectServiceAction(`@steedos/data-import.hasImportTemplates`, userSession, {
        //         objectName: objectName
        //     })
        // ])
        // result.hasImportTemplates = hasImportTemplates  //TODO  这段查的有点多
        const [ result ] = await Promise.all([
            callObjectServiceAction(`objectql.getRecordView`, userSession, { objectName }),
        ])
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/service/api/:objectServiceName/defUiSchema', auth.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    try {
        const { objectServiceName } = req.params;
        const result = await callObjectServiceAction(`objectql.createDefaultRecordView`, userSession, { objectName: getObjectName(objectServiceName) });
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/service/api/:objectServiceName/uiSchemaTemplate', auth.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    try {
        const { objectServiceName } = req.params;
        const result = await callObjectServiceAction(`objectql.getDefaultRecordView`, userSession, { objectName: getObjectName(objectServiceName) });
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/service/api/:objectServiceName/relateds', auth.requireAuthentication, async function (req, res) {
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