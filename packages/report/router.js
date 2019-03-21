var express = require('express');
var reporter = require('./reporter');

var routes = express();

routes.get('/mrt/:report_id', function (req, res) {
  let report = reporter.core.getReport();
  let simpleList = reporter.core.getReportMrt(report);
  res.send(simpleList);
});

routes.get('/data/:report_id', function (req, res) {
  let data = reporter.core.getData();
  res.send(data);
});

module.exports.routes = routes;
