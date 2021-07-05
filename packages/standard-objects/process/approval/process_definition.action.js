const _ = require("lodash");
module.exports = {
  enableVisible: function (object_name, record_id, record_permissions) {
    var result = Steedos.authRequest(`/api/v4/${object_name}/${record_id}`, { type: 'get', async: false });
    return !result.active && !result.is_system
  },
  enable: function (object_name, record_id, fields) {
    Steedos.authRequest(`/api/v4/${object_name}/${record_id}`, { type: 'put', async: false, data: JSON.stringify({ active: true }) });
    FlowRouter.reload();
  },
  disableVisible: function (object_name, record_id, record_permissions) {
    var result = Steedos.authRequest(`/api/v4/${object_name}/${record_id}`, { type: 'get', async: false });
    return result.active && !result.is_system
  },
  disable: function (object_name, record_id, fields) {
    Steedos.authRequest(`/api/v4/${object_name}/${record_id}`, { type: 'put', async: false, data: JSON.stringify({ active: false }) });
    FlowRouter.reload();
  },
  copyVisible: true,
  copy: function (object_name, record_id, fields) {
    let result = Steedos.authRequest(`/api/v4/${object_name}/${record_id}/copy`, { type: 'get', async: false });
    FlowRouter.go(`/app/admin/process_definition/view/${result._id}`);
  },
  customize: function (object_name, record_id, fields) {
    let result = Steedos.authRequest(`/api/v4/${object_name}/${record_id}/customize`, { type: 'get', async: false });
    FlowRouter.go(`/app/admin/process_definition/view/${result._id}`);
  },
  customizeVisible: function (object_name, record_id, record_permissions, record) {
    if (!record) {
      record = {}
    }
    return Creator.baseObject.actions.standard_new.visible() && record.is_system;
  }
}
