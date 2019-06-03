const express = require('express');
const reporter = require('./reporter');
const objectql = require("@steedos/objectql");
const mrt = require('./mrt');
const routes = express();
const bodyParser = require('body-parser');

routes.use(bodyParser.json());

routes.get('/mrt/:report_id', async (req, res) => {
  let datasource = objectql.getSteedosSchema().getDataSource();
  let report = datasource.getReport("temp");
  let mrtContent = mrt.getMrtContent(report);
  res.send(mrtContent);
});

routes.post('/mrt/:report_id', (req, res) => {
  let datasource = objectql.getSteedosSchema().getDataSource();
  let report = datasource.getReport("temp").toConfig();
  mrt.saveReportToMrtFile(report.mrt_file, req.body);
  res.send(report);
});

routes.get('/data/:report_id', async (req, res) => {
  let datasource = objectql.getSteedosSchema().getDataSource();
  let report = datasource.getReport("temp");
  let data = await reporter.getData(report);
  res.send(data);
});

module.exports.routes = routes;
