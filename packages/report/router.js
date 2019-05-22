var express = require('express');
var reporter = require('./reporter');

var routes = express();

routes.get('/mrt/:report_id', async (req, res)=> {
  let report = await reporter.core.getReport(req.params.report_id);
  let simpleList = reporter.core.getReportMrt(report);
  res.send(simpleList);
});

routes.get('/data/:report_id', async (req, res) => {
  let report = await reporter.core.getReport(req.params.report_id);
  let data = await reporter.core.getData(report);
  res.send(data);
});

module.exports.routes = routes;
