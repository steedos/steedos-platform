var express = require('express');
var reporter = require('./reporter');
var objectql = require("@steedos/objectql");

var routes = express();

routes.get('/mrt/:report_id', async (req, res)=> {
  let datasource = objectql.getSteedosSchema().getDataSource();
  let report = datasource.getReport("temp");
  let mrt = reporter.getReportMrt(report);
  res.send(mrt);
});

routes.get('/data/:report_id', async (req, res) => {
  let datasource = objectql.getSteedosSchema().getDataSource();
  let report = datasource.getReport("temp");
  let data = await reporter.getData(report);
  res.send(data);
});

module.exports.routes = routes;
