const express = require('express');
const reporter = require('./reporter');
const objectql = require("@steedos/objectql");
const mrt = require('./mrt');
const routes = express();

routes.get('/mrt/:report_id', async (req, res)=> {
  let datasource = objectql.getSteedosSchema().getDataSource();
  let report = datasource.getReport("temp");
  let mrtContent = mrt.getMrtContent(report);
  res.send(mrtContent);
});

routes.get('/data/:report_id', async (req, res) => {
  let datasource = objectql.getSteedosSchema().getDataSource();
  let report = datasource.getReport("temp");
  let data = await reporter.getData(report);
  res.send(data);
});

module.exports.routes = routes;
