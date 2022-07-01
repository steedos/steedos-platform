const express = require("express");
const router = express.Router();
const core = require('@steedos/core');
const Stimulsoft = require('stimulsoft-reports-js');
const { getReportWithData } = require(`./util`);

router.get('/api/stimulsoft-reports/open/:reportId', core.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    const spaceId = userSession.spaceId;
    const userId = userSession.userId;
    const { reportId } = req.params;
    let {  parameters } = req.query;
    try {
        parameters = JSON.parse(parameters);
        const { report } = await getReportWithData(reportId, userId, spaceId, parameters);
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