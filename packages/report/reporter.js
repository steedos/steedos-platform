const utils = require('./utils');

let reporter = {
  async getReport(id) {
    let object = utils.getObject('reports');
    let report = await object.findOne(id);
    return report;
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
