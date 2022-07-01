const express = require("express");
const router = express.Router();
const core = require('@steedos/core');
const objectql = require('@steedos/objectql');
const path = require('path');

const { getReportWithData, getDatabase } = require(`./util`);

router.get('/api/stimulsoft-reports/view/:reportId', core.requireAuthentication, async function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

router.get('/api/stimulsoft-reports/view/:reportId/getReport', core.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    const spaceId = userSession.spaceId;
    const userId = userSession.userId;
    // const isSpaceAdmin = userSession.is_space_admin;
    const { reportId } = req.params;
    let {  parameters } = req.query;
    try {
        if( parameters){
            parameters = JSON.parse(parameters);
        }
        const { report } = await getReportWithData(reportId, userId, spaceId, parameters);
        // Renreding report
        report.renderAsync(function () {
            var reportJson = report.saveDocumentToJsonString();
            res.status(200).send(reportJson);
        });
    } catch (Exception) {
        console.log(`Exception`, Exception);
        res.status(200).send(Exception.message);
    }
});

router.get('/api/stimulsoft-reports/view/:reportId/mrt', core.requireAuthentication, async function (req, res) {
    // const userSession = req.user;
    // const spaceId = userSession.spaceId;
    // const userId = userSession.userId;
    // const isSpaceAdmin = userSession.is_space_admin;
    const { reportId } = req.params;
    const record = await objectql.getObject('stimulsoft_reports').findOne(reportId);
    res.status(200).send(record.report_mrt || {});
});

/**
 * TODO 限制返回的记录数
 * return {
 *  serviceName:
 *  sampleConnectionString:
 *  data:
 *  types:
 * }
 */
router.get('/api/stimulsoft-reports/view/:reportId/database', core.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    const spaceId = userSession.spaceId;
    const userId = userSession.userId;
    const { reportId } = req.params;
    let result = {
        serviceName: '',
        sampleConnectionString: '',
        data: {},
        types: {},
    }
    try {
        result = await getDatabase(reportId, userId, spaceId, {});
    } catch (Exception) {
        console.log(Exception);
        res.status(200).send(Exception.message);
    }
    res.status(200).send(result);
});

exports.default = router;