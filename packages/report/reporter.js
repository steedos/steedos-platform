const utils = require('./utils');
const request = require('graphql-request').request;

let reporter = {
  async getReport(id) {
    let object = utils.getObject('reports');
    let report = await object.findOne(id);
    return report;
  },
  async getData(report) {
    if (report.graphql){
      let dataResult = await request("http://localhost:3600/graphql/default/", report.graphql);
      return dataResult;
    }
    else {
      let object = utils.getObject(report.object_name);
      let dataResult = await object.find({
        fields: report.fields,
        filters: report.filters
      });
      let result = {};
      result[`${report.object_name}`] = dataResult;
      return result;
    }
  }
};

module.exports = reporter;
