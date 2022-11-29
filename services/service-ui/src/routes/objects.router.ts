/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-09 10:19:47
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-28 17:59:54
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


router.get('/service/api/:objectServiceName/fields', core.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    try {
        const { objectServiceName } = req.params;
        const result = await callObjectServiceAction(`${objectServiceName}.getFields`, userSession);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/service/api/:objectServiceName/getUserObjectPermission', core.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    try {
        const { objectServiceName } = req.params;
        const result = await callObjectServiceAction(`${objectServiceName}.getUserObjectPermission`, userSession);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/service/api/:objectServiceName/recordPermissions/:recordId', core.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    try {
        const { objectServiceName, recordId } = req.params;
        const result = await callObjectServiceAction(`${objectServiceName}.getRecordPermissionsById`, userSession, {
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
            callObjectServiceAction(`${objectServiceName}.getRecordView`, userSession),
            callObjectServiceAction(`~packages-@steedos/data-import.hasImportTemplates`, userSession, {
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
        const result = await callObjectServiceAction(`${objectServiceName}.createDefaultRecordView`, userSession);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/service/api/:objectServiceName/uiSchemaTemplate', core.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    try {
        const { objectServiceName } = req.params;
        const result = await callObjectServiceAction(`${objectServiceName}.getDefaultRecordView`, userSession);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/service/api/:objectServiceName/relateds', core.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    try {
        const { objectServiceName } = req.params;
        const result = await callObjectServiceAction(`${objectServiceName}.getRelateds`, userSession);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

exports.default = router;