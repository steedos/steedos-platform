/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-17 16:29:16
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-28 18:02:09
 * @Description: 
 */
const express = require('express');
const router = express.Router();
const core = require('@steedos/core');
const { getReportWithData } = require(`./util`);

router.get('/api/stimulsoft-reports/open/:reportId', core.requireAuthentication, async function (req, res) {
    const Stimulsoft = require('stimulsoft-reports-js');
    const userSession = req.user;
    const { reportId } = req.params;
    let {  parameters } = req.query;
    try {
        parameters = JSON.parse(parameters);
        const { report } = await getReportWithData(reportId, userSession, parameters);
        // Renreding report
        report.renderAsync(function () {
            var htmlString = report.exportDocument(Stimulsoft.Report.StiExportFormat.Html);
            res.setHeader('Content-Type', 'text/html');
            res.status(200).send(htmlString);
        });
    } catch (Exception) {
        console.log(Exception);
        res.status(200).send(Exception.message);
    }
});
exports.default = router;