const express = require('express');
const reporter = require('./reporter');
const objectql = require("@steedos/objectql");
const mrt = require('./mrt');
const routes = express();
const bodyParser = require('body-parser');

routes.use(bodyParser.json());

// 获取报表模板
routes.get('/mrt/:report_id', async (req, res) => {
  let report_id = req.params.report_id;
  let datasource = objectql.getSteedosSchema().getDataSource();
  let report = datasource.getReport(report_id);
  let mrtContent = mrt.getMrtContent(report);
  res.send(mrtContent);
});

// 报表mrt模板保存
routes.post('/mrt/:report_id', async (req, res) => {
  let report_id = req.params.report_id;
  let datasource = objectql.getSteedosSchema().getDataSource();
  let report = datasource.getReport(report_id).toConfig();
  mrt.saveReportToMrtFile(report.mrt_file, req.body);
  res.send({});
});

// 获取报表数据
routes.get('/data/:report_id', async (req, res) => {
  let report_id = req.params.report_id;
  let datasource = objectql.getSteedosSchema().getDataSource();
  let report = datasource.getReport(report_id);
  let data = await reporter.getData(report);
  res.send(data);
});

// 获取报表列表
routes.get('/list', async (req, res) => {
  let datasource = objectql.getSteedosSchema().getDataSource();
  let report = datasource.getReportsConfig();
  res.send(report);
});

module.exports.routes = routes;
