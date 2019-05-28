const utils = require('./utils');

let reporter = {
  async getReport(id) {
    let object = utils.getObject('reports');
    let report = await object.findOne(id);
    return report;
  },
  getBlankMrt(report) {
    let objectConfig = utils.getObjectConfig(report.object_name);
    let databases = utils.getDatabases(report, objectConfig);
    let dataSources = utils.getDataSources(report, objectConfig);
    return {
      "ReportVersion": "2019.2.1",
      "ReportGuid": "2cad802c0dafb11543b53058f6f97645",
      "ReportName": "Report",
      "ReportAlias": "Report",
      "ReportFile": "Blank.mrt",
      "ReportCreated": "/Date(1559022984000+0800)/",
      "ReportChanged": "/Date(1559022984000+0800)/",
      "EngineVersion": "EngineV2",
      "CalculationMode": "Interpretation",
      "ReportUnit": "Centimeters",
      "PreviewSettings": 268435455,
      "Dictionary": {
        "DataSources": dataSources,
        "Databases": databases
      },
      "Pages": {
        "0": {
          "Ident": "StiPage",
          "Name": "Page1",
          "Guid": "47bcaf029c0e3c47e55d68b8741289c1",
          "Interaction": {
            "Ident": "StiInteraction"
          },
          "Border": ";;2;;;;;solid:Black",
          "Brush": "solid:Transparent",
          "PageWidth": 21.01,
          "PageHeight": 29.69,
          "Watermark": {
            "TextBrush": "solid:50,0,0,0"
          },
          "Margins": {
            "Left": 1,
            "Right": 1,
            "Top": 1,
            "Bottom": 1
          }
        }
      }
    }
  },
  async getData(report) {
    let object = utils.getObject(report.object_name);
    let dataResult = await object.find({
      fields: report.fields,
      filters: report.filters
    });
    let result = {};
    result[`${report.object_name}`] = dataResult;
    return result;
  }
};

module.exports = reporter;
