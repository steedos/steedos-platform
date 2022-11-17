const router = require('@steedos/router').staticRouter();
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